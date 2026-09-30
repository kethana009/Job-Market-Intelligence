'use client';

import React, { useState, useMemo } from 'react';
import { GitMerge, Search, HelpCircle, ArrowUpDown } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { useDashboard } from '@/context/DashboardContext';
import { CustomChartTooltip } from '@/components/CustomChartTooltip';

export default function SkillPairsPage() {
  const { skillPairs } = useDashboard();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<'postings_together' | 'lift' | 'jaccard'>('postings_together');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const filteredPairs = useMemo(() => {
    let result = skillPairs;

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        p =>
          p.pair.toLowerCase().includes(term) ||
          p.skill_a.toLowerCase().includes(term) ||
          p.skill_b.toLowerCase().includes(term)
      );
    }

    return [...result].sort((a, b) => {
      const valA = a[sortField];
      const valB = b[sortField];
      return sortOrder === 'desc' ? valB - valA : valA - valB;
    });
  }, [skillPairs, searchTerm, sortField, sortOrder]);

  const top15Pairs = useMemo(() => {
    return [...skillPairs]
      .sort((a, b) => b.postings_together - a.postings_together)
      .slice(0, 15);
  }, [skillPairs]);

  const handleSort = (field: 'postings_together' | 'lift' | 'jaccard') => {
    if (sortField === field) {
      setSortOrder(prev => (prev === 'desc' ? 'asc' : 'desc'));
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Metric Explanation Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs">
        <div className="flex items-center gap-2 mb-3">
          <HelpCircle className="w-5 h-5 text-blue-600" />
          <h3 className="text-base font-bold text-slate-900">
            Understanding Skill Co-occurrence Metrics
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
            <h4 className="font-bold text-blue-700 mb-1">Postings Together</h4>
            <p className="text-slate-600">
              The total number of unique job postings in the dataset that explicitly list both skills simultaneously.
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
            <h4 className="font-bold text-indigo-700 mb-1">Lift Score</h4>
            <p className="text-slate-600">
              Measures how strongly the pair occurs together compared to if they appeared completely independently. A lift &gt; 1 indicates positive association.
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
            <h4 className="font-bold text-emerald-700 mb-1">Jaccard Similarity</h4>
            <p className="text-slate-600">
              The ratio of postings containing both skills to the total postings containing either skill (Intersection over Union).
            </p>
          </div>
        </div>
      </div>

      {/* Top 15 Skill Pairs Visual Chart */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <GitMerge className="w-5 h-5 text-blue-600" />
              Top 15 Co-occurring Skill Pairs
            </h3>
            <p className="text-xs text-slate-500">
              Skill combinations with the highest joint occurrence across job postings
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
            Top 15 Pairs
          </span>
        </div>

        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              layout="vertical"
              data={top15Pairs}
              margin={{ top: 5, right: 30, left: 140, bottom: 5 }}
            >
              <XAxis type="number" stroke="#94a3b8" tick={{ fill: '#475569', fontSize: 11 }} />
              <YAxis
                type="category"
                dataKey="pair"
                stroke="#94a3b8"
                tick={{ fill: '#1e293b', fontSize: 11, fontWeight: 600 }}
                width={140}
              />
              <Tooltip content={<CustomChartTooltip />} />
              <Bar dataKey="postings_together" name="Postings Together" radius={[0, 6, 6, 0]} fill="#2563eb" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Full Co-occurring Skill Pairs Data Table */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Skill Combination Explorer
            </h3>
            <p className="text-xs text-slate-500">
              Browse all {skillPairs.length} co-occurring skill pairs with statistical lift and similarity scores
            </p>
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search skill pair (e.g. Python, React)..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Interactive Data Table */}
        <div className="overflow-x-auto border border-slate-200 rounded-lg">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-700">
                <th className="p-3.5">#</th>
                <th className="p-3.5">Skill Combination Pair</th>
                <th
                  className="p-3.5 text-right cursor-pointer hover:text-slate-900 transition-colors"
                  onClick={() => handleSort('postings_together')}
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Postings Together</span>
                    <ArrowUpDown className="w-3 h-3 text-blue-600" />
                  </div>
                </th>
                <th
                  className="p-3.5 text-right cursor-pointer hover:text-slate-900 transition-colors"
                  onClick={() => handleSort('lift')}
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Lift Score</span>
                    <ArrowUpDown className="w-3 h-3 text-indigo-600" />
                  </div>
                </th>
                <th
                  className="p-3.5 text-right cursor-pointer hover:text-slate-900 transition-colors"
                  onClick={() => handleSort('jaccard')}
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Jaccard Index</span>
                    <ArrowUpDown className="w-3 h-3 text-emerald-600" />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-medium">
              {filteredPairs.slice(0, 50).map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                  <td className="p-3.5 text-slate-400 font-normal">{idx + 1}</td>
                  <td className="p-3.5 text-slate-900 font-bold flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                    <span>{row.pair}</span>
                  </td>
                  <td className="p-3.5 text-right font-mono text-blue-700 font-bold">
                    {row.postings_together.toLocaleString()}
                  </td>
                  <td className="p-3.5 text-right font-mono text-indigo-700 font-semibold">
                    {row.lift.toFixed(2)}x
                  </td>
                  <td className="p-3.5 text-right font-mono text-emerald-700 font-semibold">
                    {row.jaccard.toFixed(4)}
                  </td>
                </tr>
              ))}
              {filteredPairs.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500">
                    No skill pairs matching "{searchTerm}"
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
