console.log('🚀 Starting reading plan generation...');

export interface Reading {
  book: string;
  chapter: number;
}

export interface DailyReading {
  date: string; // YYYY-MM-DD format
  dayOfWeek: string;
  readings: Reading[];
}

export interface WeeklyReading {
  weekNumber: number;
  startDate: string;
  endDate: string;
  days: DailyReading[];
}

// Reading plan configuration - this defines the pattern
interface ReadingPlanConfig {
  startDate: string; // The date the plan starts
  tracks: {
    primary: { book: string; startChapter: number; endChapter?: number }[];
    secondary: { book: string; startChapter: number; endChapter?: number }[];
    psalms: { book: string; startChapter: number; endChapter?: number }[];
  };
}

const readingPlanConfig: ReadingPlanConfig = {
  startDate: '2025-06-09', // Monday of Week 1
  tracks: {
    // Old Testament track (every day) - all OT books except Psalms and Proverbs
    primary: [
      { book: 'Isaiah', startChapter: 29, endChapter: 66 },
      { book: 'Jeremiah', startChapter: 1, endChapter: 52 },
      { book: 'Lamentations', startChapter: 1, endChapter: 5 },
      { book: 'Ezekiel', startChapter: 1, endChapter: 48 },
      { book: 'Daniel', startChapter: 1, endChapter: 12 },
      { book: 'Hosea', startChapter: 1, endChapter: 14 },
      { book: 'Joel', startChapter: 1, endChapter: 3 },
      { book: 'Amos', startChapter: 1, endChapter: 9 },
      { book: 'Obadiah', startChapter: 1, endChapter: 1 },
      { book: 'Jonah', startChapter: 1, endChapter: 4 },
      { book: 'Micah', startChapter: 1, endChapter: 7 },
      { book: 'Nahum', startChapter: 1, endChapter: 3 },
      { book: 'Habakkuk', startChapter: 1, endChapter: 3 },
      { book: 'Zephaniah', startChapter: 1, endChapter: 3 },
      { book: 'Haggai', startChapter: 1, endChapter: 2 },
      { book: 'Zechariah', startChapter: 1, endChapter: 14 },
      { book: 'Malachi', startChapter: 1, endChapter: 4 },
      // Then restart with Genesis
      { book: 'Genesis', startChapter: 1, endChapter: 50 },
      { book: 'Exodus', startChapter: 1, endChapter: 40 },
      { book: 'Leviticus', startChapter: 1, endChapter: 27 },
      { book: 'Numbers', startChapter: 1, endChapter: 36 },
      { book: 'Deuteronomy', startChapter: 1, endChapter: 34 },
      { book: 'Joshua', startChapter: 1, endChapter: 24 },
      { book: 'Judges', startChapter: 1, endChapter: 21 },
      { book: 'Ruth', startChapter: 1, endChapter: 4 },
      { book: 'I Samuel', startChapter: 1, endChapter: 31 },
      { book: 'II Samuel', startChapter: 1, endChapter: 24 },
      { book: 'I Kings', startChapter: 1, endChapter: 22 },
      { book: 'II Kings', startChapter: 1, endChapter: 25 },
      { book: 'I Chronicles', startChapter: 1, endChapter: 29 },
      { book: 'II Chronicles', startChapter: 1, endChapter: 36 },
      { book: 'Ezra', startChapter: 1, endChapter: 10 },
      { book: 'Nehemiah', startChapter: 1, endChapter: 13 },
      { book: 'Esther', startChapter: 1, endChapter: 10 },
      { book: 'Job', startChapter: 1, endChapter: 42 },
      { book: 'Ecclesiastes', startChapter: 1, endChapter: 12 },
      { book: 'Song of Solomon', startChapter: 1, endChapter: 8 },
      { book: 'Isaiah', startChapter: 1, endChapter: 28 } // Complete Isaiah from the beginning
    ],
    // New Testament track (Tuesday and Thursday only)
    secondary: [
      { book: 'Revelation', startChapter: 17, endChapter: 22 },
      { book: 'Matthew', startChapter: 1, endChapter: 28 },
      { book: 'Mark', startChapter: 1, endChapter: 16 },
      { book: 'Luke', startChapter: 1, endChapter: 24 },
      { book: 'John', startChapter: 1, endChapter: 21 },
      { book: 'Acts', startChapter: 1, endChapter: 28 },
      { book: 'Romans', startChapter: 1, endChapter: 16 },
      { book: 'I Corinthians', startChapter: 1, endChapter: 16 },
      { book: 'II Corinthians', startChapter: 1, endChapter: 13 },
      { book: 'Galatians', startChapter: 1, endChapter: 6 },
      { book: 'Ephesians', startChapter: 1, endChapter: 6 },
      { book: 'Philippians', startChapter: 1, endChapter: 4 },
      { book: 'Colossians', startChapter: 1, endChapter: 4 },
      { book: 'I Thessalonians', startChapter: 1, endChapter: 5 },
      { book: 'II Thessalonians', startChapter: 1, endChapter: 3 },
      { book: 'I Timothy', startChapter: 1, endChapter: 6 },
      { book: 'II Timothy', startChapter: 1, endChapter: 4 },
      { book: 'Titus', startChapter: 1, endChapter: 3 },
      { book: 'Philemon', startChapter: 1, endChapter: 1 },
      { book: 'Hebrews', startChapter: 1, endChapter: 13 },
      { book: 'James', startChapter: 1, endChapter: 5 },
      { book: 'I Peter', startChapter: 1, endChapter: 5 },
      { book: 'II Peter', startChapter: 1, endChapter: 3 },
      { book: 'I John', startChapter: 1, endChapter: 5 },
      { book: 'II John', startChapter: 1, endChapter: 1 },
      { book: 'III John', startChapter: 1, endChapter: 1 },
      { book: 'Jude', startChapter: 1, endChapter: 1 },
      { book: 'Revelation', startChapter: 1, endChapter: 16 } // Complete Revelation from the beginning
    ],
    // Psalms and Proverbs track (Wednesday only)
    psalms: [
      { book: 'Psalm', startChapter: 72, endChapter: 150 },
      { book: 'Proverbs', startChapter: 1, endChapter: 31 },
      { book: 'Psalm', startChapter: 1, endChapter: 71 } // Complete Psalms from the beginning
    ]
  }
};

// Dynamic reading plan generation functions
function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

function getDayName(date: Date): string {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[date.getDay()];
}

function createLocalDate(dateString: string): Date {
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day); // month is 0-indexed
}

function getReadingForDay(dayIndex: number, track: 'primary' | 'secondary' | 'psalms'): Reading | null {
  const trackConfig = readingPlanConfig.tracks[track];
  let totalChapters = 0;
  
  // Calculate total chapters available in this track
  for (const bookConfig of trackConfig) {
    const endChapter = bookConfig.endChapter ?? bookConfig.startChapter;
    totalChapters += (endChapter - bookConfig.startChapter + 1);
  }
  
  // Always cycle when we exceed available chapters
  if (dayIndex >= totalChapters) {
    dayIndex = dayIndex % totalChapters;
  }
  
  // Find which book and chapter this dayIndex corresponds to
  let currentIndex = 0;
  for (const bookConfig of trackConfig) {
    const endChapter = bookConfig.endChapter ?? bookConfig.startChapter;
    const chaptersInBook = endChapter - bookConfig.startChapter + 1;
    
    if (dayIndex < currentIndex + chaptersInBook) {
      const chapterOffset = dayIndex - currentIndex;
      return {
        book: bookConfig.book,
        chapter: bookConfig.startChapter + chapterOffset
      };
    }
    currentIndex += chaptersInBook;
  }
  
  return null;
}

function getReadingsForDay(dayName: string, primaryIndex: number, secondaryIndex: number, psalmsIndex: number): Reading[] {
  const readings: Reading[] = [];
  
  switch (dayName) {
    case 'Monday': {
      const mondayPrimary = getReadingForDay(primaryIndex, 'primary');
      if (mondayPrimary) readings.push(mondayPrimary);
      break;
    }
    case 'Tuesday': {
      const tuesdayPrimary = getReadingForDay(primaryIndex, 'primary');
      if (tuesdayPrimary) readings.push(tuesdayPrimary);
      const tuesdaySecondary = getReadingForDay(secondaryIndex, 'secondary');
      if (tuesdaySecondary) readings.push(tuesdaySecondary);
      break;
    }
    case 'Wednesday': {
      const wednesdayPrimary = getReadingForDay(primaryIndex, 'primary');
      if (wednesdayPrimary) readings.push(wednesdayPrimary);
      const psalm = getReadingForDay(psalmsIndex, 'psalms');
      if (psalm) readings.push(psalm);
      break;
    }
    case 'Thursday': {
      const thursdayPrimary = getReadingForDay(primaryIndex, 'primary');
      if (thursdayPrimary) readings.push(thursdayPrimary);
      const thursdaySecondary = getReadingForDay(secondaryIndex, 'secondary');
      if (thursdaySecondary) readings.push(thursdaySecondary);
      break;
    }
    case 'Friday': {
      const fridayPrimary = getReadingForDay(primaryIndex, 'primary');
      if (fridayPrimary) readings.push(fridayPrimary);
      break;
    }
  }
  
  return readings;
}

function generateWeeklyReading(weekNumber: number): WeeklyReading | null {
  const startDate = createLocalDate(readingPlanConfig.startDate);
  const weekStartDate = addDays(startDate, (weekNumber - 1) * 7);
  
  // Skip weekends - only generate Monday through Friday
  const days: DailyReading[] = [];
  let primaryIndex = (weekNumber - 1) * 5; // 5 days per week for primary
  let secondaryIndex = (weekNumber - 1) * 2; // 2 readings per week for secondary (Tue & Thu)
  let psalmsIndex = weekNumber - 1; // 1 psalm per week
  
  for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
    const currentDate = addDays(weekStartDate, dayOffset);
    const dayName = getDayName(currentDate);
    
    // Only include weekdays
    if (dayName === 'Saturday' || dayName === 'Sunday') {
      continue;
    }
    
    const readings = getReadingsForDay(dayName, primaryIndex, secondaryIndex, psalmsIndex);
    
    // Update indices based on day
    if (dayName === 'Tuesday' || dayName === 'Thursday') {
      secondaryIndex++;
    }
    if (dayName === 'Wednesday') {
      psalmsIndex++;
    }
    primaryIndex++;
    
    days.push({
      date: formatDate(currentDate),
      dayOfWeek: dayName,
      readings
    });
  }
  
  if (days.length === 0) {
    return null;
  }
  
  return {
    weekNumber,
    startDate: formatDate(weekStartDate),
    endDate: formatDate(addDays(weekStartDate, 6)),
    days
  };
}

// Generate reading plan dynamically - can generate infinite weeks!
function generateReadingPlan(numberOfWeeks: number = 1000): WeeklyReading[] {
  const weeks: WeeklyReading[] = [];
  
  for (let i = 1; i <= numberOfWeeks; i++) {
    const week = generateWeeklyReading(i);
    if (week?.days.some(day => day.readings.length > 0)) {
      weeks.push(week);
    }
  }
  
  return weeks;
}

// Alternative: Generate weeks on-demand for truly infinite extension
export function getWeekByNumberDynamic(weekNumber: number): WeeklyReading | null {
  return generateWeeklyReading(weekNumber);
}

// Generate the reading plan - this can be extended to any number of weeks
export const readingPlan: WeeklyReading[] = generateReadingPlan(1000); // Generate ~19 years worth

console.log('📚 Reading plan generated with', readingPlan.length, 'weeks (~' + Math.round(readingPlan.length/52) + ' years)');

// Calculate and log track lengths for debugging
function getTrackLength(track: 'primary' | 'secondary' | 'psalms'): number {
  let total = 0;
  for (const book of readingPlanConfig.tracks[track]) {
    const endChapter = book.endChapter ?? book.startChapter;
    total += (endChapter - book.startChapter + 1);
  }
  return total;
}

console.log('📖 Old Testament track:', getTrackLength('primary'), 'chapters');
console.log('📖 New Testament track:', getTrackLength('secondary'), 'chapters');  
console.log('📖 Psalms/Proverbs track:', getTrackLength('psalms'), 'chapters');

if (readingPlan.length > 0) {
  console.log('📅 First week:', readingPlan[0]);
  console.log('🏁 Last week:', readingPlan[readingPlan.length - 1]);
} else {
  console.log('❌ No weeks generated!');
}

// Helper function to get current week based on date
export function getCurrentWeekNumber(): number {
  // Get the actual current date
  const now = new Date();
  const todayString = now.getFullYear() + '-' + 
    String(now.getMonth() + 1).padStart(2, '0') + '-' + 
    String(now.getDate()).padStart(2, '0');
  const today = createLocalDate(todayString);
  
  const planStart = createLocalDate(readingPlanConfig.startDate); // Use the config start date
  const diffTime = today.getTime() - planStart.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const weekNumber = Math.floor(diffDays / 7) + 1;
  
  console.log('Today:', today);
  console.log('Plan start:', planStart);
  console.log('Diff days:', diffDays);
  console.log('Calculated week number:', weekNumber);
  console.log('Total weeks available:', readingPlan.length);
  
  // Return the calculated week, bounded by available weeks
  return Math.max(1, Math.min(weekNumber, readingPlan.length));
}

// Helper function to get week by number - supports infinite weeks
export function getWeekByNumber(weekNumber: number): WeeklyReading | undefined {
  // First try to get from pre-generated plan
  const preGenerated = readingPlan.find(week => week.weekNumber === weekNumber);
  if (preGenerated) {
    return preGenerated;
  }
  
  // If not found in pre-generated, generate dynamically
  const dynamicWeek = generateWeeklyReading(weekNumber);
  return dynamicWeek || undefined;
}
