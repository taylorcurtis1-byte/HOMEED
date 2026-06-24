import React from 'react';
import { useAppData } from '../context/AppDataContext';
import { Eye, Copy, Download } from 'lucide-react';

export default function ReportPrep() {
  const { reportData, setReportData, students, setStudents } = useAppData();

  const handleChange = (field: keyof typeof reportData, value: string) => {
    setReportData(prev => ({ ...prev, [field]: value }));
  };

  const [activeTab, setActiveTab] = React.useState<string>('general');

  const updateStudentField = (id: string, field: keyof typeof reportData, value: string) => {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const generateReportText = () => {
    let text = `OUR LEARNING RECORD OUTPUT\n\n`;

    text += `OUR EDUCATIONAL PHILOSOPHY/APPROACH:\n${reportData.philosophy || '[Pending Statement]'}\n\n`;
    text += `OUR CHILDREN'S AGES AND STAGES:\n${reportData.stages || '[Pending Definition]'}\n\n`;
    text += `RESOURCES AND GROUPS WE USE:\n${reportData.resources || '[Pending Inventory Log]'}\n\n`;

    if (students.length === 0) {
      text += `OUR LEARNING PRIORITIES THIS YEAR:\n${reportData.priorities || '[Pending Goals Assignment]'}\n\n`;
      text += `CHILD'S INTERESTS & STYLE:\n${reportData.interests || '[Pending]'}\n\n`;
      text += `SOCIAL OPPORTUNITIES:\n${reportData.social || '[Pending]'}\n\n`;
      text += `ENGLISH & LITERACY PROGRESS:\n${reportData.english || '[Pending]'}\n\n`;
      text += `MATHEMATICS PROGRESS:\n${reportData.maths || '[Pending]'}\n\n`;
      text += `SCIENCE & NATURE:\n${reportData.science || '[Pending]'}\n\n`;
      text += `HUMANITIES:\n${reportData.humanities || '[Pending]'}\n\n`;
      text += `ARTS, TECH & OTHER:\n${reportData.artsTech || '[Pending]'}\n\n`;
      text += `LOOKING AHEAD:\n${reportData.lookingAhead || '[Pending]'} \n`;
    } else {
      students.forEach(s => {
        text += `\n--- LEARNER: ${s.name.toUpperCase()} ---\n\n`;
        text += `LEARNING PRIORITIES:\n${s.priorities || reportData.priorities || '[Pending]'}\n\n`;
        text += `CHILD'S INTERESTS & STYLE:\n${s.interests || reportData.interests || '[Pending]'}\n\n`;
        text += `SOCIAL OPPORTUNITIES:\n${s.social || reportData.social || '[Pending]'}\n\n`;
        text += `ENGLISH & LITERACY PROGRESS:\n${s.english || reportData.english || '[Pending]'}\n\n`;
        text += `MATHEMATICS PROGRESS:\n${s.maths || reportData.maths || '[Pending]'}\n\n`;
        text += `SCIENCE & NATURE:\n${s.science || reportData.science || '[Pending]'}\n\n`;
        text += `HUMANITIES:\n${s.humanities || reportData.humanities || '[Pending]'}\n\n`;
        text += `ARTS, TECH & OTHER:\n${s.artsTech || reportData.artsTech || '[Pending]'}\n\n`;
        text += `LOOKING AHEAD:\n${s.lookingAhead || reportData.lookingAhead || '[Pending]'}\n`;
      });
    }

    return text.trim();
  };

  const copyCompiledReport = () => {
    navigator.clipboard.writeText(generateReportText());
  };

  return (
    <div className="animate-in fade-in duration-300">
      <div className="mb-6">
        <h2 className="font-serif text-2xl font-bold text-[#4A3320]">Local Authority Report Prep</h2>
        <p className="text-xs text-[#4A3320]/70">Some ideas and prompts to help with Local Authority report writing.</p>
      </div>
      
      <div className="grid lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 space-y-6 bg-transparent border border-[#4A3320]/20 rounded-none p-8 shadow-none">
          <div className="text-center pb-4 border-b border-[#4A3320]/20 mb-4">
            <h3 className="font-serif text-3xl font-bold tracking-tight text-[#4A3320]">Our Learning</h3>
          </div>

          <div className="flex gap-2 overflow-x-auto mb-6 pb-2">
            <button 
              onClick={() => setActiveTab('general')}
              className={`px-4 py-2 font-medium text-xs whitespace-nowrap rounded-none transition-colors border ${activeTab === 'general' ? 'bg-[#4A3320] text-white border-[#4A3320]' : 'bg-transparent text-[#4A3320] border-[#4A3320]/20 hover:bg-[#4A3320]/10'}`}
            >
              Family Overview
            </button>
            {students.map(s => (
              <button 
                key={s.id}
                onClick={() => setActiveTab(s.id)}
                className={`px-4 py-2 font-medium text-xs whitespace-nowrap rounded-none transition-colors border ${activeTab === s.id ? 'bg-[#4A3320] text-white border-[#4A3320]' : 'bg-transparent text-[#4A3320] border-[#4A3320]/20 hover:bg-[#4A3320]/10'}`}
              >
                {s.name}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {activeTab === 'general' && (
              <>
                <div>
                  <label className="block text-xs font-serif font-semibold text-[#4A3320] mb-1.5 italic">Our educational philosophy/approach:</label>
                  <textarea
                    value={reportData.philosophy}
                    onChange={(e) => handleChange('philosophy', e.target.value)}
                    className="w-full h-24 p-3 text-xs bg-[#F6F4EE] border border-[#4A3320]/20 rounded-none focus:outline-none focus:border-[#4A3320] transition-all resize-none shadow-none"
                    placeholder="Summarize your main methodology (e.g., structured, child-led, eclectic)..."
                  />
                </div>
                <div>
                  <label className="block text-xs font-serif font-semibold text-[#4A3320] mb-1.5 italic">Our children's ages and stages:</label>
                  <textarea
                    value={reportData.stages}
                    onChange={(e) => handleChange('stages', e.target.value)}
                    className="w-full h-24 p-3 text-xs bg-[#F6F4EE] border border-[#4A3320]/20 rounded-none focus:outline-none focus:border-[#4A3320] transition-all resize-none shadow-none"
                    placeholder="Detail ages, relevant academic groups, or developmental stages..."
                  />
                </div>
                <div>
                  <label className="block text-xs font-serif font-semibold text-[#4A3320] mb-1.5 italic">Resources and groups we use:</label>
                  <textarea
                    value={reportData.resources}
                    onChange={(e) => handleChange('resources', e.target.value)}
                    className="w-full h-24 p-3 text-xs bg-[#F6F4EE] border border-[#4A3320]/20 rounded-none focus:outline-none focus:border-[#4A3320] transition-all resize-none shadow-none"
                    placeholder="List reference materials, digital subscriptions, local co-ops, or tutoring classes..."
                  />
                </div>

                {students.length === 0 && (
                  <>
                    <div className="mt-8 mb-4 border-b border-[#4A3320]/20 pb-2">
                      <h4 className="font-serif text-xl font-bold italic text-[#4A3320]">Child Profile & Interests</h4>
                    </div>
                    <div>
                      <label className="block text-xs font-serif font-semibold text-[#4A3320] mb-1.5 italic">Our learning priorities this year:</label>
                      <textarea
                        value={reportData.priorities}
                        onChange={(e) => handleChange('priorities', e.target.value)}
                        className="w-full h-24 p-3 text-xs bg-[#F6F4EE] border border-[#4A3320]/20 rounded-none focus:outline-none focus:border-[#4A3320] transition-all resize-none shadow-none"
                        placeholder="Detail core literacy objectives, numerical targets, or life skill benchmarks..."
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-serif font-semibold text-[#4A3320] mb-1.5 italic">Child's interests & learning style:</label>
                      <textarea
                        value={reportData.interests}
                        onChange={(e) => handleChange('interests', e.target.value)}
                        className="w-full h-24 p-3 text-xs bg-[#F6F4EE] border border-[#4A3320]/20 rounded-none focus:outline-none focus:border-[#4A3320] transition-all resize-none shadow-none"
                        placeholder="Detail current interests, favorite topics, learning styles, and aspirations..."
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-serif font-semibold text-[#4A3320] mb-1.5 italic">Social opportunities:</label>
                      <textarea
                        value={reportData.social}
                        onChange={(e) => handleChange('social', e.target.value)}
                        className="w-full h-24 p-3 text-xs bg-[#F6F4EE] border border-[#4A3320]/20 rounded-none focus:outline-none focus:border-[#4A3320] transition-all resize-none shadow-none"
                        placeholder="E.g., Scouts, home ed meetups, volunteering, clubs..."
                      />
                    </div>
                    <div className="mt-8 mb-4 border-b border-[#4A3320]/20 pb-2">
                      <h4 className="font-serif text-xl font-bold italic text-[#4A3320]">Subject Specific Progress</h4>
                    </div>
                    <div>
                      <label className="block text-xs font-serif font-semibold text-[#4A3320] mb-1.5 italic">English & Literacy:</label>
                      <textarea
                        value={reportData.english}
                        onChange={(e) => handleChange('english', e.target.value)}
                        className="w-full h-24 p-3 text-xs bg-[#F6F4EE] border border-[#4A3320]/20 rounded-none focus:outline-none focus:border-[#4A3320] transition-all resize-none shadow-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-serif font-semibold text-[#4A3320] mb-1.5 italic">Mathematics:</label>
                      <textarea
                        value={reportData.maths}
                        onChange={(e) => handleChange('maths', e.target.value)}
                        className="w-full h-24 p-3 text-xs bg-[#F6F4EE] border border-[#4A3320]/20 rounded-none focus:outline-none focus:border-[#4A3320] transition-all resize-none shadow-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-serif font-semibold text-[#4A3320] mb-1.5 italic">Science & Nature:</label>
                      <textarea
                        value={reportData.science}
                        onChange={(e) => handleChange('science', e.target.value)}
                        className="w-full h-24 p-3 text-xs bg-[#F6F4EE] border border-[#4A3320]/20 rounded-none focus:outline-none focus:border-[#4A3320] transition-all resize-none shadow-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-serif font-semibold text-[#4A3320] mb-1.5 italic">Humanities (History & Geography):</label>
                      <textarea
                        value={reportData.humanities}
                        onChange={(e) => handleChange('humanities', e.target.value)}
                        className="w-full h-24 p-3 text-xs bg-[#F6F4EE] border border-[#4A3320]/20 rounded-none focus:outline-none focus:border-[#4A3320] transition-all resize-none shadow-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-serif font-semibold text-[#4A3320] mb-1.5 italic">Arts, Tech & Other (ICT, D&T, Languages, RE):</label>
                      <textarea
                        value={reportData.artsTech}
                        onChange={(e) => handleChange('artsTech', e.target.value)}
                        className="w-full h-24 p-3 text-xs bg-[#F6F4EE] border border-[#4A3320]/20 rounded-none focus:outline-none focus:border-[#4A3320] transition-all resize-none shadow-none"
                      />
                    </div>
                    <div className="mt-8 mb-4 border-b border-[#4A3320]/20 pb-2">
                      <h4 className="font-serif text-xl font-bold italic text-[#4A3320]">Looking Ahead</h4>
                    </div>
                    <div>
                      <label className="block text-xs font-serif font-semibold text-[#4A3320] mb-1.5 italic">Goals for the year ahead:</label>
                      <textarea
                        value={reportData.lookingAhead}
                        onChange={(e) => handleChange('lookingAhead', e.target.value)}
                        className="w-full h-24 p-3 text-xs bg-[#F6F4EE] border border-[#4A3320]/20 rounded-none focus:outline-none focus:border-[#4A3320] transition-all resize-none shadow-none"
                      />
                    </div>
                  </>
                )}
              </>
            )}

            {activeTab !== 'general' && (() => {
              const s = students.find(s => s.id === activeTab);
              if (!s) return null;
              return (
                <div key={s.id} className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="border-b border-[#4A3320]/20 pb-2 mb-4">
                    <h4 className="font-serif text-xl font-bold italic text-[#4A3320]">{s.name}'s Profile & Interests</h4>
                  </div>
                  <div>
                    <label className="block text-xs font-serif font-semibold text-[#4A3320] mb-1.5 italic">Learning priorities this year:</label>
                    <textarea
                      value={s.priorities || ''}
                      onChange={(e) => updateStudentField(s.id, 'priorities', e.target.value)}
                      className="w-full h-24 p-3 text-xs bg-[#F6F4EE] border border-[#4A3320]/20 rounded-none focus:outline-none focus:border-[#4A3320] transition-all resize-none shadow-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-serif font-semibold text-[#4A3320] mb-1.5 italic">Interests & learning style:</label>
                    <textarea
                      value={s.interests || ''}
                      onChange={(e) => updateStudentField(s.id, 'interests', e.target.value)}
                      className="w-full h-24 p-3 text-xs bg-[#F6F4EE] border border-[#4A3320]/20 rounded-none focus:outline-none focus:border-[#4A3320] transition-all resize-none shadow-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-serif font-semibold text-[#4A3320] mb-1.5 italic">Social opportunities:</label>
                    <textarea
                      value={s.social || ''}
                      onChange={(e) => updateStudentField(s.id, 'social', e.target.value)}
                      className="w-full h-24 p-3 text-xs bg-[#F6F4EE] border border-[#4A3320]/20 rounded-none focus:outline-none focus:border-[#4A3320] transition-all resize-none shadow-none"
                    />
                  </div>
                  <div className="mt-8 mb-4 border-b border-[#4A3320]/20 pb-2">
                    <h4 className="font-serif text-xl font-bold italic text-[#4A3320]">{s.name}'s Subject Progress</h4>
                  </div>
                  <div>
                    <label className="block text-xs font-serif font-semibold text-[#4A3320] mb-1.5 italic">English & Literacy:</label>
                    <textarea
                      value={s.english || ''}
                      onChange={(e) => updateStudentField(s.id, 'english', e.target.value)}
                      className="w-full h-24 p-3 text-xs bg-[#F6F4EE] border border-[#4A3320]/20 rounded-none focus:outline-none focus:border-[#4A3320] transition-all resize-none shadow-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-serif font-semibold text-[#4A3320] mb-1.5 italic">Mathematics:</label>
                    <textarea
                      value={s.maths || ''}
                      onChange={(e) => updateStudentField(s.id, 'maths', e.target.value)}
                      className="w-full h-24 p-3 text-xs bg-[#F6F4EE] border border-[#4A3320]/20 rounded-none focus:outline-none focus:border-[#4A3320] transition-all resize-none shadow-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-serif font-semibold text-[#4A3320] mb-1.5 italic">Science & Nature:</label>
                    <textarea
                      value={s.science || ''}
                      onChange={(e) => updateStudentField(s.id, 'science', e.target.value)}
                      className="w-full h-24 p-3 text-xs bg-[#F6F4EE] border border-[#4A3320]/20 rounded-none focus:outline-none focus:border-[#4A3320] transition-all resize-none shadow-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-serif font-semibold text-[#4A3320] mb-1.5 italic">Humanities (History & Geography):</label>
                    <textarea
                      value={s.humanities || ''}
                      onChange={(e) => updateStudentField(s.id, 'humanities', e.target.value)}
                      className="w-full h-24 p-3 text-xs bg-[#F6F4EE] border border-[#4A3320]/20 rounded-none focus:outline-none focus:border-[#4A3320] transition-all resize-none shadow-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-serif font-semibold text-[#4A3320] mb-1.5 italic">Arts, Tech & Other:</label>
                    <textarea
                      value={s.artsTech || ''}
                      onChange={(e) => updateStudentField(s.id, 'artsTech', e.target.value)}
                      className="w-full h-24 p-3 text-xs bg-[#F6F4EE] border border-[#4A3320]/20 rounded-none focus:outline-none focus:border-[#4A3320] transition-all resize-none shadow-none"
                    />
                  </div>
                  <div className="mt-8 mb-4 border-b border-[#4A3320]/20 pb-2">
                    <h4 className="font-serif text-xl font-bold italic text-[#4A3320]">Looking Ahead</h4>
                  </div>
                  <div>
                    <label className="block text-xs font-serif font-semibold text-[#4A3320] mb-1.5 italic">Goals for the year ahead:</label>
                    <textarea
                      value={s.lookingAhead || ''}
                      onChange={(e) => updateStudentField(s.id, 'lookingAhead', e.target.value)}
                      className="w-full h-24 p-3 text-xs bg-[#F6F4EE] border border-[#4A3320]/20 rounded-none focus:outline-none focus:border-[#4A3320] transition-all resize-none shadow-none"
                    />
                  </div>
                </div>
              );
            })()}
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="card p-5 bg-[#F6F4EE] sticky top-6 flex flex-col h-[600px] border border-[#4A3320]/20 rounded-none">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#4A3320]/20">
              <h3 className="font-serif font-semibold text-base text-[#4A3320] flex items-center gap-2">
                <Eye className="w-4 h-4 text-[#4A3320]" /> Formatted Report Text Preview
              </h3>
              <button
                onClick={copyCompiledReport}
                className="text-xs bg-[#4A3320] text-white px-3 py-1.5 rounded-none font-medium hover:bg-[#6A7152] flex items-center gap-1 transition-all"
                title="Copy to Clipboard"
              >
                <Copy className="w-3 h-3" /> Copy
              </button>
              <button
                onClick={() => {
                  const blob = new Blob([generateReportText()], { type: 'text/plain' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'LA_Report_Draft.txt';
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                className="text-xs border border-[#4A3320] text-[#4A3320] bg-transparent px-3 py-1.5 rounded-none font-medium hover:bg-[#4A3320]/10 flex items-center gap-1 transition-all ml-2"
                title="Export as Text File"
              >
                <Download className="w-3 h-3" /> Export
              </button>
            </div>
            <div className="text-xs text-[#4A3320]/80 space-y-4 overflow-y-auto flex-1 pr-1 bg-transparent p-5 border border-[#4A3320]/20 rounded-none font-mono leading-relaxed shadow-none whitespace-pre-wrap">
              {generateReportText()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
