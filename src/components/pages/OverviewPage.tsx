'use client';

import React, { useMemo } from 'react';
import {
  Briefcase,
  Layers,
  IndianRupee,
  FileCheck,
  TrendingUp,
  MapPin,
  Award,
  Sparkles
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { useDashboard } from '@/context/DashboardContext';
import { computeOverviewMetrics } from '@/lib/dataUtils';
import KpiCard from '@/components/KpiCard';
import FilterBar from '@/components/FilterBar';
import { CustomChartTooltip } from '@/components/CustomChartTooltip';

const COLORS = ['#2563eb', '#0d9488', '#059669', '#d97706', '#7c3aed', '#db2777', '#0284c7'];

export default function OverviewPage() {
  const { filteredPostings, data, skills } = useDashboard();

  const metrics = useMemo(() => {
    if (!data) return null;
    return computeOverviewMetrics(filteredPostings, data.dicts, skills);
  }, [filteredPostings, data, skills]);

  if (!metrics || !data) {
    return (
      <div className="p-8 text-center text-slate-500 font-medium">
        Loading Overview analytics...
      </div>
    );
  }

  const {
    totalPostings,
    uniqueSkillsCount,
    avgSalary,
    salaryCount,
    salaryPct,
    postingsByOccupation,
    postingsByCity,
    expDistribution,
    salaryBandDistribution,
    keyInsights
  } = metrics;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Global Filters */}
      <FilterBar showCategoryFilter={false} />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <KpiCard
          title="Total Job Postings"
          value={totalPostings.toLocaleString()}
          subtitle="Matching current filters"
          icon={Briefcase}
          color="indigo"
        />
        <KpiCard
          title="Unique Skills"
          value={uniqueSkillsCount.toLocaleString()}
          subtitle="Identified across postings"
          icon={Layers}
          color="cyan"
        />
        <KpiCard
          title="Average Salary"
          value={`₹${avgSalary} L`}
          subtitle="Annual CTC (Lakhs INR)"
          icon={IndianRupee}
          color="emerald"
        />
        <KpiCard
          title="Postings With Salary"
          value={salaryCount.toLocaleString()}
          subtitle={`${salaryPct}% disclose CTC details`}
          icon={FileCheck}
          badge={`${salaryPct}%`}
          color="amber"
        />
      </div>

      {/* Grid of Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. Job Postings by Occupation */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Job Postings by Occupation
              </h3>
              <p className="text-xs text-slate-500">
                Distribution across primary job categories
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
              Sorted Descending
            </span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={postingsByOccupation}
                margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
              >
                <XAxis type="number" stroke="#94a3b8" tick={{ fill: '#475569', fontSize: 11 }} />
                <YAxis
                  type="category"
                  dataKey="name"
                  stroke="#94a3b8"
                  tick={{ fill: '#334155', fontSize: 11, fontWeight: 500 }}
                  width={110}
                />
                <Tooltip content={<CustomChartTooltip />} />
                <Bar dataKey="count" name="Postings" radius={[0, 6, 6, 0]} fill="#2563eb">
                  {postingsByOccupation.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 2. Job Postings by City */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Job Postings by City
              </h3>
              <p className="text-xs text-slate-500">
                Top tech hubs and metro locations
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-teal-50 text-teal-700 border border-teal-200">
              Top Cities
            </span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={postingsByCity.slice(0, 7)}
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

        {/* 3. Experience Distribution */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Experience Band Distribution
              </h3>
              <p className="text-xs text-slate-500">
                Breakdown by required experience band
              </p>
            </div>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={expDistribution}
                  dataKey="count"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={85}
                  innerRadius={50}
                  paddingAngle={3}
                  label={(entry: any) => `${entry.name} (${entry.percentage}%)`}
                  labelLine={false}
                >
                  {expDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomChartTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 4. Salary Band Distribution */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Salary Band Distribution
              </h3>
              <p className="text-xs text-slate-500">
                Number of job postings across salary brackets
              </p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salaryBandDistribution} margin={{ top: 10, right: 20, left: 10, bottom: 25 }}>
                <XAxis
                  dataKey="name"
                  stroke="#94a3b8"
                  tick={{ fill: '#334155', fontSize: 11 }}
                  interval={0}
                  angle={-15}
                  textAnchor="end"
                />
                <YAxis stroke="#94a3b8" tick={{ fill: '#475569', fontSize: 11 }} />
                <Tooltip content={<CustomChartTooltip />} />
                <Bar dataKey="count" name="Postings" radius={[6, 6, 0, 0]} fill="#059669" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Key Insights Section */}
      <div className="bg-white border border-blue-200 rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-blue-600" />
          <h3 className="text-base font-bold text-slate-900 tracking-tight">
            Key Market Insights
          </h3>
          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-100">
            Calculated Factual Metrics
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-700 mb-1">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              Largest Role Category
            </div>
            <p className="text-sm font-bold text-slate-900">
              {keyInsights.topCategory}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Represents <span className="font-semibold text-slate-700">{keyInsights.topCategoryPct}%</span> of all postings.
            </p>
          </div>

          <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
            <div className="flex items-center gap-2 text-xs font-semibold text-teal-700 mb-1">
              <MapPin className="w-4 h-4 text-teal-600" />
              Top Location Hub
            </div>
            <p className="text-sm font-bold text-slate-900">
              {keyInsights.topCity}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Leads with <span className="font-semibold text-slate-700">{keyInsights.topCityCount.toLocaleString()}</span> postings.
            </p>
          </div>

          <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 mb-1">
              <Award className="w-4 h-4 text-emerald-600" />
              Most Demanded Skill
            </div>
            <p className="text-sm font-bold text-slate-900">
              {keyInsights.topSkillName}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Found in <span className="font-semibold text-slate-700">{keyInsights.topSkillCount.toLocaleString()}</span> postings ({keyInsights.topSkillPct}%).
            </p>
          </div>

          <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-700 mb-1">
              <IndianRupee className="w-4 h-4 text-amber-600" />
              Salary Transparency
            </div>
            <p className="text-sm font-bold text-slate-900">
              {keyInsights.salaryPct}% Disclosed
            </p>
            <p className="text-xs text-slate-500 mt-1">
              <span className="font-semibold text-slate-700">{salaryCount.toLocaleString()}</span> postings explicitly list CTC range.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
