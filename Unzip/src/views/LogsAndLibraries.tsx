import React, { useState } from 'react';
import { useAppData } from '../context/AppDataContext';
import { Plus, X } from 'lucide-react';
import { generateId } from '../utils';
import { LogEntry } from '../types';

const logConfigurations = {
  "Reading Log": { col1: "Book or Story Title", col2: "Author Name", col3: "Current Status" },
  "Resource Library": { col1: "Material or Learning Tool", col2: "Subject or Topic", col3: "Current Status" },
  "Activities Log": { col1: "Outing or Activity", col2: "Notes & Details", col3: "Current Status" }
} as const;

type LogCategory = keyof typeof logConfigurations;

export default function LogsAndLibraries() {
  const [currentCat, setCurrentCat] = useState<LogCategory>('Reading Log');
  const { logEntries, setLogEntries, students } = useAppData();

  const handleAdd = () => {
    setLogEntries(prev => [
      ...prev,
      { id: generateId(), category: currentCat, field1: '', field2: '', field3: 'In Progress', studentIds: [] } as LogEntry
    ]);
  };

  const updateEntry = (id: string, field: keyof LogEntry, val: string) => {
    setLogEntries(prev => prev.map(e => e.id === id ? { ...e, [field]: val } : e));
  };
  
  const toggleStudentInLog = (logId: string, studentId: string) => {
    setLogEntries(prev => prev.map(e => {
      if (e.id !== logId) return e;
      const currentIds = e.studentIds || [];
      const newIds = currentIds.includes(studentId)
        ? currentIds.filter(id => id !== studentId)
        : [...currentIds, studentId];
      return { ...e, studentIds: newIds };
    }));
  };

  const deleteEntry = (id: string) => {
    setLogEntries(prev => prev.filter(e => e.id !== id));
  };

  const activeEntries = logEntries.filter(e => e.category === currentCat);
  const config = logConfigurations[currentCat];

  return (
    <div className="animate-in fade-in duration-300">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-[#4A3320]">Logs & Libraries</h2>
          <p className="text-xs text-[#4A3320]/70">Keep track of books read, resources used, and educational outings.</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={currentCat}
            onChange={(e) => setCurrentCat(e.target.value as LogCategory)}
            className="text-xs bg-[#F6F4EE] border border-[#4A3320]/20 rounded-none px-3 py-2 outline-none text-[#4A3320]/90"
          >
            <option value="Reading Log">Reading Log / Literature Tracker</option>
            <option value="Resource Library">Resource Library & Materials</option>
            <option value="Activities Log">Activities & Outings Log</option>
          </select>
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 px-4 py-2 bg-[#4A3320] text-white rounded-none text-xs font-medium hover:bg-black transition-all"
          >
            <Plus className="w-4 h-4" /> Add Row
          </button>
        </div>
      </div>

      <div className="card p-6 overflow-x-auto rounded-none border border-[#4A3320]/20 bg-[#F6F4EE] shadow-none">
        <h3 className="font-serif font-bold text-lg text-[#4A3320] mb-4">{currentCat}</h3>
        <table className="w-full min-w-[900px]">
          <thead className="text-left text-xs uppercase tracking-wider text-[#4A3320]/40 border-b border-[#4A3320]/20">
            <tr>
              <th className="pb-3 font-semibold px-2">{config.col1}</th>
              <th className="pb-3 font-semibold px-2">{config.col2}</th>
              <th className="pb-3 font-semibold px-2 w-56">Learners</th>
              <th className="pb-3 font-semibold px-2 w-36">{config.col3}</th>
              <th className="pb-3 w-10"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {activeEntries.map(entry => (
              <tr key={entry.id} className="group hover:bg-[#4A3320]/5/40 transition-colors">
                <td className="py-2 px-2">
                  <input
                    type="text"
                    className="w-full border-none bg-transparent outline-none py-1 focus:border-b border-[#4A3320] font-medium text-[#4A3320]"
                    value={entry.field1}
                    onChange={(e) => updateEntry(entry.id, 'field1', e.target.value)}
                    placeholder="Enter description..."
                  />
                </td>
                <td className="py-2 px-2">
                  <input
                    type="text"
                    className="w-full border-none bg-transparent outline-none py-1 focus:border-b border-[#4A3320] text-[#4A3320]/70"
                    value={entry.field2}
                    onChange={(e) => updateEntry(entry.id, 'field2', e.target.value)}
                    placeholder="Enter extra notes..."
                  />
                </td>
                <td className="py-2 px-2">
                  <div className="flex flex-wrap gap-1">
                    {students.map(s => {
                      const isSelected = (entry.studentIds || []).includes(s.id);
                      return (
                        <button
                          key={s.id}
                          onClick={() => toggleStudentInLog(entry.id, s.id)}
                          className={`text-[9px] px-2 py-0.5 rounded-none font-bold uppercase cursor-pointer border transition-colors ${isSelected ? 'bg-[#4A3320] text-white border-[#4A3320]' : 'bg-transparent text-[#4A3320]/40 border-[#4A3320]/20 hover:text-[#4A3320] hover:border-[#4A3320]/40'}`}
                        >
                          {s.name}
                        </button>
                      );
                    })}
                  </div>
                </td>
                <td className="py-2 px-2">
                  <select
                    className="text-xs bg-[#F6F4EE] border border-[#4A3320]/20 rounded-none px-2.5 py-1 text-[#4A3320]/90 cursor-pointer outline-none focus:border-[#4A3320]"
                    value={entry.field3}
                    onChange={(e) => updateEntry(entry.id, 'field3', e.target.value)}
                  >
                    <option value="Not Started">Not Started</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="On Hold">On Hold</option>
                  </select>
                </td>
                <td className="py-2 px-2 text-center">
                  <button onClick={() => deleteEntry(entry.id)} className="opacity-40 hover:opacity-100 md:opacity-0 md:group-hover:opacity-100 text-[#4A3320]/30 hover:text-red-500 transition-opacity">
                    <X className="w-4 h-4 inline" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
