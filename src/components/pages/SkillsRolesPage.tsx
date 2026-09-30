'use client';

import React, { useState, useMemo } from 'react';
import { Grid2X2, Target } from 'lucide-react';
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
import { computeSkillsRolesMatrix } from '@/lib/dataUtils';
import FilterBar from '@/components/FilterBar';

export default function SkillsRolesPage() {
  const { filteredPostings, data, skills } = useDashboard();
  const [selectedRole, setSelectedRole] = useState<string>('Software Engineering');

  const matrixData = useMemo(() => {
    if (!data) return null;
    return computeSkillsRolesMatrix(filteredPostings, data.dicts, skills, selectedRole);
  }, [filteredPostings, data, skills, selectedRole]);

  if (!matrixData || !data) {
    return (
      <div className="p-8 text-center text-slate-500 font-medium">
        Loading Skills × Roles matrix...
      </div>
    );
  }

  const { occupations, heatmapData, roleTopSkills } = matrixData;

  // Helper for light theme heatmap cell color intensity
  const getCellColor = (value: number) => {
    if (value === 0) return 'bg-slate-50 text-slate-400';
    if (value < 10) return 'bg-blue-50 text-blue-700 border border-blue-100 font-medium';
    if (value < 25) return 'bg-blue-100 text-blue-900 border border-blue-200 font-semibold';
    if (value < 40) return 'bg-blue-200 text-blue-950 border border-blue-300 font-bold';
    if (value < 60) return 'bg-blue-500 text-white font-bold border border-blue-600';
    return 'bg-blue-700 text-white font-extrabold shadow-2xs';
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Global Filter Bar */}
      <FilterBar showCategoryFilter={true} />

      {/* Heatmap Section */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Grid2X2 className="w-5 h-5 text-blue-600" />
              Skills × Occupation Demand Heatmap Matrix
            </h3>
            <p className="text-xs text-slate-500">
              Percentage of job postings requiring each skill across occupation groups (Color intensity = % demand)
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500 font-semibold">Demand Scale:</span>
            <div className="flex items-center gap-1">
              <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-100 text-slate-600 font-medium">Low</span>
              <span className="w-4 h-3 rounded bg-blue-50 border border-blue-100"></span>
              <span className="w-4 h-3 rounded bg-blue-100 border border-blue-200"></span>
              <span className="w-4 h-3 rounded bg-blue-300"></span>
              <span className="w-4 h-3 rounded bg-blue-500"></span>
              <span className="w-4 h-3 rounded bg-blue-700"></span>
              <span className="px-1.5 py-0.5 rounded text-[10px] bg-blue-700 text-white font-bold">High</span>
            </div>
          </div>
        </div>

        {/* Heatmap Table Container */}
        <div className="overflow-x-auto border border-slate-200 rounded-lg">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="p-3 text-xs font-bold text-slate-700 min-w-[140px] sticky left-0 bg-slate-50 z-10 border-r border-slate-200">
                  Skill / Role
                </th>
                {occupations.map(occ => (
                  <th
                    key={occ}
                    className={`p-3 text-xs font-semibold text-center min-w-[130px] border-r border-slate-200 cursor-pointer transition-colors ${
                      selectedRole === occ ? 'bg-blue-50 text-blue-800 font-bold' : 'text-slate-700 hover:bg-slate-100'
                    }`}
                    onClick={() => setSelectedRole(occ)}
                  >
                    <div className="line-clamp-2">{occ}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-xs">
              {heatmapData.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3 font-semibold text-slate-900 sticky left-0 bg-white border-r border-slate-200 z-10 flex items-center justify-between">
                    <span>{row.skillName}</span>
                    <span className="text-[10px] text-slate-400 font-normal ml-1">({row.category})</span>
                  </td>

                  {occupations.map(occ => {
                    const value = row[occ] || 0;
                    const count = row[`${occ}_count`] || 0;
                    const total = row[`${occ}_total`] || 0;
                    const isSelectedRole = selectedRole === occ;

                    return (
                      <td
                        key={occ}
                        className={`p-1.5 text-center border-r border-slate-200 transition-all ${
                          isSelectedRole ? 'ring-1 ring-blue-500/40 bg-blue-50/30' : ''
                        }`}
                      >
                        <div
                          title={`${row.skillName} in ${occ}: ${count} / ${total} postings (${value}%)`}
                          className={`py-2 px-1 rounded-md transition-all cursor-default text-xs ${getCellColor(
                            value
                          )}`}
                        >
                          {value > 0 ? `${value}%` : '-'}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Role-Specific Focus Section */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Target className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-bold text-slate-900">
                Top Skills for Selected Occupation
              </h3>
            </div>
            <p className="text-xs text-slate-500">
              Select a specific role to inspect its top 10 required skills
            </p>
          </div>

          {/* Role Selector Tabs */}
          <div className="flex flex-wrap gap-1.5">
            {occupations.map(occ => (
              <button
                key={occ}
                onClick={() => setSelectedRole(occ)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  selectedRole === occ
                    ? 'bg-blue-600 text-white font-bold shadow-2xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                {occ}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Role Top Skills Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
          <div className="lg:col-span-2 h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={roleTopSkills}
                margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
              >
                <XAxis type="number" stroke="#94a3b8" tick={{ fill: '#475569', fontSize: 11 }} />
                <YAxis
                  type="category"
                  dataKey="name"
                  stroke="#94a3b8"
                  tick={{ fill: '#1e293b', fontSize: 12, fontWeight: 600 }}
                  width={100}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const d = payload[0].payload;
                      return (
                        <div className="bg-white border border-slate-200 p-3 rounded-lg shadow-xl text-xs">
                          <p className="font-bold text-slate-900 mb-1">{d.name}</p>
                          <p className="text-slate-600">
                            Postings: <span className="font-mono font-bold text-blue-600">{d.count.toLocaleString()}</span>
                          </p>
                          <p className="text-slate-600">
                            Role Penetration: <span className="font-mono font-bold text-blue-800">{d.percentage}%</span>
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="count" name="Postings" radius={[0, 6, 6, 0]} fill="#2563eb">
                  {roleTopSkills.map((entry, index) => (
                    <Cell
                      key={`role-cell-${index}`}
                      fill={index === 0 ? '#0d9488' : '#2563eb'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-3">
            <h4 className="text-sm font-bold text-slate-900 flex items-center justify-between">
              <span>{selectedRole}</span>
              <span className="text-xs text-blue-600 font-mono font-bold">Top 10 Breakdown</span>
            </h4>
            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {roleTopSkills.map((sk, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs p-2 rounded bg-white border border-slate-200">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-[10px]">
                      #{idx + 1}
                    </span>
                    <span className="font-semibold text-slate-800">{sk.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-bold text-blue-600">{sk.percentage}%</span>
                    <span className="text-[10px] text-slate-500 ml-1">({sk.count})</span>
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
