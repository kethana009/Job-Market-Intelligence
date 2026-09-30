'use client';

import React from 'react';
import { Database, Filter } from 'lucide-react';
import { useDashboard } from '@/context/DashboardContext';

const pageTitles: Record<string, { title: string; subtitle: string }> = {
  overview: {
    title: 'Job Market Overview',
    subtitle: 'An overview of demand, roles, locations and salary patterns across the job market.'
  },
  'skills-demand': {
    title: 'Skills in Demand',
    subtitle: 'Discover which technical and professional skills appear most frequently in job postings.'
  },
  'skills-roles': {
    title: 'Skills × Job Roles',
    subtitle: 'Understand how skill requirements vary across different occupations.'
  },
  'cities-experience': {
    title: 'Where the Jobs Are',
    subtitle: 'Compare demand across cities and experience levels.'
  },
  'skill-pairs': {
    title: 'Skills That Appear Together',
    subtitle: 'Explore frequently co-occurring skill combinations in job postings.'
  }
};

export default function Header() {
  const { activeTab, filteredPostings, data, activeFilterCount } = useDashboard();
  const meta = pageTitles[activeTab] || pageTitles.overview;

  const totalDatasetCount = data?.postings.length || 39509;

  return (
    <header className="px-8 py-5 border-b border-slate-200 bg-white sticky top-0 z-20 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-2xs">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          {meta.title}
        </h1>
        <p className="text-sm text-slate-500 mt-0.5">
          {meta.subtitle}
        </p>
      </div>

      <div className="flex items-center gap-3">
        {activeFilterCount > 0 && (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <Filter className="w-3.5 h-3.5 text-blue-600" />
            <span>{filteredPostings.length.toLocaleString()} matching</span>
          </div>
        )}

        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700">
          <Database className="w-3.5 h-3.5 text-blue-600" />
          <span>Dataset: Job Postings ({totalDatasetCount.toLocaleString()})</span>
        </div>
      </div>
    </header>
  );
}
