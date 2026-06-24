import React, { useState } from 'react';
import { useAppData } from '../context/AppDataContext';
import { Plus, Trash2, X } from 'lucide-react';
import { generateId } from '../utils';

export default function LearnerProfiles() {
  const { students, setStudents, wellbeingEntries, setWellbeingEntries } = useAppData();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [modalName, setModalName] = useState('');
  const [modalGrade, setModalGrade] = useState('');
  const [modalFocusInput, setModalFocusInput] = useState('');
  const [modalTags, setModalTags] = useState<string[]>([]);
  const [modalPriorities, setModalPriorities] = useState('');
  const [modalInterests, setModalInterests] = useState('');
  
  const [feeling, setFeeling] = useState('');
  const [goingWell, setGoingWell] = useState('');
  const [challenging, setChallenging] = useState('');
  const [help, setHelp] = useState('');

  const addTag = () => {
    const val = modalFocusInput.trim();
    if (val && !modalTags.includes(val)) {
      setModalTags([...modalTags, val]);
    }
    setModalFocusInput('');
  };

  const removeTag = (idx: number) => {
    setModalTags(modalTags.filter((_, i) => i !== idx));
  };

  const openModal = (student?: any) => {
    if (student) {
      setEditingId(student.id);
      setModalName(student.name);
      setModalGrade(student.grade);
      setModalTags(student.focuses ? [...student.focuses] : []);
      setModalPriorities(student.priorities || '');
      setModalInterests(student.interests || '');

      const latestWellbeing = wellbeingEntries
        .filter(w => w.studentId === student.id)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

      if (latestWellbeing) {
         setFeeling(latestWellbeing.feeling || '');
         setGoingWell(latestWellbeing.goingWell || '');
         setChallenging(latestWellbeing.challenging || '');
         setHelp(latestWellbeing.help || '');
      } else {
         setFeeling(student.wellbeing?.feeling || '');
         setGoingWell(student.wellbeing?.goingWell || '');
         setChallenging(student.wellbeing?.challenging || '');
         setHelp(student.wellbeing?.help || '');
      }
    } else {
      setEditingId(null);
      setModalName('');
      setModalGrade('');
      setModalTags([]);
      setModalPriorities('');
      setModalInterests('');
      setFeeling('');
      setGoingWell('');
      setChallenging('');
      setHelp('');
    }
    setModalFocusInput('');
    setModalOpen(true);
  };

  const saveProfile = () => {
    if (!modalName.trim()) return;
    
    const wellbeingData = { feeling, goingWell, challenging, help };
    let currentStudentId = editingId || generateId();
    const todayDate = new Date().toISOString().split('T')[0];

    if (feeling || goingWell || challenging || help) {
        setWellbeingEntries(prev => {
           const existingIndex = prev.findIndex(e => e.studentId === currentStudentId && e.date === todayDate);
           if (existingIndex >= 0) {
              const newEntries = [...prev];
              newEntries[existingIndex] = {
                 ...newEntries[existingIndex],
                 feeling, goingWell, challenging, help
              };
              return newEntries;
           } else {
              return [{
                 id: generateId(),
                 studentId: currentStudentId,
                 date: todayDate,
                 feeling, goingWell, challenging, help
              }, ...prev];
           }
        });
    }
    
    if (editingId) {
      setStudents(prev => prev.map(s => s.id === currentStudentId ? {
        ...s,
        name: modalName.trim(),
        grade: modalGrade.trim(),
        focuses: modalTags,
        priorities: modalPriorities.trim(),
        interests: modalInterests.trim(),
        wellbeing: wellbeingData
      } : s));
    } else {
      setStudents(prev => [...prev, {
        id: currentStudentId,
        name: modalName.trim(),
        grade: modalGrade.trim(),
        focuses: modalTags,
        progress: 0,
        priorities: modalPriorities.trim(),
        interests: modalInterests.trim(),
        wellbeing: wellbeingData
      }]);
    }
    closeModal();
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingId(null);
    setModalName('');
    setModalGrade('');
    setModalFocusInput('');
    setModalTags([]);
    setModalPriorities('');
    setModalInterests('');
    setFeeling('');
    setGoingWell('');
    setChallenging('');
    setHelp('');
  };

  const updateProgress = (id: string, val: string) => {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, progress: parseInt(val) || 0 } : s));
  };

  const deleteStudent = (id: string) => {
    setStudents(prev => prev.filter(s => s.id !== id));
  };

  return (
    <div className="animate-in fade-in duration-300">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-serif text-2xl font-bold text-[#4A3320]">Our Learners</h2>
          <p className="text-xs text-[#4A3320]/70">Manage individual profiles, assign topics, and track progress.</p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 px-4 py-2 bg-[#4A3320] text-white rounded-none text-xs font-medium hover:bg-black transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Learner Profile
        </button>
      </div>

      <div className="card p-6 overflow-x-auto rounded-none border border-[#4A3320]/20 bg-[#F6F4EE] shadow-none">
        <div className="w-full min-w-[800px]">
          <div className="flex font-semibold text-[#4A3320]/40 text-xs uppercase tracking-wider pb-3 border-b border-[#4A3320]/20 px-2">
            <div className="w-1/5">Learner's Name</div>
            <div className="w-32">Age / Stage</div>
            <div className="w-2/5">Focus Areas for the Year</div>
            <div className="w-48">Yearly Focus Progress</div>
            <div className="w-20 text-center">Actions</div>
          </div>
          <div className="divide-y divide-gray-100">
            {students.length === 0 ? (
              <p className="text-center text-xs py-8 text-[#4A3320]/40 font-medium">No active learner profiles found.</p>
            ) : (
              students.map((s) => {
                const latestWellbeing = wellbeingEntries
                  .filter(w => w.studentId === s.id)
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
                
                return (
                <div key={s.id} className="flex flex-row items-center py-4 px-2 gap-4 text-xs text-[#4A3320]/80">
                  <div className="w-1/5 font-semibold text-[#4A3320]">
                    {s.name}
                    {latestWellbeing?.feeling && (
                      <div className="text-[9px] uppercase tracking-wider font-bold text-[#C25934] mt-1 line-clamp-1 opacity-80" title={latestWellbeing.feeling}>
                        <span className="opacity-60">Feeling:</span> {latestWellbeing.feeling}
                      </div>
                    )}
                  </div>
                  <div className="w-32 text-[#4A3320]/70">{s.grade || '—'}</div>
                  <div className="w-2/5 flex flex-wrap gap-1.5 pr-2">
                    {s.focuses && s.focuses.length > 0 ? (
                      s.focuses.map((f, i) => (
                        <span key={i} className="inline-block bg-[#4A3320]/10 border border-[#4A3320]/20 text-[#4A3320]/90 text-xs px-2.5 py-1 rounded-none font-medium">
                          {f}
                        </span>
                      ))
                    ) : (
                      <span className="text-[#4A3320]/40 italic text-xs">No focus fields set</span>
                    )}
                  </div>
                  <div className="w-48 space-y-1">
                    <div className="flex justify-between text-xs font-semibold text-[#4A3320]/70">
                      <span>Progress</span>
                      <span>{s.progress}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={s.progress}
                      onChange={(e) => updateProgress(s.id, e.target.value)}
                      className="w-full accent-[#4A3320]"
                    />
                  </div>
                  <div className="w-20 flex items-center justify-center gap-3">
                    <button onClick={() => openModal(s)} className="text-[#4A3320]/40 hover:text-[#4A3320] transition-colors font-semibold uppercase text-[10px] tracking-wider">
                      Edit
                    </button>
                    <button onClick={() => deleteStudent(s.id)} className="text-[#4A3320]/30 hover:text-red-500 transition-colors">
                      <Trash2 className="w-4 h-4 inline" />
                    </button>
                  </div>
                </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-[#4A3320]/40 backdrop-blur-sm z-50 flex items-center justify-center animate-in fade-in duration-200 p-4">
          <div className="card max-w-lg w-full p-6 mx-4 shadow-none bg-[#F6F4EE] rounded-none max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-[#4A3320]/20 pb-3 mb-4 shrink-0">
              <h3 className="font-serif font-semibold text-lg text-[#4A3320]">{editingId ? 'Edit Learner Profile' : 'New Learner Profile'}</h3>
              <button onClick={closeModal} className="text-[#4A3320]/40 hover:text-[#4A3320]/80"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4 overflow-y-auto pr-2 pb-2">
              <div>
                <label className="block text-xs font-semibold uppercase text-[#4A3320]/40 tracking-wider mb-1">Learner's Name</label>
                <input
                  type="text"
                  value={modalName}
                  onChange={(e) => setModalName(e.target.value)}
                  className="w-full text-xs border border-[#4A3320]/20 rounded-none px-3 py-2 outline-none focus:border-[#4A3320]"
                  placeholder="e.g. Mason"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-[#4A3320]/40 tracking-wider mb-1">Age / Learning Stage</label>
                <input
                  type="text"
                  value={modalGrade}
                  onChange={(e) => setModalGrade(e.target.value)}
                  className="w-full text-xs border border-[#4A3320]/20 rounded-none px-3 py-2 outline-none focus:border-[#4A3320]"
                  placeholder="e.g. Age 8 / Key Stage 2"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-[#4A3320]/40 tracking-wider mb-1">Assign Focus Areas</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={modalFocusInput}
                    onChange={(e) => setModalFocusInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addTag()}
                    className="flex-1 text-xs border border-[#4A3320]/20 rounded-none px-3 py-2 outline-none focus:border-[#4A3320]"
                    placeholder="e.g. Creative Writing"
                  />
                  <button onClick={addTag} className="px-3 bg-[#4A3320]/10 hover:bg-[#4A3320]/20 border border-[#4A3320]/20 rounded-none font-bold text-[#4A3320]">+</button>
                </div>
                <div className="flex flex-wrap gap-1.5 p-2 bg-transparent border border-[#4A3320]/20 rounded-none min-h-11">
                  {modalTags.map((tag, idx) => (
                    <span key={idx} className="inline-flex items-center gap-1 bg-[#4A3320]/5 text-[#4A3320] border border-[#4A3320]/10 text-xs font-medium px-2 py-1 rounded-none">
                      {tag}
                      <button onClick={() => removeTag(idx)} className="text-[#C25934] hover:text-red-700 font-bold ml-0.5">&times;</button>
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-[#4A3320]/40 tracking-wider mb-1">Core Priorities</label>
                <textarea
                  value={modalPriorities}
                  onChange={(e) => setModalPriorities(e.target.value)}
                  rows={2}
                  className="w-full text-xs border border-[#4A3320]/20 rounded-none px-3 py-2 outline-none focus:border-[#4A3320] resize-none"
                  placeholder="e.g. Focus on math fundamentals and reading comprehension."
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-[#4A3320]/40 tracking-wider mb-1">Child Interests</label>
                <textarea
                  value={modalInterests}
                  onChange={(e) => setModalInterests(e.target.value)}
                  rows={2}
                  className="w-full text-xs border border-[#4A3320]/20 rounded-none px-3 py-2 outline-none focus:border-[#4A3320] resize-none"
                  placeholder="e.g. Dinosaurs, space, building with blocks, helping in the garden."
                />
              </div>
              
              <div className="pt-3 border-t border-[#4A3320]/10">
                <h4 className="font-serif font-semibold text-[#4A3320] text-sm mb-3">Wellbeing Check-in</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold uppercase text-[#4A3320]/40 tracking-wider mb-1">How am I feeling?</label>
                    <textarea
                      value={feeling}
                      onChange={(e) => setFeeling(e.target.value)}
                      rows={2}
                      className="w-full text-xs border border-[#4A3320]/20 rounded-none px-3 py-2 outline-none focus:border-[#4A3320] resize-none"
                      placeholder="e.g. Happy, energetic..."
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase text-[#4A3320]/40 tracking-wider mb-1">What's going well?</label>
                    <textarea
                      value={goingWell}
                      onChange={(e) => setGoingWell(e.target.value)}
                      rows={2}
                      className="w-full text-xs border border-[#4A3320]/20 rounded-none px-3 py-2 outline-none focus:border-[#4A3320] resize-none"
                      placeholder="e.g. Math problems were easy today."
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase text-[#4A3320]/40 tracking-wider mb-1">What is challenging?</label>
                    <textarea
                      value={challenging}
                      onChange={(e) => setChallenging(e.target.value)}
                      rows={2}
                      className="w-full text-xs border border-[#4A3320]/20 rounded-none px-3 py-2 outline-none focus:border-[#4A3320] resize-none"
                      placeholder="e.g. Reading the new book."
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase text-[#4A3320]/40 tracking-wider mb-1">What would help?</label>
                    <textarea
                      value={help}
                      onChange={(e) => setHelp(e.target.value)}
                      rows={2}
                      className="w-full text-xs border border-[#4A3320]/20 rounded-none px-3 py-2 outline-none focus:border-[#4A3320] resize-none"
                      placeholder="e.g. Can we do more art time?"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-3 justify-end pt-4 shrink-0 border-t border-[#4A3320]/10 mt-2">
              <button onClick={closeModal} className="px-4 py-2 text-xs text-[#4A3320]/70 font-medium hover:bg-[#4A3320]/5 rounded-none transition-all border border-transparent">Cancel</button>
              <button onClick={saveProfile} className="px-5 py-2 text-xs text-[#F6F4EE] bg-[#4A3320] font-medium hover:bg-[#6A7152] rounded-none transition-all shadow-none">Save Profile</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
