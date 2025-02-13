import { config } from "process";
import React from "react";
import { TooltipProps } from "recharts";

export interface ChartConfig {
  [key: string]: {
    label: string;
    color: string;
  };
}

export function ChartContainer({ children }: { config?: ChartConfig; children: React.ReactNode }) {
  return (
    <div 
      style={{ 
        width: "100%", 
        height: 300,
        // config의 첫 번째 키의 색상을 사용
        borderColor: Object.values(config)[0]?.color || 'transparent'
      }}
    >
      {children}
    </div>
  );
}

export function ChartTooltip({ active, payload }: TooltipProps<number, string>) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 border rounded shadow">
        <p className="font-bold">{payload[0].payload.month}</p> {/* 'month' 속성 사용 */}
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.color }}>
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
}

export function ChartTooltipContent({ indicator }: { indicator: string }) {
  return (
    <div className="text-sm">
      <p>Indicator: {indicator}</p>
    </div>
  );
}