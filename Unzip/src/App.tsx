/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppDataProvider } from './context/AppDataContext';
import { Sidebar, MobileNav } from './components/Navigation';
import Dashboard from './views/Dashboard';
import LearnerProfiles from './views/LearnerProfiles';
import WellbeingJournal from './views/WellbeingJournal';
import DailyTimetable from './views/DailyTimetable';
import LogsAndLibraries from './views/LogsAndLibraries';
import ReportPrep from './views/ReportPrep';
import Analytics from './views/Analytics';
import Settings from './views/Settings';
import { TabState } from './types';

function MainApp() {
  const [currentTab, setTab] = useState<TabState>('dashboard');

  return (
    <div className="flex min-h-screen w-full bg-[#F6F4EE] text-[#4A3320] font-sans">
      <Sidebar currentTab={currentTab} setTab={setTab} />
      
      <main className="flex-1 p-6 md:p-10 pb-24 md:pb-10 overflow-y-auto">
        {currentTab === 'dashboard' && <Dashboard />}
        {currentTab === 'students' && <LearnerProfiles />}
        {currentTab === 'wellbeing' && <WellbeingJournal />}
        {currentTab === 'planner' && <DailyTimetable />}
        {currentTab === 'resources' && <LogsAndLibraries />}
        {currentTab === 'reports' && <ReportPrep />}
        {currentTab === 'analytics' && <Analytics />}
        {currentTab === 'settings' && <Settings />}
      </main>

      <MobileNav currentTab={currentTab} setTab={setTab} />
    </div>
  );
}

export default function App() {
  return (
    <AppDataProvider>
      <MainApp />
    </AppDataProvider>
  );
}
