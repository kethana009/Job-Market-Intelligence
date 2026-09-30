'use client';

import React from 'react';
import { DashboardProvider } from '@/context/DashboardContext';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import MainContent from '@/components/MainContent';

export default function Home() {
  return (
    <DashboardProvider>
      <div className="flex min-h-screen bg-slate-50 text-slate-900 font-sans antialiased">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          <Header />
          <main className="flex-1">
            <MainContent />
          </main>
        </div>
      </div>
    </DashboardProvider>
  );
}
