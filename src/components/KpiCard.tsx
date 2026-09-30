'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';

interface KpiCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  badge?: string;
  color?: 'indigo' | 'cyan' | 'emerald' | 'amber' | 'purple';
}

const colorStyles = {
  indigo: {
    border: 'border-slate-200 hover:border-blue-300',
    iconBg: 'bg-blue-50 text-blue-600 border border-blue-100'
  },
  cyan: {
    border: 'border-slate-200 hover:border-teal-300',
    iconBg: 'bg-teal-50 text-teal-600 border border-teal-100'
  },
  emerald: {
    border: 'border-slate-200 hover:border-emerald-300',
    iconBg: 'bg-emerald-50 text-emerald-600 border border-emerald-100'
  },
  amber: {
    border: 'border-slate-200 hover:border-amber-300',
    iconBg: 'bg-amber-50 text-amber-600 border border-amber-100'
  },
  purple: {
    border: 'border-slate-200 hover:border-purple-300',
    iconBg: 'bg-purple-50 text-purple-600 border border-purple-100'
  }
};

export default function KpiCard({
  title,
  value,
  subtitle,
  icon: Icon,
  badge,
  color = 'indigo'
}: KpiCardProps) {
  const style = colorStyles[color];

  return (
    <div className={`rounded-xl p-5 bg-white border ${style.border} shadow-2xs transition-all flex flex-col justify-between`}>
      <div className="flex items-start justify-between gap-3 mb-3">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
          {title}
        </span>
        <div className={`p-2.5 rounded-lg ${style.iconBg}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl lg:text-3xl font-bold tracking-tight text-slate-900">
            {value}
          </span>
          {badge && (
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
              {badge}
            </span>
          )}
        </div>
        {subtitle && (
          <p className="text-xs text-slate-500 mt-1">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
