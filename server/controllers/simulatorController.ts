import { Request, Response } from 'express';
import { SimulatorService, SimulationScenarioType } from '../services/simulatorService';
import { RawEventInput } from '../services/ai/normalization';
import { ThreatPipeline } from '../services/ai/pipeline';
import { eventService } from '../services/eventService';
import { threatService } from '../services/threatService';

export const getScenarios = (_req: Request, res: Response) => {
  try {
    const scenarios = SimulatorService.getAvailableScenarios();
    res.status(200).json({ success: true, count: scenarios.length, data: scenarios });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const triggerScenario = async (req: Request, res: Response) => {
  try {
    const { scenario } = req.body;
    if (!scenario) {
      return res.status(400).json({
        success: false,
        message: 'Scenario name is required (e.g. brute_force, privilege_escalation, lateral_movement)',
      });
    }

    const executionResult = await SimulatorService.executeScenario(
      scenario as SimulationScenarioType
    );

    res.status(200).json({
      success: true,
      data: executionResult,
      message: `Scenario "${scenario}" executed successfully through AI normalization and detection pipeline.`,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const generateBatch = async (req: Request, res: Response) => {
  try {
    const { scenario, count } = req.body;
    const batchCount = Math.min(20, Math.max(1, count || 3));
    const scenarioType = (scenario || 'normal_activity') as SimulationScenarioType;

    const generatedEvents: any[] = [];
    for (let i = 0; i < batchCount; i++) {
      const rawEvents = SimulatorService.generateScenarioEvents(scenarioType);
      for (const raw of rawEvents) {
        const result = ThreatPipeline.processEvent(raw);
        await eventService.createEvent(result.normalizedEvent);
        if (result.isThreat && result.threat) {
          await threatService.upsertThreat(result.threat);
        }
        generatedEvents.push(result.normalizedEvent);
      }
    }

    res.status(201).json({
      success: true,
      count: generatedEvents.length,
      data: generatedEvents,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
