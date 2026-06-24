import React, { useState } from 'react';
import { useAppData } from '../context/AppDataContext';
import { Plus, X, Trash2, Calendar as CalendarIcon, Edit2 } from 'lucide-react';
import { generateId } from '../utils';

export default function WellbeingJournal() {
  const { students, wellbeingEntries, setWellbeingEntries } = useAppData();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [studentId, setStudentId] = useState(students.length > 0 ? students[0].id : '');
  const [feeling, setFeeling] = useState('');
  const [goingWell, setGoingWell] = useState('');
  const [challenging, setChallenging] = useState('');
  const [help, setHelp] = useState('');

  const openModal = (entry?: any) => {
    if (entry) {
      setEditingId(entry.id);
      setDate(entry.date);
      setStudentId(entry.studentId);
      setFeeling(entry.feeling);
      setGoingWell(entry.goingWell);
      setChallenging(entry.challenging);
      setHelp(entry.help);
    } else {
      setEditingId(null);
      setDate(new Date().toISOString().split('T')[0]);
      setStudentId(students.length > 0 ? students[0].id : '');
      setFeeling('');
      setGoingWell('');
      setChallenging('');
      setHelp('');
    }
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingId(null);
  };

  const saveEntry = () => {
    if (!studentId) return;

    if (editingId) {
      setWellbeingEntries(prev => prev.map(e => e.id === editingId ? {
        ...e, date, studentId, feeling, goingWell, challenging, help
      } : e));
    } else {
      setWellbeingEntries(prev => [{
        id: generateId(),
        date, studentId, feeling, goingWell, challenging, help
      }, ...prev]);
    }
    closeModal();
  };

  const deleteEntry = (id: string) => {
    setWellbeingEntries(prev => prev.filter(e => e.id !== id));
  };

  const sortedEntries = [...wellbeingEntries].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="animate-in fade-in duration-300">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="font-serif text-2xl font-bold text-[#4A3320]">Wellbeing Journal</h2>
          <p className="text-xs text-[#4A3320]/70 mt-1">Keep track of how learners are feeling, what's going well, and where they need support.</p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 px-4 py-2 bg-[#4A3320] text-[#F6F4EE] rounded-none text-xs font-medium hover:bg-[#6A7152] transition-colors shadow-none"
        >
          <Plus className="w-4 h-4" /> New Entry
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedEntries.map(entry => {
          const student = students.find(s => s.id === entry.studentId);
          return (
            <div key={entry.id} className="card p-5 bg-[#F6F4EE] border border-[#4A3320]/10 hover:border-[#4A3320]/30 transition-all rounded-none relative group">
              <div className="flex justify-between items-start mb-4 border-b border-[#4A3320]/10 pb-3">
                <div>
                  <h3 className="font-serif font-bold text-[#4A3320] text-lg">{student?.name || 'Unknown Learner'}</h3>
                  <div className="flex items-center gap-1.5 text-xs font-medium text-[#4A3320]/60 mt-1 uppercase tracking-widest">
                    <CalendarIcon className="w-3.5 h-3.5" />
                    {new Date(entry.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                  </div>
                </div>
                <div className="flex gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openModal(entry)} className="p-1.5 text-[#4A3320]/40 hover:text-[#4A3320] hover:bg-[#4A3320]/10 rounded-none transition-colors">
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => deleteEntry(entry.id)} className="p-1.5 text-[#4A3320]/40 hover:text-[#C25934] hover:bg-[#C25934]/10 rounded-none transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              
              <div className="space-y-4">
                {entry.feeling && (
                  <div>
                    <span className="block text-[10px] uppercase font-bold tracking-widest text-[#C25934] mb-1">Feeling</span>
                    <p className="text-sm text-[#4A3320]/90 leading-relaxed font-serif italic">"{entry.feeling}"</p>
                  </div>
                )}
                
                {entry.goingWell && (
                  <div>
                    <span className="block text-[10px] uppercase font-bold tracking-widest text-[#6A7152] mb-1">Going Well</span>
                    <p className="text-xs text-[#4A3320]/80 leading-relaxed bg-[#6A7152]/5 p-2 border-l-2 border-[#6A7152]">{entry.goingWell}</p>
                  </div>
                )}

                {entry.challenging && (
                  <div>
                    <span className="block text-[10px] uppercase font-bold tracking-widest text-[#EAB242] mb-1">Challenging</span>
                    <p className="text-xs text-[#4A3320]/80 leading-relaxed bg-[#EAB242]/5 p-2 border-l-2 border-[#EAB242]">{entry.challenging}</p>
                  </div>
                )}

                {entry.help && (
                  <div>
                    <span className="block text-[10px] uppercase font-bold tracking-widest text-[#D8B47E] mb-1">What would help</span>
                    <p className="text-xs text-[#4A3320]/80 leading-relaxed bg-[#D8B47E]/10 p-2 border-l-2 border-[#D8B47E]">{entry.help}</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
        {sortedEntries.length === 0 && (
          <div className="col-span-full py-16 text-center border border-dashed border-[#4A3320]/20 text-[#4A3320]/40 font-medium">
            No wellbeing journal entries yet. Click "New Entry" to add one.
          </div>
        )}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-[#4A3320]/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="card w-full max-w-lg p-6 bg-[#F6F4EE] rounded-none shadow-xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-[#4A3320]/20 pb-4 mb-4 shrink-0">
              <h3 className="font-serif font-semibold text-xl text-[#4A3320]">{editingId ? 'Edit Check-in' : 'New Check-in'}</h3>
              <button onClick={closeModal} className="text-[#4A3320]/40 hover:text-[#4A3320]/80 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4 overflow-y-auto pr-2 pb-2">
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-xs font-semibold uppercase text-[#4A3320]/50 tracking-wider mb-1.5">Date</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full text-xs font-medium border border-[#4A3320]/20 bg-white rounded-none px-3 py-2 outline-none focus:border-[#4A3320]"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-semibold uppercase text-[#4A3320]/50 tracking-wider mb-1.5">Learner</label>
                  <select
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    className="w-full text-xs font-medium border border-[#4A3320]/20 bg-white rounded-none px-3 py-2 outline-none focus:border-[#4A3320]"
                  >
                    <option value="" disabled>Select learner...</option>
                    {students.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-[#4A3320]/50 tracking-wider mb-1.5">How am I feeling?</label>
                <textarea
                  value={feeling}
                  onChange={(e) => setFeeling(e.target.value)}
                  rows={2}
                  className="w-full text-xs border border-[#4A3320]/20 bg-white rounded-none px-3 py-2 outline-none focus:border-[#4A3320] resize-none"
                  placeholder="e.g. Energetic and excited for today."
                />
              </div>
              
              <div>
                <label className="block text-xs font-semibold uppercase text-[#4A3320]/50 tracking-wider mb-1.5">What's going well?</label>
                <textarea
                  value={goingWell}
                  onChange={(e) => setGoingWell(e.target.value)}
                  rows={2}
                  className="w-full text-xs border border-[#4A3320]/20 bg-white rounded-none px-3 py-2 outline-none focus:border-[#4A3320] resize-none"
                  placeholder="e.g. Mastered the 8 times table."
                />
              </div>
              
              <div>
                <label className="block text-xs font-semibold uppercase text-[#4A3320]/50 tracking-wider mb-1.5">What is challenging?</label>
                <textarea
                  value={challenging}
                  onChange={(e) => setChallenging(e.target.value)}
                  rows={2}
                  className="w-full text-xs border border-[#4A3320]/20 bg-white rounded-none px-3 py-2 outline-none focus:border-[#4A3320] resize-none"
                  placeholder="e.g. Staying focused during long reading sessions."
                />
              </div>
              
              <div>
                <label className="block text-xs font-semibold uppercase text-[#4A3320]/50 tracking-wider mb-1.5">What would help?</label>
                <textarea
                  value={help}
                  onChange={(e) => setHelp(e.target.value)}
                  rows={2}
                  className="w-full text-xs border border-[#4A3320]/20 bg-white rounded-none px-3 py-2 outline-none focus:border-[#4A3320] resize-none"
                  placeholder="e.g. Taking more frequent 5-minute breaks."
                />
              </div>
            </div>

            <div className="flex gap-3 justify-end pt-4 mt-2 border-t border-[#4A3320]/10 shrink-0">
              <button 
                onClick={closeModal} 
                className="px-4 py-2 text-xs font-medium text-[#4A3320]/70 hover:bg-[#4A3320]/5 rounded-none transition-colors border border-transparent"
              >
                Cancel
              </button>
              <button 
                onClick={saveEntry} 
                className="px-6 py-2 text-xs font-medium text-[#F6F4EE] bg-[#4A3320] hover:bg-[#6A7152] rounded-none transition-all"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
