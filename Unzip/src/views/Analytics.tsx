import React from 'react';
import { useAppData } from '../context/AppDataContext';
import { Plus, X } from 'lucide-react';
import { generateId } from '../utils';
import { BudgetItem } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#6A7152', '#C25934', '#EAB242', '#D8B47E', '#4A3320', '#889072', '#B97D60'];

export default function Analytics() {
  const { students, logEntries, hourlyLogs, budgetItems, setBudgetItems } = useAppData();

  const addBudgetItemRow = () => {
    setBudgetItems(prev => [...prev, { id: generateId(), item: '', category: 'Resources', cost: 0 }]);
  };

  const updateBudgetItem = (id: string, field: keyof BudgetItem, val: string | number) => {
    setBudgetItems(prev => prev.map(b => b.id === id ? { ...b, [field]: field === 'cost' ? (parseFloat(val as string) || 0) : val } : b));
  };

  const deleteBudgetItemRow = (id: string) => {
    setBudgetItems(prev => prev.filter(b => b.id !== id));
  };

  const studentData = students.length ? students.map((s, idx) => ({ name: s.name || `Student ${idx + 1}`, progress: s.progress })) : [{ name: 'No Profiles', progress: 0 }];
  
  let statusCounts = { "Not Started": 0, "In Progress": 0, "Completed": 0, "On Hold": 0 };
  logEntries.forEach(r => { 
    const f3 = r.field3 as keyof typeof statusCounts;
    if (statusCounts[f3] !== undefined) statusCounts[f3]++; 
  });
  const libraryData = Object.keys(statusCounts).map((key, i) => ({ name: key, value: Object.values(statusCounts)[i] }));

  let financialMap = { "Resources": 0, "Activities": 0, "Outings": 0, "Transport": 0, "Exams": 0, "Tutoring": 0, "Technology": 0, "Other items": 0, "Special interests": 0 };
  let ledgerTotalSum = 0;
  budgetItems.forEach(b => { 
    if (financialMap[b.category] !== undefined) { 
      financialMap[b.category] += b.cost; 
      ledgerTotalSum += b.cost; 
    } 
  });
  const budgetData = Object.keys(financialMap).map(key => ({ name: key, cost: financialMap[key as keyof typeof financialMap] }));

  let subjectHoursMap = { "Mathematics": 0, "English Literacy": 0, "Science": 0, "History/Geography": 0, "Creative Arts": 0, "Physical Ed": 0 };
  Object.values(hourlyLogs).forEach(dayLog => {
    Object.values(dayLog).forEach(text => {
      const check = text.toLowerCase();
      if (check.includes('math') || check.includes('fraction')) subjectHoursMap["Mathematics"]++;
      else if (check.includes('literacy') || check.includes('english') || check.includes('read')) subjectHoursMap["English Literacy"]++;
      else if (check.includes('science') || check.includes('nature') || check.includes('astronomy')) subjectHoursMap["Science"]++;
      else if (check.includes('history') || check.includes('geography')) subjectHoursMap["History/Geography"]++;
      else if (check.includes('art') || check.includes('craft') || check.includes('write')) subjectHoursMap["Creative Arts"]++;
      else if (check.includes('swim') || check.includes('tennis') || check.includes('sport')) subjectHoursMap["Physical Ed"]++;
    });
  });
  const hoursData = Object.keys(subjectHoursMap).map(key => ({ name: key, hours: subjectHoursMap[key as keyof typeof subjectHoursMap] }));

  return (
    <div className="animate-in fade-in duration-300">
      <h2 className="font-serif text-2xl font-bold mb-6 text-[#4A3320]">Dashboard Analytics & Expenses</h2>
      
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="card p-6 flex flex-col items-center h-[380px] rounded-none border border-[#4A3320]/20 bg-[#F6F4EE] shadow-none">
          <h3 className="font-serif font-semibold text-base mb-4 text-[#4A3320] self-start">Learner Focus Progress (%)</h3>
          <div className="w-full h-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={studentData} margin={{ top: 10, right: 10, left: -20, bottom: 30 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(26,26,26,0.1)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#4A443C' }} />
                <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#4A443C' }} />
                <Tooltip cursor={{ fill: '#FAF8F5' }} contentStyle={{ border: '1px solid rgba(26,26,26,0.2)', borderRadius: '0', backgroundColor: '#F6F4EE' }} />
                <Bar dataKey="progress" radius={[6, 6, 0, 0]}>
                  {studentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="card p-6 flex flex-col items-center h-[380px] rounded-none border border-[#4A3320]/20 bg-[#F6F4EE] shadow-none">
          <h3 className="font-serif font-semibold text-base mb-4 text-[#4A3320] self-start">Library Inventory Metrics</h3>
          <div className="w-full h-full relative max-w-[260px] mx-auto">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={libraryData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={2} dataKey="value">
                  {libraryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ border: '1px solid rgba(26,26,26,0.2)', borderRadius: '0', backgroundColor: '#F6F4EE' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap justify-center gap-3 mt-4">
            {libraryData.map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-1.5 text-xs text-[#4A3320]/80">
                <div className="w-2.5 h-2.5 rounded-none" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                {entry.name}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="card p-6 flex flex-col items-center h-[380px] rounded-none border border-[#4A3320]/20 bg-[#F6F4EE] shadow-none">
          <h3 className="font-serif font-semibold text-base mb-4 text-[#4A3320] self-start">Hours Shared Across Topics</h3>
          <div className="w-full h-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hoursData} margin={{ top: 10, right: 10, left: -20, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(26,26,26,0.1)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#4A443C' }} interval={0} angle={-30} textAnchor="end" />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#4A443C' }} allowDecimals={false} />
                <Tooltip cursor={{ fill: '#FAF8F5' }} contentStyle={{ border: '1px solid rgba(26,26,26,0.2)', borderRadius: '0', backgroundColor: '#F6F4EE' }} />
                <Bar dataKey="hours" radius={[6, 6, 0, 0]}>
                  {hoursData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[(index + 1) % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card p-6 flex flex-col items-center h-[380px] rounded-none border border-[#4A3320]/20 bg-[#F6F4EE] shadow-none">
          <div className="flex items-center justify-between w-full mb-4">
            <h3 className="font-serif font-semibold text-base text-[#4A3320]">Budget Spending Split</h3>
            <span className="text-xs font-semibold bg-[#4A3320]/10 text-[#4A3320] px-2.5 py-1 rounded-none">Total: £{ledgerTotalSum.toFixed(2)}</span>
          </div>
          <div className="w-full h-full relative text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={budgetData} layout="vertical" margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(26,26,26,0.1)" />
                <XAxis type="number" axisLine={false} tickLine={false} />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} width={80} interval={0} tick={{ fontSize: 10, fill: '#4A443C' }} />
                <Tooltip cursor={{ fill: '#FAF8F5' }} contentStyle={{ border: '1px solid rgba(26,26,26,0.2)', borderRadius: '0', backgroundColor: '#F6F4EE' }} />
                <Bar dataKey="cost" radius={[0, 4, 4, 0]}>
                  {budgetData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[(index + 3) % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="card p-5 flex flex-col mt-6 rounded-none border border-[#4A3320]/20 bg-[#F6F4EE] shadow-none">
        <div className="flex items-center justify-between border-b border-[#4A3320]/20 pb-3 mb-4">
          <div>
            <h3 className="font-serif font-bold text-base text-[#4A3320]">Budget Ledger Items</h3>
            <p className="text-xs text-[#4A3320]/40">Log expenditures across lines matching pages 9 and 10 of your printed workbook.</p>
          </div>
          <button
            onClick={addBudgetItemRow}
            className="flex items-center gap-1 px-3 py-1.5 bg-[#4A3320] text-white rounded-none text-xs font-medium hover:bg-black transition-all"
          >
            <Plus className="w-3.5 h-3.5" /> Add Budget Entry
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wider text-[#4A3320]/40 border-b border-[#4A3320]/10">
                <th className="pb-2 font-semibold px-2">Expense Description</th>
                <th className="pb-2 font-semibold w-40 px-2">Budget Category</th>
                <th className="pb-2 font-semibold w-32 px-2">Cost (£)</th>
                <th className="pb-2 w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {budgetItems.map(item => (
                <tr key={item.id} className="border-b border-[#4A3320]/10 hover:bg-[#4A3320]/5/40 transition-colors">
                  <td className="py-2 px-2">
                    <input
                      type="text"
                      className="w-full bg-transparent border-none outline-none focus:border-b border-[#4A3320] font-medium text-[#4A3320] py-1"
                      value={item.item}
                      onChange={(e) => updateBudgetItem(item.id, 'item', e.target.value)}
                      placeholder="e.g. Science Stationery packs"
                    />
                  </td>
                  <td className="py-2 px-2">
                    <select
                      className="text-xs bg-[#F6F4EE] border border-[#4A3320]/20 rounded-none px-2.5 py-1 text-[#4A3320]/90 cursor-pointer outline-none focus:border-[#4A3320]"
                      value={item.category}
                      onChange={(e) => updateBudgetItem(item.id, 'category', e.target.value)}
                    >
                      <option value="Resources">Resources & Stationery</option>
                      <option value="Activities">Activities & Classes</option>
                      <option value="Outings">Outings & Trips</option>
                      <option value="Transport">Transport</option>
                      <option value="Exams">Exams</option>
                      <option value="Tutoring">Tutoring</option>
                      <option value="Technology">Technology</option>
                      <option value="Other items">Other items</option>
                      <option value="Special interests">Special interests</option>
                    </select>
                  </td>
                  <td className="py-2 px-2">
                    <input
                      type="number"
                      step="0.01"
                      className="w-full bg-transparent border-none outline-none focus:border-b border-[#4A3320] font-mono text-[#4A3320] py-1"
                      value={item.cost === 0 ? '' : item.cost}
                      onChange={(e) => updateBudgetItem(item.id, 'cost', e.target.value)}
                      placeholder="0.00"
                    />
                  </td>
                  <td className="py-2 px-2 text-right">
                    <button onClick={() => deleteBudgetItemRow(item.id)} className="text-[#4A3320]/30 hover:text-red-500 transition-colors">
                      <X className="w-4 h-4 inline" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
