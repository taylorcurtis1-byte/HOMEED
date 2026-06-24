import React from 'react';
import { TabState } from '../types';
import { LayoutDashboard, Users, Calendar, BookOpen, FileText, BarChart3, Settings as SettingsIcon, Download, Heart } from 'lucide-react';
import { cn } from '../utils';

interface SidebarProps {
  currentTab: TabState;
  setTab: (tab: TabState) => void;
}

export function Sidebar({ currentTab, setTab }: SidebarProps) {
  const exportBackupData = () => {
    try {
      const outputDict: Record<string, string | null> = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('mh_clean_v3_')) {
          outputDict[key] = localStorage.getItem(key);
        }
      }
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(outputDict));
      const anchorNode = document.createElement('a');
      anchorNode.setAttribute("href", dataStr);
      anchorNode.setAttribute("download", `mason_hope_co_backup.json`);
      document.body.appendChild(anchorNode);
      anchorNode.click();
      anchorNode.remove();
    } catch (e) {
      console.error('Failed to export data', e);
    }
  };

  const navItems = [
    { id: 'dashboard', label: 'Home Dashboard', icon: LayoutDashboard },
    { id: 'students', label: 'Learner Profiles', icon: Users },
    { id: 'wellbeing', label: 'Wellbeing', icon: Heart },
    { id: 'planner', label: 'Daily Timetable', icon: Calendar },
    { id: 'resources', label: 'Logs & Libraries', icon: BookOpen },
    { id: 'reports', label: 'LA Report Prep', icon: FileText },
    { id: 'analytics', label: 'Analytics & Budget', icon: BarChart3 }
  ] as const;

  return (
    <aside className="w-[280px] min-h-screen p-6 flex-shrink-0 hidden md:flex flex-col border-r border-[#4A3320]/20 bg-transparent">
      <div className="mb-8 text-center pb-6 border-b border-[#4A3320]/10 relative">
        <div className="w-24 h-16 mb-4 mx-auto relative flex items-end justify-center">
          <svg viewBox="0 0 100 65" className="w-full h-full overflow-visible" preserveAspectRatio="xMidYMax meet">
            <defs>
              <filter id="watercolor" x="-20%" y="-20%" width="140%" height="140%">
                <feTurbulence type="fractalNoise" baseFrequency="0.4" numOctaves="3" result="noise" />
                <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" xChannelSelector="R" yChannelSelector="G" result="displaced" />
                <feGaussianBlur in="displaced" stdDeviation="0.4" result="blurred" />
              </filter>
            </defs>
            <g filter="url(#watercolor)" fill="none" strokeLinecap="round">
              <path d="M 10,60 C 10,15 90,15 90,60" stroke="#C25934" strokeWidth="7" />
              <path d="M 23,60 C 23,28 77,28 77,60" stroke="#D8B47E" strokeWidth="7" />
              <path d="M 36,60 C 36,41 64,41 64,60" stroke="#EAB242" strokeWidth="7" />
              <path d="M 47,60 C 47,51 53,51 53,60" stroke="#6A7152" strokeWidth="8" />
            </g>
          </svg>
        </div>
        <h1 className="font-serif mt-0" style={{ fontSize: '26px', fontWeight: 600, letterSpacing: '0.02em', color: '#4A3320' }}>
          Mason <span style={{ color: '#889072' }}>&amp;</span> <span style={{ color: '#C25934' }}>Hope</span> Co
        </h1>
        <p className="text-[10px] kerning-wide uppercase text-[#4A3320]/40 font-bold mt-2">Home Education</p>
      </div>

      <nav className="flex flex-col gap-1 flex-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setTab(item.id as TabState)}
            className={cn(
              "text-left px-4 py-2.5 rounded-none font-medium transition-all group flex items-center gap-3",
              currentTab === item.id 
                ? "bg-[#4A3320]/10 text-[#4A3320] font-semibold" 
                : "text-[#4A3320]/80 hover:bg-[#4A3320]/5 hover:text-[#4A3320]"
            )}
          >
            <item.icon className="w-4 h-4" /> <span>{item.label}</span>
          </button>
        ))}
        
        <button
          onClick={() => setTab('settings')}
          className={cn(
            "text-left px-4 py-2.5 rounded-none font-medium mt-auto border-t border-[#4A3320]/20/60 pt-4 flex items-center gap-3 transition-all",
            currentTab === 'settings'
              ? "bg-[#4A3320]/10 text-[#4A3320] font-semibold" 
              : "text-[#4A3320]/80 hover:bg-[#4A3320]/5 hover:text-[#4A3320]"
          )}
        >
          <SettingsIcon className="w-4 h-4" /> <span>Settings & Tools</span>
        </button>
      </nav>

      <div className="pt-4 text-center">
        <button
          onClick={exportBackupData}
          className="text-xs text-[#4A3320] hover:text-[#4A543F] font-medium flex items-center gap-1.5 justify-center w-full py-2 border border-[#4A3320]/20 rounded-none hover:bg-[#4A3320]/5 transition-all"
        >
          <Download className="w-3.5 h-3.5" /> Download Data Backup
        </button>
      </div>
    </aside>
  );
}

export function MobileNav({ currentTab, setTab }: SidebarProps) {
  const items = [
    { id: 'dashboard', icon: LayoutDashboard },
    { id: 'students', icon: Users },
    { id: 'wellbeing', icon: Heart },
    { id: 'planner', icon: Calendar },
    { id: 'resources', icon: BookOpen },
    { id: 'reports', icon: FileText },
    { id: 'analytics', icon: BarChart3 },
    { id: 'settings', icon: SettingsIcon }
  ] as const;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[#F6F4EE] border-t border-[#4A3320]/20 z-[100] flex justify-around py-2.5 shadow-none">
      {items.map(item => (
        <button
          key={item.id}
          onClick={() => setTab(item.id as TabState)}
          className={cn(
            "p-2 rounded-none transition-all",
            currentTab === item.id 
              ? "bg-[#4A3320]/10 text-[#4A3320]" 
              : "text-[#4A3320]/80 hover:bg-[#4A3320]/5"
          )}
        >
          <item.icon className="w-5 h-5" />
        </button>
      ))}
    </div>
  );
}
