import { useState, useEffect } from 'react';
import { Navigation } from './components/Navigation';
import { WeeklyReadingComponent } from './components/WeeklyReading';
import { PrintSchedule } from './components/PrintSchedule';
import { getCurrentWeekNumber, getWeekByNumber } from './data/readingPlan';

function App() {
  const [currentWeekNumber, setCurrentWeekNumber] = useState(1);
  const [showPrintDialog, setShowPrintDialog] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const currentWeek = getWeekByNumber(currentWeekNumber);
  const actualCurrentWeek = getCurrentWeekNumber();
  
  useEffect(() => {
    // Set to current week on initial load, but fallback to 1 if issues
    const weekToSet = actualCurrentWeek || 1;
    setCurrentWeekNumber(weekToSet);
  }, [actualCurrentWeek]);
  
  const handlePreviousWeek = () => {
    if (currentWeekNumber > 1) {
      setCurrentWeekNumber(currentWeekNumber - 1);
      setStatusMessage(`Navigated to week ${currentWeekNumber - 1}`);
    }
  };
  
  const handleNextWeek = () => {
    // No upper limit - can go as far into the future as needed
    setCurrentWeekNumber(currentWeekNumber + 1);
    setStatusMessage(`Navigated to week ${currentWeekNumber + 1}`);
  };
  
  const handleGoToCurrentWeek = () => {
    setCurrentWeekNumber(actualCurrentWeek);
    setStatusMessage('Navigated to current week');
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex flex-col">
      {/* Skip to main content link for keyboard navigation */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded-lg z-50"
      >
        Skip to main content
      </a>
      
      <Navigation
        onPrint={handlePrint}
      />
      
      <main id="main-content" className="flex-1 max-w-7xl mx-auto py-8 sm:px-6 lg:px-8 w-full">
        {/* Screen reader live region for status announcements */}
        <div 
          className="sr-only" 
          aria-live="polite" 
          aria-atomic="true"
          role="status"
        >
          {statusMessage}
        </div>
        
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
      
      <footer className="bg-white/80 backdrop-blur-sm border-t border-gray-200 mt-auto">
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
