import React, { useState } from 'react';
import { useAppData } from '../context/AppDataContext';
import { CheckSquare, PenTool, X, ChevronLeft, ChevronRight, FileText } from 'lucide-react';
import { generateId } from '../utils';
import { format, addDays, subDays, parseISO } from 'date-fns';

export default function Dashboard() {
  const { settings, dailyTasks, setDailyTasks, dailyNotesMap, setDailyNotesMap, reportData, students } = useAppData();
  const [newTaskInput, setNewTaskInput] = useState('');
  
  const [currentDateObj, setCurrentDateObj] = useState(new Date());
  const selectedDateISO = currentDateObj.toISOString().split('T')[0];
  const isToday = selectedDateISO === new Date().toISOString().split('T')[0];

  const dateStr = format(currentDateObj, 'EEEE, d MMMM yyyy');
  const hours = new Date().getHours();
  // Only use greeting if it's today
  const greeting = !isToday ? 'Record for' : hours >= 12 && hours < 18 ? 'Good Afternoon,' : hours >= 18 || hours < 5 ? 'Good Evening,' : 'Good Morning,';

  const navigateDay = (dir: number) => {
    setCurrentDateObj(prev => dir > 0 ? addDays(prev, 1) : subDays(prev, 1));
  };
  const jumpToToday = () => setCurrentDateObj(new Date());

  const currentTasks = dailyTasks[selectedDateISO] || [];
  const currentNotes = dailyNotesMap[selectedDateISO] || '';

  const addTask = () => {
    if (!newTaskInput.trim()) return;
    setDailyTasks(prev => {
      const existing = prev[selectedDateISO] || [];
      return { ...prev, [selectedDateISO]: [...existing, { id: generateId(), text: newTaskInput.trim(), done: false }] };
    });
    setNewTaskInput('');
  };

  const toggleTask = (id: string) => {
    setDailyTasks(prev => {
      const existing = prev[selectedDateISO] || [];
      return { ...prev, [selectedDateISO]: existing.map(t => t.id === id ? { ...t, done: !t.done } : t) };
    });
  };

  const deleteTask = (id: string) => {
    setDailyTasks(prev => {
      const existing = prev[selectedDateISO] || [];
      return { ...prev, [selectedDateISO]: existing.filter(t => t.id !== id) };
    });
  };

  const updateNotes = (val: string) => {
    setDailyNotesMap(prev => ({ ...prev, [selectedDateISO]: val }));
  };

  return (
    <div className="animate-in fade-in duration-300">
      <div className="card p-6 mb-6 rounded-none border border-[#4A3320]/20 bg-[#F6F4EE] shadow-none">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="font-serif text-2xl">{greeting}</span>
              {isToday && <span className="font-serif text-2xl text-[#4A3320] font-semibold">{settings.educatorName}</span>}
            </div>
            
            <div className="flex items-center gap-1 bg-white border border-[#4A3320]/20 p-1">
              <button onClick={() => navigateDay(-1)} className="p-1 hover:bg-[#4A3320]/5 text-[#4A3320] transition-colors"><ChevronLeft className="w-4 h-4" /></button>
              <button onClick={jumpToToday} className="px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#4A3320] hover:bg-[#4A3320]/5 transition-colors">Today</button>
              <button onClick={() => navigateDay(1)} className="p-1 hover:bg-[#4A3320]/5 text-[#4A3320] transition-colors"><ChevronRight className="w-4 h-4" /></button>
            </div>
          </div>
          
          <div className="text-right">
            <p className="text-xs font-bold uppercase tracking-wider text-[#4A3320]">{dateStr}</p>
            <p className="text-[10px] uppercase tracking-widest text-[#4A3320]/40 mt-1">Planner: <span className="font-bold text-[#4A3320]">{settings.familyName}</span></p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="card p-6 rounded-none border border-[#4A3320]/20 bg-[#F6F4EE] shadow-none flex flex-col h-[350px]">
          <h3 className="font-serif italic text-2xl mb-4 flex items-center gap-2 text-[#4A3320]">
            Learning Targets
          </h3>
          <div className="space-y-2 mb-4 flex-1 overflow-y-auto pr-1">
            {currentTasks.length === 0 && (
              <p className="text-[#4A3320]/40 text-xs italic">No targets set for this date. Add one below.</p>
            )}
            {currentTasks.map(t => (
              <div key={t.id} className="flex items-center gap-3 group py-0.5">
                <input
                  type="checkbox"
                  className="w-4 h-4 accent-[#4A3320] rounded-none border border-[#4A3320]/40"
                  checked={t.done}
                  onChange={() => toggleTask(t.id)}
                />
                <span className={`flex-1 text-xs ${t.done ? 'line-through text-[#4A3320]/40' : ''}`}>
                  {t.text}
                </span>
                <button
                  onClick={() => deleteTask(t.id)}
                  className="opacity-40 hover:opacity-100 md:opacity-0 md:group-hover:opacity-100 text-[#4A3320]/40 hover:text-[#4A3320] transition-opacity"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              className="flex-1 bg-white border border-[#4A3320]/20 rounded-none px-3 py-2 text-xs focus:outline-none focus:border-[#4A3320]"
              placeholder="Add a new target or topic..."
              value={newTaskInput}
              onChange={(e) => setNewTaskInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addTask()}
            />
            <button
              onClick={addTask}
              className="px-4 py-2 bg-[#4A3320] text-white rounded-none text-xs font-bold uppercase tracking-wider hover:bg-black transition-all"
            >
              Add
            </button>
          </div>
        </div>

        <div className="card p-6 rounded-none border border-[#4A3320]/20 bg-[#F6F4EE] shadow-none flex flex-col h-[350px]">
          <h3 className="font-serif italic text-2xl mb-4 flex items-center gap-2 text-[#4A3320]">
            Observations & Milestones
          </h3>
          <textarea
            className="w-full h-full bg-white border border-[#4A3320]/20 rounded-none p-4 text-xs resize-none focus:outline-none focus:border-[#4A3320]"
            placeholder="Record breakthroughs, achievements, or moments worth remembering today..."
            value={currentNotes}
            onChange={(e) => updateNotes(e.target.value)}
          />
        </div>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="card p-6 rounded-none border border-[#4A3320]/20 bg-white shadow-none">
          <h3 className="font-serif italic text-2xl border-b border-[#4A3320]/10 pb-3 mb-4 flex items-center gap-2 text-[#4A3320]">
            <span className="text-[#4A3320]/40">#</span> Academic Goals Progress
          </h3>
          <p className="text-[#4A3320]/60 text-xs mb-6 uppercase tracking-wider font-bold">Learner progress across core focuses</p>
          
          <div className="space-y-5 text-xs">
            {students.length === 0 ? (
              <p className="text-[#4A3320]/40 text-xs italic">No learners added. Add some in Learner Profiles.</p>
            ) : (
              students.map(s => (
                <div key={s.id} className="relative">
                  <div className="flex justify-between mb-1 items-center">
                    <span className="font-bold text-[#4A3320] text-sm">{s.name}</span>
                    <span className="font-bold text-[#4A3320] text-[10px] bg-[#4A3320]/10 px-2 py-0.5">{s.progress}%</span>
                  </div>
                  {s.focuses && s.focuses.length > 0 && (
                     <div className="text-[10px] text-[#4A3320]/60 mb-2 truncate" title={s.focuses.join(', ')}>
                        <span className="font-semibold text-[#4A3320]/80">FOCUSES:</span> {s.focuses.join(' • ')}
                     </div>
                  )}
                  <div className="w-full bg-[#4A3320]/10 h-2 rounded-none overflow-hidden relative">
                    <div 
                      className="bg-[#4A3320] h-full transition-all duration-700 ease-in-out absolute left-0 top-0" 
                      style={{ width: `${s.progress}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="card p-6 rounded-none border border-[#4A3320]/20 bg-white shadow-none">
          <h3 className="font-serif italic text-2xl border-b border-[#4A3320]/10 pb-3 mb-4 flex items-center gap-2 text-[#4A3320]">
            <FileText className="w-5 h-5 text-[#4A3320]/40" /> Our Focus Overview
          </h3>
          <p className="text-[#4A3320]/60 text-xs mb-6 uppercase tracking-wider font-bold">Snippets from the LA Report Prep to keep goals in focus</p>
          
          <div className="space-y-6">
            {students.length === 0 ? (
              <>
                <div>
                  <h4 className="border-b border-[#4A3320]/60 pb-1 mb-2 uppercase text-[10px] tracking-widest font-bold text-[#4A3320]">Core Priorities</h4>
                  <p className="text-xs text-[#4A3320]/80 leading-relaxed whitespace-pre-wrap">{reportData.priorities || 'No learning priorities defined. Update in Learner Profiles.'}</p>
                </div>
                <div>
                  <h4 className="border-b border-[#4A3320]/60 pb-1 mb-2 uppercase text-[10px] tracking-widest font-bold text-[#4A3320]">Child Interests</h4>
                  <p className="text-xs text-[#4A3320]/80 leading-relaxed whitespace-pre-wrap">{reportData.interests || 'No interests documented. Update in Learner Profiles.'}</p>
                </div>
              </>
            ) : (
              students.map(s => (
                <div key={s.id} className="space-y-3 pb-4 border-b border-[#4A3320]/10 last:border-0 last:pb-0">
                   <h4 className="font-serif font-bold text-sm text-[#4A3320]">{s.name}</h4>
                   <div className="pl-2 border-l-2 border-[#4A3320]/20 space-y-3">
                     <div>
                       <h5 className="uppercase text-[9px] tracking-widest font-bold text-[#4A3320]/60 mb-1">Core Priorities</h5>
                       <p className="text-xs text-[#4A3320]/80 leading-relaxed whitespace-pre-wrap">{s.priorities || 'No learning priorities defined.'}</p>
                     </div>
                     <div>
                       <h5 className="uppercase text-[9px] tracking-widest font-bold text-[#4A3320]/60 mb-1">Interests</h5>
                       <p className="text-xs text-[#4A3320]/80 leading-relaxed whitespace-pre-wrap">{s.interests || 'No interests documented.'}</p>
                     </div>
                   </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
