'use client';

import React, { useMemo } from 'react';
import { Award, Zap, Layers } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { useDashboard } from '@/context/DashboardContext';
import { computeSkillsDemandMetrics } from '@/lib/dataUtils';
import FilterBar from '@/components/FilterBar';
import { CustomChartTooltip } from '@/components/CustomChartTooltip';

const CATEGORY_COLORS: Record<string, string> = {
  'Software Engineering': '#2563eb',
  'Data & Analytics': '#0d9488',
  'Cloud & DevOps': '#059669',
  'Sales & Marketing': '#d97706',
  'Finance & Accounting': '#7c3aed',
  'Operations & Supply Chain': '#db2777',
  AI: '#0284c7',
  'Soft Skills': '#0d9488',
  Engineering: '#e11d48'
};

export default function SkillsDemandPage() {
  const { filteredPostings, skills, filters } = useDashboard();

  const metrics = useMemo(() => {
    return computeSkillsDemandMetrics(filteredPostings, skills, filters.skillCategory);
  }, [filteredPostings, skills, filters.skillCategory]);

  const { top20Skills, categoryDistribution, mostDemandedSkill, totalPostings } = metrics;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Global Filter Bar */}
      <FilterBar showCategoryFilter={true} />

      {/* Highlighted Insight Card: Most Demanded Skill */}
      {mostDemandedSkill && (
        <div className="bg-white border border-blue-200 rounded-xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shrink-0">
              <Award className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-700">
                  Most Demanded Skill (#1 Rank)
                </span>
                <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  {mostDemandedSkill.category}
                </span>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                {mostDemandedSkill.name}
              </h2>
              <p className="text-xs text-slate-600 mt-0.5">
                Present in <span className="font-bold text-slate-900">{mostDemandedSkill.count.toLocaleString()}</span> job postings out of {totalPostings.toLocaleString()} ({mostDemandedSkill.percentage}% market penetration).
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-lg border border-slate-200 shrink-0">
            <div className="text-right">
              <p className="text-xs text-slate-500 font-semibold">Posting Share</p>
              <p className="text-2xl font-bold text-blue-600">
                {mostDemandedSkill.percentage}%
              </p>
            </div>
            <div className="h-8 w-px bg-slate-200" />
            <div>
              <p className="text-xs text-slate-500 font-semibold">Demand Count</p>
              <p className="text-2xl font-bold text-slate-900">
                {mostDemandedSkill.count.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Visualization: Top 20 Skills */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Zap className="w-5 h-5 text-blue-600" />
              Top 20 Skills in Demand
            </h3>
            <p className="text-xs text-slate-500">
              Ranked by job posting count and market percentage
            </p>
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
            Showing {top20Skills.length} of 128 skills
          </span>
        </div>

        <div className="h-[600px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              layout="vertical"
              data={top20Skills}
              margin={{ top: 5, right: 40, left: 120, bottom: 5 }}
            >
              <XAxis type="number" stroke="#94a3b8" tick={{ fill: '#475569', fontSize: 11 }} />
              <YAxis
                type="category"
                dataKey="name"
                stroke="#94a3b8"
                tick={{ fill: '#1e293b', fontSize: 12, fontWeight: 600 }}
                width={120}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-white border border-slate-200 p-3 rounded-lg shadow-xl text-xs z-50">
                        <p className="font-bold text-slate-900 text-sm mb-1">{data.name}</p>
                        <p className="text-blue-600 font-semibold mb-2">Category: {data.category}</p>
                        <div className="space-y-1 border-t border-slate-100 pt-2">
                          <p className="text-slate-600">
                            Postings Mentioning: <span className="font-mono font-bold text-slate-900">{data.count.toLocaleString()}</span>
                          </p>
                          <p className="text-slate-600">
                            Market Penetration: <span className="font-mono font-bold text-blue-700">{data.percentage}%</span>
                          </p>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="count" name="Posting Count" radius={[0, 6, 6, 0]}>
                {top20Skills.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={CATEGORY_COLORS[entry.category] || '#2563eb'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Second Visualization: Skill Category Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-6 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Layers className="w-4 h-4 text-blue-600" />
                Skill Category Distribution
              </h3>
              <p className="text-xs text-slate-500">
                Aggregated skill demand grouped by domain category
              </p>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={categoryDistribution}
                margin={{ top: 10, right: 20, left: 10, bottom: 40 }}
              >
                <XAxis
                  dataKey="name"
                  stroke="#94a3b8"
                  tick={{ fill: '#334155', fontSize: 11 }}
                  angle={-25}
                  textAnchor="end"
                  interval={0}
                />
                <YAxis stroke="#94a3b8" tick={{ fill: '#475569', fontSize: 11 }} />
                <Tooltip content={<CustomChartTooltip />} />
                <Bar dataKey="count" name="Postings" radius={[6, 6, 0, 0]}>
                  {categoryDistribution.map((entry, index) => (
                    <Cell
                      key={`cat-cell-${index}`}
                      fill={CATEGORY_COLORS[entry.name] || '#2563eb'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Breakdown Table */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 mb-1">Category Insights</h3>
            <p className="text-xs text-slate-500 mb-4">Posting share per skill domain</p>
            <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
              {categoryDistribution.map((cat, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: CATEGORY_COLORS[cat.name] || '#2563eb' }}
                    />
                    <span className="font-semibold text-slate-800">{cat.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-bold text-slate-900">{cat.count.toLocaleString()}</span>
                    <span className="text-[10px] text-slate-500 ml-1 font-semibold">({cat.percentage}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
