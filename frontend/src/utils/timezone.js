// frontend/src/utils/timezone.js
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

// Extend Day.js with UTC and Timezone plugins
dayjs.extend(utc);
dayjs.extend(timezone);

/**
 * Converts a given day and time from JST to Finnish Time.
 *
 * @param {string} day - The day of the week (e.g., 'Sunday').
 * @param {string} time - The time in 'HH:mm' format (e.g., '21:00').
 * @returns {{ day: string, time: string }} - The converted day and time.
 */
export function convertJSTToFinnish(day, time) {
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  // Normalize the day name (capitalize first letter)
  const normalizedDay = day.charAt(0).toUpperCase() + day.slice(1).toLowerCase();

  // Find the index of the broadcast day
  const dayIndex = daysOfWeek.indexOf(normalizedDay);
  if (dayIndex === -1) {
    // If the day is invalid, return as is
    return { day, time };
  }

  // Create a reference date (e.g., 2021-01-03 is a Sunday)
  // Reference week start on Sunday
  const referenceDate = dayjs().day(dayIndex).format('YYYY-MM-DD'); // Current week

  // Combine reference date with broadcast time and JST offset
  const broadcastDateTimeJST = `${referenceDate}T${time}:00+09:00`; // Append JST offset

  // Convert to Finnish Timezone
  const finnishDateTime = dayjs(broadcastDateTimeJST).tz('Europe/Helsinki');

  // Extract the converted day and time
  const convertedDay = finnishDateTime.format('dddd');
  const convertedTime = finnishDateTime.format('HH:mm');

  return { day: convertedDay, time: convertedTime };
}