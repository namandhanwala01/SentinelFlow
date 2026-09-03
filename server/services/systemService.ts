import { MonitoredSystem } from '../types';
import { MonitoredSystemModel } from '../models/MonitoredSystem';
import { isMongoConnected } from '../config/database';
import { seedSystems } from '../seed/seedData';

class SystemService {
  private inMemorySystems: MonitoredSystem[] = JSON.parse(JSON.stringify(seedSystems));

  public async getAllSystems(filters?: {
    status?: string;
    type?: string;
    search?: string;
  }): Promise<MonitoredSystem[]> {
    if (isMongoConnected) {
      try {
        const query: any = {};
        if (filters?.status && filters.status !== 'ALL') query.status = filters.status;
        if (filters?.type && filters.type !== 'ALL') query.type = filters.type;
        if (filters?.search) {
          query.$or = [
            { name: { $regex: filters.search, $options: 'i' } },
            { ip: { $regex: filters.search, $options: 'i' } },
            { os: { $regex: filters.search, $options: 'i' } },
          ];
        }

        const docs = await MonitoredSystemModel.find(query).sort({ riskScore: -1 }).lean();
        if (docs && docs.length > 0) {
          return docs as unknown as MonitoredSystem[];
        }
      } catch (err: any) {
        console.warn('[SystemService] Mongo query error:', err.message);
      }
    }

    return this.inMemorySystems.filter((sys) => {
      const matchStatus = !filters?.status || filters.status === 'ALL' || sys.status === filters.status;
      const matchType = !filters?.type || filters.type === 'ALL' || sys.type === filters.type;
      const matchSearch =
        !filters?.search ||
        sys.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        sys.ip.includes(filters.search) ||
        sys.os.toLowerCase().includes(filters.search.toLowerCase());

      return matchStatus && matchType && matchSearch;
    });
  }

  public async getSystemById(id: string): Promise<MonitoredSystem | null> {
    if (isMongoConnected) {
      try {
        const doc = await MonitoredSystemModel.findOne({ id }).lean();
        if (doc) return doc as unknown as MonitoredSystem;
      } catch (err: any) {
        console.warn('[SystemService] Mongo findOne error:', err.message);
      }
    }
    const found = this.inMemorySystems.find((s) => s.id === id);
    return found || null;
  }
}

export const systemService = new SystemService();
