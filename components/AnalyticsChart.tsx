'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

interface AnalyticsChartProps {
  data: Array<{
    date: string;
    clicks: number;
  }>;
}

export default function AnalyticsChart({ data }: AnalyticsChartProps) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Format data for chart
  const chartData = [...data].map((item) => ({
    date: format(new Date(item.date), 'MMM d'),
    clicks: parseInt(item.clicks.toString()),
  }));

  const isDark = mounted && theme === 'dark';
  const colors = {
    line: '#3B82F6', // Blue
    grid: isDark ? '#404040' : '#e5e7eb',
    text: isDark ? '#a3a3a3' : '#6b7280',
    tooltipBg: isDark ? '#171717' : '#fff',
    tooltipBorder: isDark ? '#404040' : '#e5e7eb',
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />
        <XAxis
          dataKey="date"
          stroke={colors.text}
          fontSize={12}
        />
        <YAxis
          stroke={colors.text}
          fontSize={12}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: colors.tooltipBg,
            border: `1px solid ${colors.tooltipBorder}`,
            borderRadius: '8px',
            color: colors.text,
          }}
        />
        <Line
          type="monotone"
          dataKey="clicks"
          stroke={colors.line}
          strokeWidth={2}
          dot={{ fill: colors.line, r: 4 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
