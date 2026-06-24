export type TabState = 'dashboard' | 'students' | 'planner' | 'resources' | 'reports' | 'analytics' | 'settings' | 'wellbeing';

export interface Task {
  id: string;
  text: string;
  done: boolean;
}

export interface Student {
  id: string;
  name: string;
  grade: string;
  focuses: string[];
  progress: number;
  priorities?: string;
  interests?: string;
  social?: string;
  english?: string;
  maths?: string;
  science?: string;
  humanities?: string;
  artsTech?: string;
  lookingAhead?: string;
}

export interface WellbeingEntry {
  id: string;
  studentId: string;
  date: string;
  feeling: string;
  goingWell: string;
  challenging: string;
  help: string;
}

export interface HourlyLogs {
  [dateIso: string]: {
    [hour: string]: string;
  };
}

export interface LogEntry {
  id: string;
  category: 'Reading Log' | 'Resource Library' | 'Activities Log';
  field1: string;
  field2: string;
  field3: string;
  studentIds?: string[];
}

export interface BudgetItem {
  id: string;
  item: string;
  category: 'Resources' | 'Activities' | 'Outings' | 'Transport' | 'Exams';
  cost: number;
}

export interface Settings {
  educatorName: string;
  familyName: string;
}

export interface ReportData {
  philosophy: string;
  stages: string;
  priorities: string;
  resources: string;
  interests: string;
  social: string;
  english: string;
  maths: string;
  science: string;
  humanities: string;
  artsTech: string;
  lookingAhead: string;
}

export type DailyTasks = Record<string, Task[]>;
export type DailyNotes = Record<string, string>;
