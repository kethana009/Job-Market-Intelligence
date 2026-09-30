'use client';

import React, { useMemo } from 'react';
import { MapPin, Briefcase, IndianRupee, Info, TrendingUp } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { useDashboard } from '@/context/DashboardContext';
import { computeCitiesExperienceMetrics } from '@/lib/dataUtils';
import FilterBar from '@/components/FilterBar';
import { CustomChartTooltip } from '@/components/CustomChartTooltip';

const OCC_COLORS: Record<string, string> = {
  'Software Engineering': '#2563eb',
  'IT Infrastructure & Cloud': '#0d9488',
  'Data & Analytics': '#059669',
  'Design & Creative': '#d97706',
  'Project & Program Management': '#7c3aed',
  'Research & Development': '#db2777',
  'Product Management': '#0284c7'
};

export default function CitiesExperiencePage() {
  const { filteredPostings, data } = useDashboard();

  const metrics = useMemo(() => {
    if (!data) return null;
    return computeCitiesExperienceMetrics(filteredPostings, data.dicts);
  }, [filteredPostings, data]);

  if (!metrics || !data) {
    return (
      <div className="p-8 text-center text-slate-500 font-medium">
        Loading Cities & Experience analytics...
      </div>
    );
  }

  const {
    topCities,
    occDistributionByCity,
    expDistribution,
    avgSalaryByExp,
    avgSalaryByOccupation,
    occupations
  } = metrics;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Global Filters */}
      <FilterBar showCategoryFilter={false} />

      {/* Salary Note Banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center gap-3 text-xs text-amber-900 font-medium">
        <Info className="w-4 h-4 text-amber-600 shrink-0" />
        <span>
          <strong>Salary Notice:</strong> Salary metrics are calculated strictly from job postings with explicitly listed compensation details ({metrics.avgSalaryByExp.reduce((acc, i) => acc + i.count, 0).toLocaleString()} postings). Postings with undisclosed salary are excluded from average calculation to prevent distortion.
        </span>
      </div>

      {/* Row 1: Top Cities & Occupation Breakdown per City */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. Top Cities by Job Postings */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-teal-600" />
                Top Cities by Job Postings
              </h3>
              <p className="text-xs text-slate-500">
                Geographic concentration of tech and enterprise hiring
              </p>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={topCities.slice(0, 8)}
                margin={{ top: 5, right: 30, left: 70, bottom: 5 }}
              >
                <XAxis type="number" stroke="#94a3b8" tick={{ fill: '#475569', fontSize: 11 }} />
                <YAxis
                  type="category"
                  dataKey="name"
                  stroke="#94a3b8"
                  tick={{ fill: '#334155', fontSize: 11, fontWeight: 500 }}
                  width={80}
                />
                <Tooltip content={<CustomChartTooltip />} />
                <Bar dataKey="count" name="Postings" radius={[0, 6, 6, 0]} fill="#0d9488" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 2. Occupation Distribution by City */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-blue-600" />
                Occupation Mix across Top Metros
              </h3>
              <p className="text-xs text-slate-500">
                Role distribution across major Indian tech hubs
              </p>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={occDistributionByCity}
                margin={{ top: 10, right: 10, left: 0, bottom: 25 }}
              >
                <XAxis
                  dataKey="city"
                  stroke="#94a3b8"
                  tick={{ fill: '#334155', fontSize: 11 }}
                />
                <YAxis stroke="#94a3b8" tick={{ fill: '#475569', fontSize: 11 }} />
                <Tooltip content={<CustomChartTooltip />} />
                <Legend
                  wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }}
                />
                {occupations.map((occName) => (
                  <Bar
                    key={occName}
                    dataKey={occName}
                    name={occName}
                    stackId="a"
                    fill={OCC_COLORS[occName] || '#2563eb'}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 2: Experience & Salary Visualizations */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 3. Experience Band Distribution */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs">
          <h3 className="text-base font-bold text-slate-900 mb-1">
            Experience Distribution
          </h3>
          <p className="text-xs text-slate-500 mb-4">
            Posting counts across seniority levels
          </p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={expDistribution} margin={{ top: 10, right: 10, left: -10, bottom: 25 }}>
                <XAxis
                  dataKey="name"
                  stroke="#94a3b8"
                  tick={{ fill: '#334155', fontSize: 10 }}
                  interval={0}
                  angle={-20}
                  textAnchor="end"
                />
                <YAxis stroke="#94a3b8" tick={{ fill: '#475569', fontSize: 11 }} />
                <Tooltip content={<CustomChartTooltip />} />
                <Bar dataKey="count" name="Postings" radius={[6, 6, 0, 0]} fill="#2563eb" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 4. Average Salary by Experience Band */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs">
          <h3 className="text-base font-bold text-slate-900 mb-1 flex items-center gap-1.5">
            <IndianRupee className="w-4 h-4 text-emerald-600" />
            Salary by Experience
          </h3>
          <p className="text-xs text-slate-500 mb-4">
            Average annual CTC (in Lakhs INR)
          </p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={avgSalaryByExp} margin={{ top: 10, right: 10, left: -10, bottom: 25 }}>
                <XAxis
                  dataKey="name"
                  stroke="#94a3b8"
                  tick={{ fill: '#334155', fontSize: 10 }}
                  interval={0}
                  angle={-20}
                  textAnchor="end"
                />
                <YAxis
                  stroke="#94a3b8"
                  tick={{ fill: '#475569', fontSize: 11 }}
                  unit="L"
                />
                <Tooltip content={<CustomChartTooltip />} />
                <Bar dataKey="avgSalary" name="Avg Salary (Lakhs)" radius={[6, 6, 0, 0]} fill="#059669" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 5. Average Salary by Occupation */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs">
          <h3 className="text-base font-bold text-slate-900 mb-1 flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-amber-600" />
            Salary by Occupation
          </h3>
          <p className="text-xs text-slate-500 mb-4">
            Average annual CTC per job category
          </p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={avgSalaryByOccupation}
                margin={{ top: 5, right: 25, left: 80, bottom: 5 }}
              >
                <XAxis type="number" stroke="#94a3b8" tick={{ fill: '#475569', fontSize: 10 }} unit="L" />
                <YAxis
                  type="category"
                  dataKey="name"
                  stroke="#94a3b8"
                  tick={{ fill: '#334155', fontSize: 10 }}
                  width={80}
                />
                <Tooltip content={<CustomChartTooltip />} />
                <Bar dataKey="avgSalary" name="Avg Salary (Lakhs)" radius={[0, 6, 6, 0]} fill="#d97706" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
