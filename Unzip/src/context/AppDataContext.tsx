import React, { createContext, useContext, ReactNode } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Task, Student, HourlyLogs, LogEntry, BudgetItem, Settings, ReportData, WellbeingEntry } from '../types';

interface AppDataContextType {
  settings: Settings;
  setSettings: (settings: Settings) => void;
  tasks: Task[];
  setTasks: (tasks: Task[] | ((prev: Task[]) => Task[])) => void;
  dailyTasks: Record<string, Task[]>;
  setDailyTasks: (tasks: Record<string, Task[]> | ((prev: Record<string, Task[]>) => Record<string, Task[]>)) => void;
  dailyNotes: string;
  setDailyNotes: (notes: string) => void;
  dailyNotesMap: Record<string, string>;
  setDailyNotesMap: (notes: Record<string, string> | ((prev: Record<string, string>) => Record<string, string>)) => void;
  students: Student[];
  setStudents: (students: Student[] | ((prev: Student[]) => Student[])) => void;
  hourlyLogs: HourlyLogs;
  setHourlyLogs: (logs: HourlyLogs | ((prev: HourlyLogs) => HourlyLogs)) => void;
  logEntries: LogEntry[];
  setLogEntries: (entries: LogEntry[] | ((prev: LogEntry[]) => LogEntry[])) => void;
  reportData: ReportData;
  setReportData: (data: ReportData | ((prev: ReportData) => ReportData)) => void;
  budgetItems: BudgetItem[];
  setBudgetItems: (items: BudgetItem[] | ((prev: BudgetItem[]) => BudgetItem[])) => void;
  wellbeingEntries: WellbeingEntry[];
  setWellbeingEntries: (entries: WellbeingEntry[] | ((prev: WellbeingEntry[]) => WellbeingEntry[])) => void;
  wipeData: () => void;
  exportData: () => void;
  exportPDF: () => void;
  exportJSON: () => void;
  importJSON: (jsonData: string) => void;
}

const AppDataContext = createContext<AppDataContextType | undefined>(undefined);

const initialTasks: Task[] = [
  { id: '1', text: 'Complete reading logs session review', done: true },
  { id: '2', text: 'Prepare documentation criteria for the Local Authority Report', done: false }
];

const initialStudents: Student[] = [
  { id: 's1', name: 'Mason', grade: 'Age 8 / Key Stage 2', focuses: ['Fractions', 'Creative Writing', 'Tennis'], progress: 65 },
  { id: 's2', name: 'Hope', grade: 'Age 6 / Key Stage 1', focuses: ['Phonics', 'Handwriting', 'Swimming'], progress: 40 }
];

const initialHourlyLogs: HourlyLogs = {
  [new Date().toISOString().split('T')[0]]: {
    "09:00 AM": "Mathematics: Fraction Modules Workbook",
    "11:00 AM": "Literature Reading Log & Reflection Review",
    "02:00 PM": "Science Excursion: Local Nature Preserve Field Study"
  }
};

const initialLogEntries: LogEntry[] = [
  { id: 'l1', category: 'Reading Log', field1: 'The Secret Garden', field2: 'Frances Hodgson Burnett', field3: 'Completed' },
  { id: 'l2', category: 'Resource Library', field1: 'Target Literacy Workbook Level 2', field2: 'Core English Modules', field3: 'In Progress' },
  { id: 'l3', category: 'Activities Log', field1: 'Science Museum Outing', field2: 'Astronomy Workshop', field3: 'Completed' }
];

const initialBudgetItems: BudgetItem[] = [
  { id: 'b1', item: 'Curriculum Workbook Packs', category: 'Resources', cost: 75.00 },
  { id: 'b2', item: 'Forest School Weekly Classes', category: 'Activities', cost: 140.00 },
  { id: 'b3', item: 'Museum Entry Admissions', category: 'Outings', cost: 45.00 }
];

export const AppDataProvider = ({ children }: { children: ReactNode }) => {
  const [dailyTasks, setDailyTasks] = useLocalStorage<Record<string, Task[]>>('mh_clean_v4_daily_tasks', {});
  const [dailyNotesMap, setDailyNotesMap] = useLocalStorage<Record<string, string>>('mh_clean_v4_daily_notes_map', {});
  const [settings, setSettings] = useLocalStorage<Settings>('mh_clean_v3_settings', {
    educatorName: 'Educator',
    familyName: 'Mason & Hope'
  });
  const [tasks, setTasks] = useLocalStorage<Task[]>('mh_clean_v3_tasks', initialTasks);
  const [dailyNotes, setDailyNotes] = useLocalStorage<string>('mh_clean_v3_daily_notes', '');
  const [students, setStudents] = useLocalStorage<Student[]>('mh_clean_v3_students', initialStudents);
  const [hourlyLogs, setHourlyLogs] = useLocalStorage<HourlyLogs>('mh_clean_v3_hourly_logs', initialHourlyLogs);
  const [logEntries, setLogEntries] = useLocalStorage<LogEntry[]>('mh_clean_v3_log_entries', initialLogEntries);
  const [reportData, setReportData] = useLocalStorage<ReportData>('mh_clean_v4_report', {
    philosophy: '', stages: '', priorities: '', resources: '',
    interests: '', social: '', english: '', maths: '', science: '', humanities: '', artsTech: '', lookingAhead: ''
  });
  const [budgetItems, setBudgetItems] = useLocalStorage<BudgetItem[]>('mh_clean_v3_budget', initialBudgetItems);
  const [wellbeingEntries, setWellbeingEntries] = useLocalStorage<WellbeingEntry[]>('mh_clean_v4_wellbeing', []);

  const wipeData = () => {
    localStorage.clear();
    window.location.reload();
  };

  const exportData = () => {
    let output = `=========================================\n`;
    output += `       HOME EDUCATION RECORD BACKUP      \n`;
    output += `=========================================\n\n`;
    output += `Date Generated: ${new Date().toLocaleDateString()}\n`;
    output += `Educator: ${settings.educatorName || 'N/A'}\n`;
    output += `Family Title: ${settings.familyName || 'N/A'}\n\n`;

    output += `\n--- LEARNER PROFILES ---\n`;
    if (students.length === 0) output += `No learners added.\n`;
    students.forEach(s => {
      output += `• ${s.name} (Grade: ${s.grade || 'N/A'})\n`;
      if (s.focuses && s.focuses.length > 0) {
        output += `  Focuses: ${s.focuses.join(', ')}\n`;
      }
      if (s.priorities) {
        output += `  Core Priorities: ${s.priorities}\n`;
      }
      if (s.interests) {
        output += `  Interests: ${s.interests}\n`;
      }
    });
    output += `\n`;

    output += `--- TASKS & TODOS ---\n`;
    if (tasks.length === 0) output += `No general tasks.\n`;
    tasks.forEach(t => {
      output += `[${t.completed ? 'X' : ' '}] ${t.text}\n`;
    });
    output += `\n`;

    output += `--- DAILY LOGS & LIBRARY ---\n`;
    if (logEntries.length === 0) output += `No logs added.\n`;
    [...logEntries].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).forEach(l => {
      output += `\nDate: ${new Date(l.date).toLocaleDateString()}\n`;
      output += `Subjects: ${l.subjects?.join(', ') || 'None'}\n`;
      output += `Notes:\n${l.notes || 'No notes'}\n`;
    });
    output += `\n`;

    output += `--- WELLBEING JOURNAL ---\n`;
    if (wellbeingEntries.length === 0) output += `No wellbeing entries.\n`;
    [...wellbeingEntries].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).forEach(w => {
      const student = students.find(s => s.id === w.studentId);
      output += `\nDate: ${new Date(w.date).toLocaleDateString()} - Learner: ${student?.name || 'Unknown'}\n`;
      if (w.feeling) output += `  Feeling: ${w.feeling}\n`;
      if (w.goingWell) output += `  Going Well:\n    ${w.goingWell}\n`;
      if (w.challenging) output += `  Challenging:\n    ${w.challenging}\n`;
      if (w.help) output += `  What would help:\n    ${w.help}\n`;
    });
    output += `\n`;

    output += `--- BUDGET & RESOURCES ---\n`;
    if (budgetItems.length === 0) output += `No budget items.\n`;
    let spent = 0;
    budgetItems.forEach(b => {
      output += `• ${b.item} (${b.category}) - £${(b.cost || 0).toFixed(2)}\n`;
      spent += (b.cost || 0);
    });
    if (budgetItems.length > 0) {
      output += `\nTotal Spent: £${spent.toFixed(2)}\n`;
    }

    output += `\n=========================================\n`;
    output += `END OF REPORT\n`;
    output += `=========================================\n`;

    const blob = new Blob([output], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `HomeEd_Backup_${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportPDF = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert("Please allow popups to generate the PDF.");
      return;
    }

    let html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Home Education Record - ${new Date().toISOString().split('T')[0]}</title>
        <style>
          body { font-family: 'Georgia', serif; line-height: 1.6; color: #2c1e13; padding: 40px; max-width: 800px; margin: 0 auto; }
          h1 { border-bottom: 2px solid #4A3320; padding-bottom: 10px; color: #4A3320; font-size: 24px; }
          h2 { color: #4A3320; margin-top: 30px; border-bottom: 1px solid #4A3320; padding-bottom: 5px; font-size: 18px; text-transform: uppercase; letter-spacing: 1px; }
          h3 { color: #4A3320; margin-bottom: 5px; font-size: 16px; margin-top: 20px; }
          p { margin: 5px 0; font-family: 'Inter', system-ui, sans-serif; font-size: 14px; }
          .section { margin-bottom: 30px; }
          .item { margin-bottom: 20px; padding-left: 15px; border-left: 3px solid #4A332020; }
          .bold { font-weight: bold; }
          ul { margin-top: 5px; font-family: 'Inter', system-ui, sans-serif; font-size: 14px; padding-left: 20px; }
          li { margin-bottom: 5px; }
          @media print {
            body { padding: 0; }
            @page { margin: 2cm; }
          }
        </style>
      </head>
      <body>
        <h1>Home Education Record</h1>
        <p><span class="bold">Date Generated:</span> ${new Date().toLocaleDateString()}</p>
        <p><span class="bold">Educator:</span> ${settings.educatorName || 'N/A'}</p>
        <p><span class="bold">Family Title:</span> ${settings.familyName || 'N/A'}</p>
        
        <div class="section">
          <h2>Learner Profiles</h2>
    `;

    if (students.length === 0) html += `<p>No learners added.</p>`;
    students.forEach(s => {
      html += `<div class="item">
        <h3>${s.name} (Grade: ${s.grade || 'N/A'})</h3>`;
      if (s.focuses && s.focuses.length > 0) {
        html += `<p><span class="bold">Focuses:</span> ${s.focuses.join(', ')}</p>`;
      }
      if (s.priorities) {
        html += `<p><span class="bold">Core Priorities:</span> ${s.priorities}</p>`;
      }
      if (s.interests) {
        html += `<p><span class="bold">Interests:</span> ${s.interests}</p>`;
      }
      html += `</div>`;
    });
    html += `</div>`;

    html += `<div class="section"><h2>Tasks & Todos (General)</h2><ul>`;
    if (tasks.length === 0) html += `<li>No general tasks.</li>`;
    tasks.forEach(t => {
      html += `<li>[${t.completed ? 'X' : '&nbsp;&nbsp;'}] ${t.text}</li>`;
    });
    html += `</ul></div>`;

    html += `<div class="section"><h2>Daily Logs & Activity</h2>`;
    if (logEntries.length === 0) html += `<p>No logs added.</p>`;
    [...logEntries].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).forEach(l => {
      html += `<div class="item">
        <p><span class="bold">Date:</span> ${new Date(l.date).toLocaleDateString()}</p>
        <p><span class="bold">Subjects:</span> ${l.subjects?.join(', ') || 'None'}</p>
        <p><span class="bold">Notes:</span><br/>${(l.notes || 'No notes').replace(/\n/g, '<br/>')}</p>
      </div>`;
    });
    html += `</div>`;

    html += `<div class="section"><h2>Wellbeing Journal</h2>`;
    if (wellbeingEntries.length === 0) html += `<p>No wellbeing entries.</p>`;
    [...wellbeingEntries].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).forEach(w => {
      const student = students.find(s => s.id === w.studentId);
      html += `<div class="item">
        <p><span class="bold">Date:</span> ${new Date(w.date).toLocaleDateString()} - <span class="bold">Learner:</span> ${student?.name || 'Unknown'}</p>`;
      if (w.feeling) html += `<p><span class="bold">Feeling:</span> ${w.feeling}</p>`;
      if (w.goingWell) html += `<p><span class="bold">Going Well:</span><br/>${w.goingWell.replace(/\n/g, '<br/>')}</p>`;
      if (w.challenging) html += `<p><span class="bold">Challenging:</span><br/>${w.challenging.replace(/\n/g, '<br/>')}</p>`;
      if (w.help) html += `<p><span class="bold">What would help:</span><br/>${w.help.replace(/\n/g, '<br/>')}</p>`;
      html += `</div>`;
    });
    html += `</div>`;

    html += `<div class="section"><h2>Budget & Resources</h2><ul>`;
    if (budgetItems.length === 0) html += `<li>No budget items.</li>`;
    let spent = 0;
    budgetItems.forEach(b => {
      html += `<li>${new Date(b.date).toLocaleDateString()}: ${b.item} (${b.category}) - &pound;${(b.cost || 0).toFixed(2)}</li>`;
      spent += (b.cost || 0);
    });
    if (budgetItems.length > 0) {
      html += `</ul><p class="bold" style="margin-top: 15px; font-size: 16px;">Total Spent: &pound;${spent.toFixed(2)}</p>`;
    } else {
      html += `</ul>`;
    }
    html += `</div>`;

    html += `
        <script>
          window.onload = () => {
            setTimeout(() => {
              window.print();
            }, 500);
          };
        </script>
      </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
  };

  const exportJSON = () => {
    const data = {
      settings,
      tasks,
      dailyTasks,
      dailyNotes,
      dailyNotesMap,
      students,
      hourlyLogs,
      logEntries,
      reportData,
      budgetItems,
      wellbeingEntries
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `HomeEd_Backup_Data_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importJSON = (jsonData: string) => {
    try {
      const parsed = JSON.parse(jsonData);
      if (parsed.settings) setSettings(parsed.settings);
      if (parsed.tasks) setTasks(parsed.tasks);
      if (parsed.dailyTasks) setDailyTasks(parsed.dailyTasks);
      if (parsed.dailyNotes !== undefined) setDailyNotes(parsed.dailyNotes);
      if (parsed.dailyNotesMap) setDailyNotesMap(parsed.dailyNotesMap);
      if (parsed.students) setStudents(parsed.students);
      if (parsed.hourlyLogs) setHourlyLogs(parsed.hourlyLogs);
      if (parsed.logEntries) setLogEntries(parsed.logEntries);
      if (parsed.reportData) setReportData(parsed.reportData);
      if (parsed.budgetItems) setBudgetItems(parsed.budgetItems);
      if (parsed.wellbeingEntries) setWellbeingEntries(parsed.wellbeingEntries);
      alert('Data imported successfully! The page will now reload to apply changes.');
      window.location.reload();
    } catch (e) {
      alert('Failed to import data. Please ensure the file is a valid JSON backup.');
      console.error(e);
    }
  };

  return (
    <AppDataContext.Provider value={{
      settings, setSettings, tasks, setTasks, dailyTasks, setDailyTasks, dailyNotes, setDailyNotes, dailyNotesMap, setDailyNotesMap,
      students, setStudents, hourlyLogs, setHourlyLogs, logEntries, setLogEntries,
      reportData, setReportData, budgetItems, setBudgetItems, wellbeingEntries, setWellbeingEntries, wipeData, exportData, exportPDF, exportJSON, importJSON
    }}>
      {children}
    </AppDataContext.Provider>
  );
};

export const useAppData = () => {
  const context = useContext(AppDataContext);
  if (context === undefined) {
    throw new Error('useAppData must be used within an AppDataProvider');
  }
  return context;
};
