import { useState, useEffect, useRef } from 'react';
import { formatDate } from '../utils/dateUtils';
import { getWeekByNumber, getCurrentWeekNumber } from '../data/readingPlan';
import type { WeeklyReading } from '../data/readingPlan';

interface PrintScheduleProps {
  onClose: () => void;
}

// Get today's date by using the same logic as the main app
const getTodayString = (): string => {
  // Get the current week and use its start date as default
  const currentWeekNumber = getCurrentWeekNumber();
  const currentWeek = getWeekByNumber(currentWeekNumber);
  
  if (currentWeek && currentWeek.days.length > 0) {
    // Use the first day of the current week (Monday)
    return currentWeek.days[0].date;
  }
  
  // Fallback to a reasonable default
  return '2025-12-15';
};

export const PrintSchedule = ({ onClose }: PrintScheduleProps) => {
  const [startDate, setStartDate] = useState(getTodayString()); // Default to today
  const [numberOfWeeks, setNumberOfWeeks] = useState(13); // Default to 3 months
  const [isGenerating, setIsGenerating] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);

  // Focus management for accessibility
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    // Focus the dialog when it opens
    if (dialogRef.current) {
      dialogRef.current.focus();
    }

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const generatePrintableSchedule = () => {
    setIsGenerating(true);
    
    try {
      // Simple approach: get the reading plan for the week containing the selected date
      const weeks: WeeklyReading[] = [];
      const selectedDate = new Date(startDate + 'T00:00:00');
      
      // Find the Monday of the week containing the selected date
      const dayOfWeek = selectedDate.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
      const daysFromMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Convert to days from Monday
      const mondayOfWeek = new Date(selectedDate.getTime() - (daysFromMonday * 24 * 60 * 60 * 1000));
      
      // Calculate which week number this Monday corresponds to
      const planStart = new Date('2025-06-09T00:00:00'); // This should be a Monday
      const diffTime = mondayOfWeek.getTime() - planStart.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      const startWeekNumber = Math.floor(diffDays / 7) + 1;
      
      // Generate the requested number of weeks starting from the Monday
      for (let i = 0; i < numberOfWeeks; i++) {
        const weekNumber = startWeekNumber + i;
        
        const week = getWeekByNumber(weekNumber);
        if (week) {
          // Create a completely custom week with dates starting from the Monday
          const weekStartDate = new Date(mondayOfWeek.getTime() + (i * 7 * 24 * 60 * 60 * 1000));
          const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
          
          const customWeek = {
            ...week,
            weekNumber: weekNumber,
            startDate: weekStartDate.toISOString().split('T')[0],
            endDate: new Date(weekStartDate.getTime() + 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            days: week.days.map((day, dayIndex) => {
              const customDate = new Date(weekStartDate.getTime() + dayIndex * 24 * 60 * 60 * 1000);
              return {
                ...day,
                date: customDate.toISOString().split('T')[0],
                dayOfWeek: dayNames[customDate.getDay()]
              };
            })
          };
          
          weeks.push(customWeek);
        }
      }
      
      if (weeks.length === 0) {
        alert('Error: Could not generate weeks. Please try a different date.');
        return;
      }
      
      createPrintableContent(weeks);
      
    } catch (error) {
      alert('Error generating schedule: ' + String(error));
    } finally {
      setIsGenerating(false);
    }
  };

  const isNewTestament = (book: string): boolean => {
    const ntBooks = [
      'Matthew', 'Mark', 'Luke', 'John', 'Acts', 'Romans', 'I Corinthians', 
      'II Corinthians', 'Galatians', 'Ephesians', 'Philippians', 'Colossians', 
      'I Thessalonians', 'II Thessalonians', 'I Timothy', 'II Timothy', 
      'Titus', 'Philemon', 'Hebrews', 'James', 'I Peter', 'II Peter', 
      'I John', 'II John', 'III John', 'Jude', 'Revelation'
    ];
    return ntBooks.some(nt => book.startsWith(nt));
  };

  const isPsalmOrProverb = (book: string): boolean => {
    return book.startsWith('Psalm') || book.startsWith('Proverbs');
  };

  const createPrintableContent = (weeks: WeeklyReading[]) => {
    try {
      // Create a new window for printing
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        alert('Could not open print window. Please allow popups for this site.');
        return;
      }

      const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Bible Reading Schedule</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              font-size: 12px;
              margin: 15px auto;
              color: #333;
              line-height: 1.4;
              max-width: 700px;
              text-align: center;
            }
            
            .header {
              text-align: center;
              margin-bottom: 20px;
            }
            
            .header h1 {
              margin: 0 0 8px 0;
              font-size: 18px;
              font-weight: bold;
            }
            
            .header p {
              margin: 0;
              font-size: 12px;
              color: #666;
            }
            
            .schedule-table {
              width: 100%;
              border-collapse: collapse;
              font-size: 11px;
              margin: 0 auto;
            }
            
            .schedule-table th {
              padding: 8px 6px;
              text-align: center;
              font-weight: bold;
              border-bottom: 2px solid #333;
              background-color: #f8f9fa;
            }
            
            .schedule-table td {
              padding: 4px 6px;
              text-align: center;
              vertical-align: top;
              border-bottom: 1px solid #eee;
            }
            
            .week-separator {
              border-top: 2px solid #ddd !important;
              padding-top: 6px !important;
            }
            
            .week-group {
              page-break-inside: avoid;
              break-inside: avoid;
            }
            
            .week-group:not(:first-child) {
              page-break-before: auto;
            }
            
            @media print {
              body { 
                margin: 10px;
                font-size: 10px;
              }
              .no-print { 
                display: none; 
              }
              .schedule-table {
                width: 100%;
                font-size: 9px;
              }
              .schedule-table th {
                padding: 4px;
                font-size: 9px;
              }
              .schedule-table td {
                padding: 2px 4px;
                font-size: 9px;
              }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Bible Reading Schedule</h1>
            <p>Generated for ${formatDate(weeks[0]?.startDate || '')} - ${formatDate(weeks[weeks.length - 1]?.endDate || '')}</p>
          </div>
          
          <div class="no-print" style="text-align: center; margin-bottom: 20px;">
            <button onclick="window.print()" style="padding: 10px 20px; background: #007cba; color: white; border: none; border-radius: 5px; cursor: pointer;">Print</button>
            <button onclick="window.close()" style="padding: 10px 20px; background: #666; color: white; border: none; border-radius: 5px; cursor: pointer; margin-left: 10px;">Close</button>
          </div>
          
          <table class="schedule-table">
            <thead>
              <tr>
                <th></th>
                <th>New Testament</th>
                <th>Old Testament</th>
                <th>Psalms/Proverbs</th>
              </tr>
            </thead>
            ${weeks.map((week, weekIndex) => 
              `<tbody class="week-group">
                ${week.days.map((day, dayIndex) => {
                  const oldTestament = day.readings.filter(r => !isNewTestament(r.book) && !isPsalmOrProverb(r.book));
                  const newTestament = day.readings.filter(r => isNewTestament(r.book));
                  const psalmsProverbs = day.readings.filter(r => isPsalmOrProverb(r.book));

                  // Add week separator class for the first day of each week (except the very first week)
                  const isFirstDayOfWeek = dayIndex === 0;
                  const isFirstWeek = weekIndex === 0;
                  const separatorClass = isFirstDayOfWeek && !isFirstWeek ? 'week-separator' : '';

                  return `
                    <tr>
                      <td class="${separatorClass}">
                        ${day.dayOfWeek.substring(0, 3)}-${formatDateShort(day.date)}
                      </td>
                      <td class="${separatorClass}">
                        ${newTestament.map(r => `${r.book} ${r.chapter}`).join('<br>')}
                      </td>
                      <td class="${separatorClass}">
                        ${oldTestament.map(r => `${r.book} ${r.chapter}`).join('<br>')}
                      </td>
                      <td class="${separatorClass}">
                        ${psalmsProverbs.map(r => `${r.book} ${r.chapter}`).join('<br>')}
                      </td>
                    </tr>
                  `;
                }).join('')}
              </tbody>`
            ).join('')}
          </table>
        </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
    
    } catch (error) {
      alert('Error creating print content: ' + String(error));
    }
  };

  const formatDateShort = (dateString: string): string => {
    // Parse the date string directly to avoid timezone issues
    // dateString is in format "YYYY-MM-DD"
    const [year, month, day] = dateString.split('-');
    return `${month}/${day}/${year}`;
  };

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="print-dialog-title"
    >
      <div 
        ref={dialogRef}
        className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 border border-gray-200"
        tabIndex={-1}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 
            id="print-dialog-title"
            className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"
          >
            🖨️ Print Reading Schedule
          </h2>
          <button 
            className="text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600 cursor-pointer transition-colors duration-200"
            onClick={onClose}
            aria-label="Close dialog"
          >
            <span className="sr-only">Close</span>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          <div>
            <label htmlFor="startDate" className="block text-sm font-semibold text-gray-700 mb-2">
              📅 Start Date:
            </label>
            <input
              type="date"
              id="startDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              aria-describedby="start-date-help"
            />
            <div id="start-date-help" className="sr-only">
              Select the date to start your reading schedule. The schedule will begin from the Monday of the selected week.
            </div>
          </div>
          
          <div>
            <label htmlFor="numberOfWeeks" className="block text-sm font-semibold text-gray-700 mb-2">
              📊 Number of Weeks:
            </label>
            <select
              id="numberOfWeeks"
              value={numberOfWeeks}
              onChange={(e) => setNumberOfWeeks(Number(e.target.value))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              aria-describedby="weeks-help"
            >
              <option value={4}>1 month (4 weeks)</option>
              <option value={13}>3 months (13 weeks)</option>
              <option value={26}>6 months (26 weeks)</option>
              <option value={52}>1 year (52 weeks)</option>
              <option value={104}>2 years (104 weeks)</option>
              <option value={156}>3 years (156 weeks)</option>
            </select>
            <div id="weeks-help" className="sr-only">
              Choose how many weeks to include in your printable schedule.
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <button
              className="px-6 py-3 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer transition-all duration-200"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="px-6 py-3 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-all duration-200"
              onClick={generatePrintableSchedule}
              disabled={isGenerating}
            >
              {isGenerating ? '⏳ Generating...' : '🖨️ Show Printable Schedule'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
