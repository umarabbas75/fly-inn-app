import { type ClassValue, clsx } from 'clsx';
import { format, isValid, parseISO } from 'date-fns';
import { twMerge } from 'tailwind-merge';


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(timestamp: any, dateFormat = 'MMMM d, yyyy h:mm:ss a') {
  // Parse the timestamp string to a Date object
  const date = parseISO(timestamp);

  // Check if the parsed date is valid
  if (!isValid(date)) {
    return;
  }

  // Format the date
  const formattedDate = format(date, dateFormat);

  return formattedDate;
}
