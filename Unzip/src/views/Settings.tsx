import React from 'react';
import { useAppData } from '../context/AppDataContext';
import { Download, AlertTriangle, Printer } from 'lucide-react';

export default function Settings() {
  const { settings, setSettings, wipeData, exportData, exportPDF } = useAppData();

  return (
    <div className="animate-in fade-in duration-300">
      <div className="mb-6">
        <h2 className="font-serif text-2xl font-bold text-[#4A3320]">Settings & Tools</h2>
        <p className="text-xs text-[#4A3320]/70">Adjust names or safely reset the dashboard data.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="card p-5 space-y-4 rounded-none border border-[#4A3320]/20 bg-[#F6F4EE] shadow-none">
            <h3 className="font-serif font-bold text-base text-[#4A3320] border-b border-[#4A3320]/20 pb-2">Your Dashboard Profile</h3>
            <div>
              <label className="block text-xs uppercase font-semibold text-[#4A3320]/40 mb-1">Educator Name</label>
              <input
                type="text"
                value={settings.educatorName}
                onChange={(e) => setSettings({ ...settings, educatorName: e.target.value })}
                className="w-full border border-[#4A3320]/20 rounded-none px-3 py-2 text-xs focus:outline-none focus:border-[#4A3320]"
              />
            </div>
            <div>
              <label className="block text-xs uppercase font-semibold text-[#4A3320]/40 mb-1">Family Title</label>
              <input
                type="text"
                value={settings.familyName}
                onChange={(e) => setSettings({ ...settings, familyName: e.target.value })}
                className="w-full border border-[#4A3320]/20 rounded-none px-3 py-2 text-xs focus:outline-none focus:border-[#4A3320]"
              />
            </div>
          </div>

          <div className="card p-5 space-y-3 flex flex-col justify-between rounded-none shadow-none border border-[#4A3320]/20 bg-[#F6F4EE]">
            <div>
              <h3 className="font-serif font-bold text-base text-[#4A3320] flex items-center gap-2">Data Backup</h3>
              <p className="text-xs text-[#4A3320]/70 leading-normal mt-1">Download all your records, daily logs, wellbeing entries, and student profiles to keep them safe.</p>
            </div>
            <div className="flex flex-col gap-2 mt-4">
              <button
                onClick={exportPDF}
                className="w-full py-2 bg-[#4A3320] hover:bg-[#6A7152] text-white font-medium text-xs rounded-none transition-colors shadow-none flex items-center justify-center gap-2"
              >
                <Printer className="w-4 h-4" /> Print / Save as PDF
              </button>
              <button
                onClick={exportData}
                className="w-full py-2 bg-transparent border border-[#4A3320] hover:bg-[#4A3320]/10 text-[#4A3320] font-medium text-xs rounded-none transition-colors shadow-none flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" /> Export All Data (Text)
              </button>
            </div>
          </div>
        </div>

        <div className="card p-5 border-red-200 bg-red-50/20 space-y-3 flex flex-col justify-start rounded-none shadow-none border">
          <div className="flex items-center gap-2 border-b border-red-200 pb-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <h3 className="font-serif font-bold text-base text-red-800">Danger Zone</h3>
          </div>
          <div>
            <h4 className="font-serif font-bold text-sm text-red-800">Clear Saved Dashboard Data</h4>
            <p className="text-xs text-[#4A3320]/70 leading-normal mt-1">Wipe all custom tracking logs, student profiles, wellbeing entries, and notes to completely restore the default application workspace. This cannot be undone.</p>
          </div>
          <button
            onClick={() => {
              if (window.confirm('Wipe all data and reset dashboard settings permanently? This action cannot be undone.')) {
                wipeData();
              }
            }}
            className="w-full py-2 mt-auto bg-red-600 hover:bg-red-700 text-white font-medium text-xs rounded-none transition-colors shadow-none"
          >
            Reset Dashboard Workspace
          </button>
        </div>
      </div>
    </div>
  );
}
