import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { mock24hThreatTrend } from '../../data';

export const ThreatTrendChart: React.FC = () => {
  return (
    <div className="w-full h-64 sm:h-72">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={mock24hThreatTrend}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorCritical" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#dc2626" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#dc2626" stopOpacity={0.0} />
            </linearGradient>
            <linearGradient id="colorHigh" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ea580c" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#ea580c" stopOpacity={0.0} />
            </linearGradient>
            <linearGradient id="colorMedium" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#d97706" stopOpacity={0.1} />
              <stop offset="95%" stopColor="#d97706" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
          <XAxis
            dataKey="time"
            stroke="#64748b"
            fontSize={11}
            tickLine={false}
            axisLine={{ stroke: '#e2e8f0' }}
          />
          <YAxis
            stroke="#64748b"
            fontSize={11}
            tickLine={false}
            axisLine={{ stroke: '#e2e8f0' }}
            allowDecimals={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#ffffff',
              borderColor: '#e2e8f0',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              fontSize: '12px',
            }}
            itemStyle={{ padding: '2px 0' }}
          />
          <Legend
            verticalAlign="top"
            align="right"
            iconType="circle"
            wrapperStyle={{ paddingBottom: '10px', fontSize: '11px', fontWeight: 600 }}
          />
          <Area
            type="monotone"
            dataKey="critical"
            name="Critical"
            stroke="#dc2626"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorCritical)"
          />
          <Area
            type="monotone"
            dataKey="high"
            name="High"
            stroke="#ea580c"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorHigh)"
          />
          <Area
            type="monotone"
            dataKey="medium"
            name="Medium"
            stroke="#d97706"
            strokeWidth={1.5}
            fillOpacity={1}
            fill="url(#colorMedium)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
