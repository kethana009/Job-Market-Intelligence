'use client';

import React from 'react';
import { Filter, RotateCcw } from 'lucide-react';
import { useDashboard } from '@/context/DashboardContext';

export default function FilterBar({ showCategoryFilter = true }: { showCategoryFilter?: boolean }) {
  const { data, skills, filters, setFilter, resetFilters, activeFilterCount } = useDashboard();

  if (!data) return null;

  const occupations = ['ALL', ...data.dicts.occupations];
  const metros = ['ALL', ...data.dicts.metros];
  const expBands = ['ALL', ...data.dicts.exp_bands];
  const salaryBands = ['ALL', ...data.dicts.salary_bands];

  // Unique categories
  const categories = ['ALL', ...Array.from(new Set(skills.map(s => s.category))).sort()];

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 mb-6 shadow-2xs">
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
          <Filter className="w-3.5 h-3.5 text-blue-600" />
          <span>Global Data Filters</span>
        </div>
        {activeFilterCount > 0 && (
          <button
            onClick={resetFilters}
            className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Filters ({activeFilterCount})</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {/* Occupation */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-500 mb-1">
            Occupation / Role
          </label>
          <select
            value={filters.occupation}
            onChange={e => setFilter('occupation', e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          >
            {occupations.map(occ => (
              <option key={occ} value={occ}>
                {occ === 'ALL' ? 'All Occupations' : occ}
              </option>
            ))}
          </select>
        </div>

        {/* City / Metro */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-500 mb-1">
            City / Metro
          </label>
          <select
            value={filters.metro}
            onChange={e => setFilter('metro', e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          >
            {metros.map(m => (
              <option key={m} value={m}>
                {m === 'ALL' ? 'All Metros' : m}
              </option>
            ))}
          </select>
        </div>

        {/* Experience Band */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-500 mb-1">
            Experience Level
          </label>
          <select
            value={filters.expBand}
            onChange={e => setFilter('expBand', e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          >
            {expBands.map(exp => (
              <option key={exp} value={exp}>
                {exp === 'ALL' ? 'All Experience Levels' : exp}
              </option>
            ))}
          </select>
        </div>

        {/* Salary Band */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-500 mb-1">
            Salary Band
          </label>
          <select
            value={filters.salaryBand}
            onChange={e => setFilter('salaryBand', e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          >
            {salaryBands.map(sal => (
              <option key={sal} value={sal}>
                {sal === 'ALL' ? 'All Salary Bands' : sal}
              </option>
            ))}
          </select>
        </div>

        {/* Skill Category */}
        {showCategoryFilter && (
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
              Skill Category
            </label>
            <select
              value={filters.skillCategory}
              onChange={e => setFilter('skillCategory', e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat === 'ALL' ? 'All Categories' : cat}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
    </div>
  );
}
