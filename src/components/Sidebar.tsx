'use client';

import React from 'react';
import {
  LayoutDashboard,
  BarChart3,
  Grid2X2,
  MapPin,
  GitMerge,
  Sparkles,
  Terminal
} from 'lucide-react';
import { useDashboard } from '@/context/DashboardContext';

const navItems = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'skills-demand', label: 'Skills Demand', icon: BarChart3 },
  { id: 'skills-roles', label: 'Skills × Roles', icon: Grid2X2 },
  { id: 'cities-experience', label: 'Cities & Experience', icon: MapPin },
  { id: 'skill-pairs', label: 'Skill Pairs', icon: GitMerge }
];

export default function Sidebar() {
  const { activeTab, setActiveTab } = useDashboard();

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between shrink-0 select-none min-h-screen shadow-xs">
      {/* Top Header */}
      <div>
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-sm shadow-blue-500/20 text-white">
              <Sparkles className="w-5.5 h-5.5" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-1.5">
                JobScope
              </h1>
              <p className="text-xs font-semibold text-blue-600 tracking-wide">
                Job Market Intelligence
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
            Analytics Views
          </p>
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 border border-blue-200 font-semibold shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                <Icon
                  className={`w-4.5 h-4.5 ${
                    isActive ? 'text-blue-600' : 'text-slate-400'
                  }`}
                />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Info */}
      <div className="p-4 m-4 rounded-xl bg-slate-50 border border-slate-200">
        <div className="flex items-center gap-2 mb-1 text-xs font-semibold text-slate-700">
          <Terminal className="w-3.5 h-3.5 text-blue-600" />
          Data Analytics Project
        </div>
        <p className="text-[11px] font-mono text-slate-500 tracking-tight">
          Python • SQL • Power BI
        </p>
      </div>
    </aside>
  );
}
