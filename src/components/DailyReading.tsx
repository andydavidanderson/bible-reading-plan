import type { DailyReading, Reading } from '../data/readingPlan';
import { formatShortDate, isDateToday, isDatePast } from '../utils/dateUtils';
import { validateReading } from '../data/bibleBooks';

interface DailyReadingProps {
  daily: DailyReading;
}

interface ReadingItemProps {
  reading: Reading;
}

const ReadingItem = ({ reading }: ReadingItemProps) => {
  const isValid = validateReading(reading.book, reading.chapter);
  
  // Generate ESV.org URL for the reading
  const generateESVUrl = () => {
    // ESV.org uses a specific format: https://www.esv.org/Genesis+1/
    // Need to format book name and chapter for URL
    const bookForUrl = reading.book.replace(/\s+/g, '+'); // Replace spaces with +
    return `https://www.esv.org/${bookForUrl}+${reading.chapter}/`;
  };

  const handleClick = () => {
    if (isValid) {
      window.open(generateESVUrl(), '_blank');
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (isValid && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      handleClick();
    }
  };
  
  // Determine the reading type with higher contrast backgrounds
  const getReadingStyle = () => {
    const book = reading.book.toLowerCase();
    if (book === 'psalms') return 'border-l-purple-400 bg-purple-100 shadow-sm border border-purple-200'; 
    if (book === 'proverbs') return 'border-l-amber-400 bg-amber-100 shadow-sm border border-amber-200'; 
    
    // Old Testament books
    const oldTestamentBooks = ['genesis', 'exodus', 'leviticus', 'numbers', 'deuteronomy', 'joshua', 'judges', 'ruth', '1 samuel', '2 samuel', '1 kings', '2 kings', '1 chronicles', '2 chronicles', 'ezra', 'nehemiah', 'esther', 'job', 'ecclesiastes', 'song of solomon', 'isaiah', 'jeremiah', 'lamentations', 'ezekiel', 'daniel', 'hosea', 'joel', 'amos', 'obadiah', 'jonah', 'micah', 'nahum', 'habakkuk', 'zephaniah', 'haggai', 'zechariah', 'malachi'];
    
    if (oldTestamentBooks.includes(book)) return 'border-l-emerald-400 bg-emerald-100 shadow-sm border border-emerald-200';
    
    // New Testament books  
    return 'border-l-blue-400 bg-blue-100 shadow-sm border border-blue-200';
  };
  
  return (
    <div 
      className={`${getReadingStyle()} border-l-4 pl-4 py-3 rounded-lg transition-all duration-200 hover:shadow-md hover:scale-[1.02] ${isValid ? 'cursor-pointer' : 'cursor-default'}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={isValid ? 0 : -1}
      role={isValid ? "button" : undefined}
      aria-label={isValid ? `Open ${reading.book} chapter ${reading.chapter} in ESV.org` : undefined}
      title={isValid ? 'Click to open in ESV.org' : 'Invalid book/chapter reference'}
    >
      <span 
        className={`text-sm font-semibold ${!isValid ? 'text-red-700' : 'text-gray-900 hover:text-blue-700'}`}
      >
        {reading.book} {reading.chapter}
        {!isValid && ' ⚠️'}
      </span>
    </div>
  );
};

export const DailyReadingComponent = ({ daily }: DailyReadingProps) => {
  const isToday = isDateToday(daily.date);
  const isPast = isDatePast(daily.date);
  
  const getBorderAndBgClass = () => {
    if (isToday) return 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-300 border-2 shadow-lg';
    if (isPast) return 'bg-gray-50 border-gray-300';
    return 'bg-white border-gray-300';
  };
  
  return (
    <article 
      className={`${getBorderAndBgClass()} rounded-xl border p-6 transition-all duration-300 hover:shadow-lg hover:scale-[1.01]`}
      aria-label={`Reading for ${daily.dayOfWeek}, ${formatShortDate(daily.date)}`}
    >
      <header className="mb-5">
        <h3 className="text-xl font-semibold text-gray-900 mb-1">
          {daily.dayOfWeek}
        </h3>
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600 font-medium">
            {formatShortDate(daily.date)}
          </p>
          {isToday && (
            <span 
              className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-slate-900 text-white"
              aria-label="Today's reading"
            >
              Today
            </span>
          )}
        </div>
      </header>
      
      <div 
        className="space-y-2"
        role="list"
        aria-label="Bible readings for this day"
      >
        {daily.readings.map((reading, index) => (
          <div key={`${index}-${reading.book}-${reading.chapter}`} role="listitem">
            <ReadingItem reading={reading} />
          </div>
        ))}
      </div>
    </article>
  );
};
