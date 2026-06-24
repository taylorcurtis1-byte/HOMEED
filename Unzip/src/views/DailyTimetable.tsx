import React, { useState } from 'react';
import { useAppData } from '../context/AppDataContext';
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, isSameMonth, isSameDay, addDays, parseISO } from 'date-fns';

export default function DailyTimetable() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDateISO, setSelectedDateISO] = useState(new Date().toISOString().split('T')[0]);
  const { hourlyLogs, setHourlyLogs } = useAppData();

  const navigateMonth = (dir: number) => {
    setCurrentDate(dir > 0 ? addMonths(currentDate, 1) : subMonths(currentDate, 1));
  };

  const jumpToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDateISO(today.toISOString().split('T')[0]);
  };

  const hoursArray = ["08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM", "06:00 PM"];

  const updateLog = (hour: string, val: string) => {
    setHourlyLogs(prev => {
      const dayLogs = prev[selectedDateISO] ? { ...prev[selectedDateISO] } : {};
      if (!val.trim()) {
        delete dayLogs[hour];
      } else {
        dayLogs[hour] = val;
      }
      return { ...prev, [selectedDateISO]: dayLogs };
    });
  };

  const renderCalendar = () => {
    const startMonth = startOfMonth(currentDate);
    const endMonth = endOfMonth(startMonth);
    const startDate = startOfWeek(startMonth);
    const endDate = endOfWeek(endMonth);
    const dateFormat = "d";
    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = "";
    
    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, dateFormat);
        const cloneDayString = day.toISOString().split('T')[0];
        const isCurrentMonth = isSameMonth(day, startMonth);
        const isToday = isSameDay(day, new Date());
        const isSelected = cloneDayString === selectedDateISO;
        
        const hasLogs = hourlyLogs[cloneDayString] && Object.values(hourlyLogs[cloneDayString]).some((v: string) => v.trim() !== '');

        days.push(
          <div
            key={day.toString()}
            onClick={() => isCurrentMonth && setSelectedDateISO(cloneDayString)}
            className={`
              aspect-square min-h-[50px] flex flex-col justify-between items-center p-1.5 rounded-none transition-all relative
              ${!isCurrentMonth ? 'opacity-0 pointer-events-none' : 'cursor-pointer hover:bg-[#4A3320]/10 bg-[#F6F4EE] border border-[#4A3320]/20 shadow-none'}
              ${isToday ? 'bg-[#4A3320] text-white font-bold border-none hover:bg-[#4A3320]' : ''}
              ${isSelected && !isToday ? 'border-2 border-[#4A3320]/60' : ''}
            `}
          >
            <span className="text-xs font-semibold">{formattedDate}</span>
            {hasLogs && isCurrentMonth && (
              <div className={`w-1.5 h-1.5 rounded-none mt-1 ${isToday ? 'bg-[#F6F4EE]' : 'bg-[#D46A43]'}`}></div>
            )}
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(<div className="grid grid-cols-7 gap-2 mb-2" key={day.toString()}>{days}</div>);
      days = [];
    }
    return rows;
  };

  return (
    <div className="animate-in fade-in duration-300">
      <div className="mb-6">
        <h2 className="font-serif text-2xl font-bold text-[#4A3320]">Daily Timetable & Schedule</h2>
        <p className="text-xs text-[#4A3320]/70">Select a date from the calendar to plan or record your day hour-by-hour.</p>
      </div>

      <div className="grid lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6 card p-6 h-fit rounded-none border border-[#4A3320]/20 bg-[#F6F4EE] shadow-none">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-serif font-bold text-xl text-[#4A3320]">{format(currentDate, "MMMM yyyy")}</h3>
            <div className="flex items-center gap-1">
              <button onClick={() => navigateMonth(-1)} className="p-2 border border-[#4A3320]/20 rounded-none hover:bg-[#4A3320]/5 transition-all text-[#4A3320]/80">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button onClick={jumpToToday} className="px-3 py-1.5 border border-[#4A3320]/20 rounded-none text-xs font-semibold hover:bg-[#4A3320]/5 transition-all text-[#4A3320]/80">
                Today
              </button>
              <button onClick={() => navigateMonth(1)} className="p-2 border border-[#4A3320]/20 rounded-none hover:bg-[#4A3320]/5 transition-all text-[#4A3320]/80">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold uppercase tracking-wider text-[#4A3320]/40 mb-2">
            <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
          </div>
          {renderCalendar()}
        </div>

        <div className="lg:col-span-6 flex flex-col gap-4">
          <div className="card p-5 bg-transparent border border-[#4A3320]/20 flex flex-col h-[600px] rounded-none">
            <div className="pb-3 border-b border-[#4A3320]/20 mb-4 flex items-center justify-between">
              <div>
                <span className="text-xs uppercase font-bold tracking-wider text-[#4A3320]">Hourly Schedule</span>
                <h4 className="font-serif font-bold text-lg text-[#4A3320] mt-0.5">
                  {format(parseISO(selectedDateISO), "d MMMM yyyy")}
                </h4>
              </div>
              <Clock className="w-5 h-5 text-[#4A3320]/40" />
            </div>

            <div className="flex-1 overflow-y-auto pr-1 space-y-3 relative">
              {hoursArray.map(hour => {
                const dayLogs = hourlyLogs[selectedDateISO] || {};
                const currentVal = dayLogs[hour] || '';
                return (
                  <div key={hour} className="bg-[#F6F4EE] p-2.5 border border-[#4A3320]/20 rounded-none flex items-center gap-3 shadow-none">
                    <span className="text-xs font-bold text-[#4A3320]/40 w-16 text-right select-none">{hour}</span>
                    <div className="w-px h-6 bg-gray-200"></div>
                    <input
                      type="text"
                      className="flex-1 bg-transparent text-xs text-[#4A3320] outline-none placeholder-gray-300 focus:text-[#4A3320]"
                      placeholder="Enter topics, lessons, or resources used..."
                      value={currentVal}
                      onChange={(e) => updateLog(hour, e.target.value)}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
