export interface ThreatTrendPoint {
  time: string;
  critical: number;
  high: number;
  medium: number;
  low: number;
}

export const mock24hThreatTrend: ThreatTrendPoint[] = [
  { time: '00:00', critical: 1, high: 2, medium: 4, low: 8 },
  { time: '02:00', critical: 1, high: 2, medium: 5, low: 9 },
  { time: '04:00', critical: 0, high: 3, medium: 3, low: 7 },
  { time: '06:00', critical: 0, high: 1, medium: 6, low: 11 },
  { time: '08:00', critical: 2, high: 4, medium: 7, low: 14 },
  { time: '10:00', critical: 2, high: 5, medium: 8, low: 16 },
  { time: '12:00', critical: 1, high: 6, medium: 9, low: 15 },
  { time: '14:00', critical: 3, high: 7, medium: 10, low: 18 },
  { time: '16:00', critical: 2, high: 8, medium: 8, low: 14 },
  { time: '18:00', critical: 2, high: 6, medium: 7, low: 12 },
  { time: '20:00', critical: 3, high: 9, medium: 8, low: 10 },
  { time: '22:00', critical: 4, high: 11, medium: 9, low: 13 },
  { time: '23:45', critical: 3, high: 12, medium: 11, low: 15 },
];
