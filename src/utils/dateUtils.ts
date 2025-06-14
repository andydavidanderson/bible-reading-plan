import { format, parseISO, isToday, isBefore } from 'date-fns';

export const formatDate = (dateString: string): string => {
  try {
    const date = parseISO(dateString);
    return format(date, 'EEEE, MMMM d, yyyy');
  } catch {
    return dateString;
  }
};

export const formatShortDate = (dateString: string): string => {
  try {
    const date = parseISO(dateString);
    return format(date, 'MMM d');
  } catch {
    return dateString;
  }
};

export const isDateToday = (dateString: string): boolean => {
  try {
    const date = parseISO(dateString);
    return isToday(date);
  } catch {
    return false;
  }
};

export const isDatePast = (dateString: string): boolean => {
  try {
    const date = parseISO(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return isBefore(date, today);
  } catch {
    return false;
  }
};

export const getDayOfWeekShort = (dateString: string): string => {
  try {
    const date = parseISO(dateString);
    return format(date, 'EEE');
  } catch {
    return '';
  }
};
