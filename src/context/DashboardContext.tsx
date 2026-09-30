'use client';

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { PostingsData, Skill, SkillPair, FilterState, CompactPosting } from '@/types/data';
import { filterPostings } from '@/lib/dataUtils';

interface DashboardContextType {
  data: PostingsData | null;
  skills: Skill[];
  skillPairs: SkillPair[];
  skillMap: Map<number, Skill>;
  loading: boolean;
  error: string | null;
  filters: FilterState;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  setFilter: (key: keyof FilterState, value: string) => void;
  resetFilters: () => void;
  filteredPostings: CompactPosting[];
  activeFilterCount: number;
}

const initialFilters: FilterState = {
  occupation: 'ALL',
  metro: 'ALL',
  expBand: 'ALL',
  salaryBand: 'ALL',
  skillCategory: 'ALL'
};

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<PostingsData | null>(null);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [skillPairs, setSkillPairs] = useState<SkillPair[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [activeTab, setActiveTab] = useState<string>('overview');

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [postingsRes, skillsRes, pairsRes] = await Promise.all([
          fetch('/data/postings.json'),
          fetch('/data/skills.json'),
          fetch('/data/skill_pairs.json')
        ]);

        if (!postingsRes.ok || !skillsRes.ok || !pairsRes.ok) {
          throw new Error('Failed to load dataset files');
        }

        const postingsData: PostingsData = await postingsRes.json();
        const skillsData: Skill[] = await skillsRes.json();
        const pairsData: SkillPair[] = await pairsRes.json();

        setData(postingsData);
        setSkills(skillsData);
        setSkillPairs(pairsData);
        setError(null);
      } catch (err: any) {
        console.error(err);
        setError(err.message || 'Error loading dashboard data');
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const skillMap = useMemo(() => {
    return new Map(skills.map(s => [s.id, s]));
  }, [skills]);

  const filteredPostings = useMemo(() => {
    if (!data) return [];
    return filterPostings(data, filters, skillMap);
  }, [data, filters, skillMap]);

  const setFilter = (key: keyof FilterState, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters(initialFilters);
  };

  const activeFilterCount = useMemo(() => {
    return Object.values(filters).filter(val => val !== 'ALL').length;
  }, [filters]);

  return (
    <DashboardContext.Provider
      value={{
        data,
        skills,
        skillPairs,
        skillMap,
        loading,
        error,
        filters,
        activeTab,
        setActiveTab,
        setFilter,
        resetFilters,
        filteredPostings,
        activeFilterCount
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
}
