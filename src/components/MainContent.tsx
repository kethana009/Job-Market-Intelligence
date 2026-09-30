'use client';

import React from 'react';
import { useDashboard } from '@/context/DashboardContext';
import OverviewPage from '@/components/pages/OverviewPage';
import SkillsDemandPage from '@/components/pages/SkillsDemandPage';
import SkillsRolesPage from '@/components/pages/SkillsRolesPage';
import CitiesExperiencePage from '@/components/pages/CitiesExperiencePage';
import SkillPairsPage from '@/components/pages/SkillPairsPage';
import { Loader2, AlertCircle } from 'lucide-react';

export default function MainContent() {
  const { activeTab, loading, error } = useDashboard();

  if (loading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-8 text-center">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
        <h3 className="text-lg font-bold text-slate-900 mb-1">Loading Job Market Data</h3>
        <p className="text-xs text-slate-500">Processing 39,509 job postings and skill mappings...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-8 text-center">
        <div className="p-4 rounded-full bg-red-50 text-red-600 mb-4 border border-red-200">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 mb-1">Error Loading Data</h3>
        <p className="text-xs text-red-600 max-w-md">{error}</p>
      </div>
    );
  }

  switch (activeTab) {
    case 'overview':
      return <OverviewPage />;
    case 'skills-demand':
      return <SkillsDemandPage />;
    case 'skills-roles':
      return <SkillsRolesPage />;
    case 'cities-experience':
      return <CitiesExperiencePage />;
    case 'skill-pairs':
      return <SkillPairsPage />;
    default:
      return <OverviewPage />;
  }
}
