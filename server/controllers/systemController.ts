import { Request, Response } from 'express';
import { systemService } from '../services/systemService';

export const getSystems = async (req: Request, res: Response) => {
  try {
    const { status, type, search } = req.query;
    const systems = await systemService.getAllSystems({
      status: status as string,
      type: type as string,
      search: search as string,
    });
    res.status(200).json({ success: true, count: systems.length, data: systems });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getSystemById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const system = await systemService.getSystemById(id);
    if (!system) {
      return res.status(404).json({ success: false, message: `System ${id} not found` });
    }
    res.status(200).json({ success: true, data: system });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
