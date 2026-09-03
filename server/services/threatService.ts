import { Threat, MetricSummary, ThreatStatus } from '../types';
import { ThreatModel } from '../models/Threat';
import { isMongoConnected } from '../config/database';
import { seedThreats } from '../seed/seedData';

class ThreatService {
  // In-memory cache/store fallback
  private inMemoryThreats: Threat[] = JSON.parse(JSON.stringify(seedThreats));

  public async getAllThreats(filters?: {
    risk?: string;
    status?: string;
    stage?: string;
    search?: string;
  }): Promise<Threat[]> {
    if (isMongoConnected) {
      try {
        const query: any = {};
        if (filters?.risk && filters.risk !== 'ALL') query.risk = filters.risk;
        if (filters?.status && filters.status !== 'ALL') query.status = filters.status;
        if (filters?.stage && filters.stage !== 'ALL') query.currentStage = filters.stage;
        if (filters?.search) {
          query.$or = [
            { name: { $regex: filters.search, $options: 'i' } },
            { summary: { $regex: filters.search, $options: 'i' } },
            { affectedSystem: { $regex: filters.search, $options: 'i' } },
            { sourceIp: { $regex: filters.search, $options: 'i' } },
            { attackType: { $regex: filters.search, $options: 'i' } },
          ];
        }
        const docs = await ThreatModel.find(query).sort({ riskScore: -1 }).lean();
        if (docs && docs.length > 0) {
          return docs as unknown as Threat[];
        }
      } catch (err: any) {
        console.warn('[ThreatService] MongoDB query fallback to in-memory:', err.message);
      }
    }

    // In-memory query
    return this.inMemoryThreats.filter((t) => {
      const matchRisk = !filters?.risk || filters.risk === 'ALL' || t.risk === filters.risk;
      const matchStatus = !filters?.status || filters.status === 'ALL' || t.status === filters.status;
      const matchStage = !filters?.stage || filters.stage === 'ALL' || t.currentStage === filters.stage;
      const matchSearch =
        !filters?.search ||
        t.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        t.summary.toLowerCase().includes(filters.search.toLowerCase()) ||
        t.affectedSystem.toLowerCase().includes(filters.search.toLowerCase()) ||
        t.sourceIp.includes(filters.search) ||
        t.attackType.toLowerCase().includes(filters.search.toLowerCase());

      return matchRisk && matchStatus && matchStage && matchSearch;
    });
  }

  public async getThreatById(id: string): Promise<Threat | null> {
    if (isMongoConnected) {
      try {
        const doc = await ThreatModel.findOne({ id }).lean();
        if (doc) return doc as unknown as Threat;
      } catch (err: any) {
        console.warn('[ThreatService] Mongo findOne error:', err.message);
      }
    }
    const found = this.inMemoryThreats.find((t) => t.id === id);
    return found || null;
  }

  public async updateThreatStatus(id: string, status: ThreatStatus): Promise<Threat | null> {
    if (isMongoConnected) {
      try {
        const updated = await ThreatModel.findOneAndUpdate(
          { id },
          { $set: { status } },
          { returnDocument: 'after' }
        ).lean();
        if (updated) return updated as unknown as Threat;
      } catch (err: any) {
        console.warn('[ThreatService] Mongo update error:', err.message);
      }
    }

    const threat = this.inMemoryThreats.find((t) => t.id === id);
    if (threat) {
      threat.status = status;
      return threat;
    }
    return null;
  }

  public async upsertThreat(threat: Threat): Promise<Threat> {
    if (isMongoConnected) {
      try {
        await ThreatModel.findOneAndUpdate({ id: threat.id }, threat, { upsert: true, returnDocument: 'after' });
      } catch (err: any) {
        console.warn('[ThreatService] Mongo upsert error:', err.message);
      }
    }

    const index = this.inMemoryThreats.findIndex((t) => t.id === threat.id);
    if (index >= 0) {
      this.inMemoryThreats[index] = threat;
    } else {
      this.inMemoryThreats.unshift(threat);
    }
    return threat;
  }

  public async getMetricsSummary(monitoredSystemsCount = 10): Promise<MetricSummary> {
    const threats = await this.getAllThreats();
    const critical = threats.filter((t) => t.risk === 'CRITICAL').length;
    const high = threats.filter((t) => t.risk === 'HIGH').length;
    const medium = threats.filter((t) => t.risk === 'MEDIUM').length;
    const low = threats.filter((t) => t.risk === 'LOW').length;

    return {
      totalThreats: threats.length,
      criticalRisk: critical,
      highRisk: high,
      mediumRisk: medium,
      lowRisk: low,
      systemsMonitored: monitoredSystemsCount,
      overallRiskScore: 87,
      riskScoreChange: 4,
    };
  }
}

export const threatService = new ThreatService();
