import type { WeeklyReading } from '../data/readingPlan';
import { DailyReadingComponent } from './DailyReading';

interface WeeklyReadingProps {
  week: WeeklyReading;
  currentWeek: number;
  onPreviousWeek: () => void;
  onNextWeek: () => void;
  onGoToCurrentWeek: () => void;
  isCurrentWeek: boolean;
}

export const WeeklyReadingComponent = ({ 
  week, 
  currentWeek, 
  onPreviousWeek, 
  onNextWeek, 
  onGoToCurrentWeek, 
  isCurrentWeek 
}: WeeklyReadingProps) => {
  // Format the week title to show the date range prominently
  const getWeekTitle = () => {
    const startDate = new Date(week.startDate + 'T00:00:00');
    const endDate = new Date(week.endDate + 'T00:00:00');
    
    // If same month, show "June 9-15, 2025"
    if (startDate.getMonth() === endDate.getMonth()) {
      const monthName = startDate.toLocaleDateString('en-US', { month: 'long' });
      const year = startDate.getFullYear();
      return `${monthName} ${startDate.getDate()}-${endDate.getDate()}, ${year}`;
    } else {
      // If different months, show "June 30 - July 6, 2025"
      const startMonth = startDate.toLocaleDateString('en-US', { month: 'long' });
      const endMonth = endDate.toLocaleDateString('en-US', { month: 'long' });
      const year = endDate.getFullYear();
      return `${startMonth} ${startDate.getDate()} - ${endMonth} ${endDate.getDate()}, ${year}`;
    }
  };

  return (
    <section className="bg-white shadow-lg rounded-2xl overflow-hidden border border-gray-100">
      <header className="bg-gradient-to-r from-slate-800 to-slate-900 px-8 py-8">
        <div className="flex items-center justify-between">
          <button
            onClick={onPreviousWeek}
            disabled={currentWeek <= 1}
            className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-white disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-all duration-200"
            aria-label="Go to previous week"
          >
            <span className="text-xl" aria-hidden="true">←</span>
          </button>
          
          <div className="text-center flex-1 mx-6">
            <h2 className="text-3xl font-light text-white tracking-wide mb-2">
              {getWeekTitle()}
            </h2>
            <div className="flex items-center justify-center space-x-4">
              {isCurrentWeek && (
                <p className="text-slate-300 text-sm font-medium">
                  This Week's Reading
                </p>
              )}
              {!isCurrentWeek && (
                <button
                  onClick={onGoToCurrentWeek}
                  className="px-3 py-1 bg-white/20 hover:bg-white/30 text-white text-xs font-medium rounded-full cursor-pointer transition-all duration-200"
                >
                  Back To Today's Reading
                </button>
              )}
            </div>
          </div>
          
          <button
            onClick={onNextWeek}
            className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer transition-all duration-200"
            aria-label="Go to next week"
          >
            <span className="text-xl" aria-hidden="true">→</span>
          </button>
        </div>
      </header>
      
      <main 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 p-8"
        aria-label="Daily reading schedule for the week"
      >
        {week.days.map((daily, index) => (
          <DailyReadingComponent 
            key={`${daily.date}-${index}`} 
            daily={daily} 
          />
        ))}
      </main>
    </section>
  );
};
