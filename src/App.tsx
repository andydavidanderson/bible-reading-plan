import { useState, useEffect } from 'react';
import { Navigation } from './components/Navigation';
import { WeeklyReadingComponent } from './components/WeeklyReading';
import { PrintSchedule } from './components/PrintSchedule';
import { readingPlan, getCurrentWeekNumber, getWeekByNumber } from './data/readingPlan';

function App() {
  const [currentWeekNumber, setCurrentWeekNumber] = useState(1);
  const [showPrintDialog, setShowPrintDialog] = useState(false);
  const currentWeek = getWeekByNumber(currentWeekNumber);
  const actualCurrentWeek = getCurrentWeekNumber();
  
  console.log('App state - currentWeekNumber:', currentWeekNumber);
  console.log('App state - currentWeek:', currentWeek);
  console.log('App state - readingPlan:', readingPlan);
  
  useEffect(() => {
    // Set to current week on initial load, but fallback to 1 if issues
    const weekToSet = actualCurrentWeek || 1;
    console.log('Setting week to:', weekToSet);
    setCurrentWeekNumber(weekToSet);
  }, [actualCurrentWeek]);
  
  const handlePreviousWeek = () => {
    if (currentWeekNumber > 1) {
      setCurrentWeekNumber(currentWeekNumber - 1);
    }
  };
  
  const handleNextWeek = () => {
    // No upper limit - can go as far into the future as needed
    setCurrentWeekNumber(currentWeekNumber + 1);
  };
  
  const handleGoToCurrentWeek = () => {
    setCurrentWeekNumber(actualCurrentWeek);
  };

  const handlePrint = () => {
    setShowPrintDialog(true);
  };

  const handleClosePrint = () => {
    setShowPrintDialog(false);
  };
  
  if (!currentWeek) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Bible Reading Plan
          </h1>
          <p className="text-gray-600">Week not found</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <Navigation
        onPrint={handlePrint}
      />
      
      <main className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <WeeklyReadingComponent 
            week={currentWeek} 
            currentWeek={currentWeekNumber}
            onPreviousWeek={handlePreviousWeek}
            onNextWeek={handleNextWeek}
            onGoToCurrentWeek={handleGoToCurrentWeek}
            isCurrentWeek={currentWeekNumber === actualCurrentWeek}
          />
        </div>
      </main>
      
      {showPrintDialog && (
        <PrintSchedule onClose={handleClosePrint} />
      )}
      
      <footer className="bg-white/80 backdrop-blur-sm border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-600">
            📖 Bible Reading Plan - Stay consistent in your daily reading journey
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
