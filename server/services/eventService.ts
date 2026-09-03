import { SecurityEvent } from '../types';
import { SecurityEventModel } from '../models/SecurityEvent';
import { isDatabaseConnected } from '../config/database';
import { seedEvents } from '../seed/seedData';

class EventService {
  private inMemoryEvents: SecurityEvent[] = JSON.parse(JSON.stringify(seedEvents));

  public async getEvents(filters?: {
    severity?: string;
    category?: string;
    search?: string;
    threatId?: string;
    page?: number;
    limit?: number;
  }): Promise<{ events: SecurityEvent[]; total: number; page: number; totalPages: number }> {
    const page = filters?.page || 1;
    const limit = filters?.limit || 50;

    if (isDatabaseConnected()) {
      try {
        const query: any = {};
        if (filters?.severity && filters.severity !== 'ALL') query.severity = filters.severity;
        if (filters?.category && filters.category !== 'ALL') query.category = filters.category;
        if (filters?.threatId) query.threatId = filters.threatId;
        if (filters?.search) {
          query.$or = [
            { event: { $regex: filters.search, $options: 'i' } },
            { details: { $regex: filters.search, $options: 'i' } },
            { source: { $regex: filters.search, $options: 'i' } },
            { sourceIp: { $regex: filters.search, $options: 'i' } },
            { destination: { $regex: filters.search, $options: 'i' } },
          ];
        }

        const total = await SecurityEventModel.countDocuments(query);
        const docs = await SecurityEventModel.find(query)
          .sort({ timestamp: -1 })
          .skip((page - 1) * limit)
          .limit(limit)
          .lean();

        if (docs && docs.length > 0) {
          return {
            events: docs as unknown as SecurityEvent[],
            total,
            page,
            totalPages: Math.ceil(total / limit),
          };
        }
      } catch (err: any) {
        console.error('[EventService] Mongo query error:', err.message);
      }
    }

    const filtered = this.inMemoryEvents.filter((evt) => {
      const matchSeverity = !filters?.severity || filters.severity === 'ALL' || evt.severity === filters.severity;
      const matchCategory = !filters?.category || filters.category === 'ALL' || evt.category === filters.category;
      const matchThreat = !filters?.threatId || evt.threatId === filters.threatId;
      const matchSearch =
        !filters?.search ||
        evt.event.toLowerCase().includes(filters.search.toLowerCase()) ||
        evt.details.toLowerCase().includes(filters.search.toLowerCase()) ||
        evt.source.toLowerCase().includes(filters.search.toLowerCase()) ||
        evt.sourceIp.includes(filters.search) ||
        evt.destination.toLowerCase().includes(filters.search.toLowerCase());

      return matchSeverity && matchCategory && matchThreat && matchSearch;
    });

    const total = filtered.length;
    const paginated = filtered.slice((page - 1) * limit, page * limit);

    return {
      events: paginated,
      total,
      page,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    };
  }

  public async getEventById(id: string): Promise<SecurityEvent | null> {
    if (isDatabaseConnected()) {
      try {
        const doc = await SecurityEventModel.findOne({ id }).lean();
        if (doc) return doc as unknown as SecurityEvent;
      } catch (err: any) {
        console.error('[EventService] Mongo findOne error:', err.message);
      }
    }
    const found = this.inMemoryEvents.find((e) => e.id === id);
    return found || null;
  }

  public async createEvent(event: SecurityEvent): Promise<SecurityEvent> {
    if (isDatabaseConnected()) {
      try {
        await SecurityEventModel.create(event);
      } catch (err: any) {
        console.error('[EventService] Mongo create error:', err.message);
      }
    }

    this.inMemoryEvents.unshift(event);
    return event;
  }
}

export const eventService = new EventService();
