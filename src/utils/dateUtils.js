// Returns all dates between start and end (inclusive)
export function getDatesBetween(start, end) {
  const dates = [];
  let current = new Date(start);
  while (current <= end) {
    dates.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }
  return dates;
}

// Checks if two date ranges overlap
export function rangesOverlap(range1Start, range1End, range2Start, range2End) {
  return range1Start <= range2End && range2Start <= range1End;
}

// Normalizes a date to midnight (00:00:00)
export function normalizeDate(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

// Calculates the number of days between two dates (inclusive)
export function daysBetween(start, end) {
  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.round((normalizeDate(end) - normalizeDate(start)) / msPerDay) + 1;
}

// Adds 'days' days to 'date' and returns a new date
export function addDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

// Returns true if the date is Saturday or Sunday
export function isWeekend(date) {
  const day = date.getDay();
  return day === 0 || day === 6;
}

// Formats a date as "YYYY-MM-DD"
export function formatDateISO(date) {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
