'use client';

import React from 'react';

export function CustomChartTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-slate-200 p-3 rounded-lg shadow-xl text-xs z-50">
        <p className="font-bold text-slate-900 mb-1">{label || payload[0]?.name}</p>
        {payload.map((item: any, index: number) => (
          <div key={index} className="flex items-center justify-between gap-4 text-slate-600 my-0.5">
            <span className="flex items-center gap-1.5">
              <span
                className="w-2 h-2 rounded-full inline-block"
                style={{ backgroundColor: item.color || item.fill || '#2563eb' }}
              />
              <span>{item.name || 'Value'}:</span>
            </span>
            <span className="font-mono font-bold text-slate-900">
              {typeof item.value === 'number'
                ? item.value.toLocaleString() + (item.unit || '')
                : item.value}
            </span>
          </div>
        ))}
      </div>
    );
  }

  return null;
}
