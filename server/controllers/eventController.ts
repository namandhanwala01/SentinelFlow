import { Request, Response } from 'express';
import { eventService } from '../services/eventService';
import { ThreatPipeline } from '../services/ai/pipeline';
import { threatService } from '../services/threatService';

export const getEvents = async (req: Request, res: Response) => {
  try {
    const { severity, category, search, threatId, page, limit } = req.query;
    const result = await eventService.getEvents({
      severity: severity as string,
      category: category as string,
      search: search as string,
      threatId: threatId as string,
      page: page ? parseInt(page as string, 10) : 1,
      limit: limit ? parseInt(limit as string, 10) : 50,
    });
    res.status(200).json({ success: true, ...result });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getEventById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const event = await eventService.getEventById(id);
    if (!event) {
      return res.status(404).json({ success: false, message: `Event ${id} not found` });
    }
    res.status(200).json({ success: true, data: event });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const ingestEvent = async (req: Request, res: Response) => {
  try {
    const rawPayload = req.body;
    const pipelineResult = ThreatPipeline.processEvent(rawPayload);

    await eventService.createEvent(pipelineResult.normalizedEvent);

    if (pipelineResult.isThreat && pipelineResult.threat) {
      await threatService.upsertThreat(pipelineResult.threat);
    }

    res.status(201).json({
      success: true,
      data: pipelineResult.normalizedEvent,
      threatDetected: pipelineResult.isThreat,
      threat: pipelineResult.threat,
      analysis: pipelineResult.analysisSummary,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
