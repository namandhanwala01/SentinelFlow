import { Request, Response } from 'express';
import { threatService } from '../services/threatService';
import { systemService } from '../services/systemService';

export const getThreats = async (req: Request, res: Response) => {
  try {
    const { risk, status, stage, search } = req.query;
    const threats = await threatService.getAllThreats({
      risk: risk as string,
      status: status as string,
      stage: stage as string,
      search: search as string,
    });
    res.status(200).json({ success: true, count: threats.length, data: threats });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getThreatById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const threat = await threatService.getThreatById(id);
    if (!threat) {
      return res.status(404).json({ success: false, message: `Threat ${id} not found` });
    }
    res.status(200).json({ success: true, data: threat });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateThreatStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!status || !['Active', 'Investigating', 'Contained', 'Resolved'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be one of: Active, Investigating, Contained, Resolved',
      });
    }

    const updated = await threatService.updateThreatStatus(id, status);
    if (!updated) {
      return res.status(404).json({ success: false, message: `Threat ${id} not found` });
    }
    res.status(200).json({ success: true, data: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMetrics = async (req: Request, res: Response) => {
  try {
    const systems = await systemService.getAllSystems();
    const metrics = await threatService.getMetricsSummary(systems.length);
    res.status(200).json({ success: true, data: metrics });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
