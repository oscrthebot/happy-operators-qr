'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';

interface AnalyticsChartProps {
  data: Array<{
    date: string;
    clicks: number;
  }>;
}

export default function AnalyticsChart({ data }: AnalyticsChartProps) {
  // Format data for chart (reverse to show oldest first)
  const chartData = [...data]
    .reverse()
    .map((item) => ({
      date: format(new Date(item.date), 'MMM d'),
      clicks: parseInt(item.clicks.toString()),
    }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis
          dataKey="date"
          stroke="#6b7280"
          fontSize={12}
        />
        <YAxis
          stroke="#6b7280"
          fontSize={12}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: '#fff',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
          }}
        />
        <Line
          type="monotone"
          dataKey="clicks"
          stroke="#FF6B6B"
          strokeWidth={2}
          dot={{ fill: '#FF6B6B', r: 4 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
