// Returnerer alle datoer mellom start og slutt (inklusive)
export function getDatesBetween(start, end) {
  const dates = [];
  let current = new Date(start);
  while (current <= end) {
    dates.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }
  return dates;
}

// Sjekker om to dato-intervaller overlapper
export function rangesOverlap(range1Start, range1End, range2Start, range2End) {
  return range1Start <= range2End && range2Start <= range1End;
}

// Normaliserer dato til midnatt
export function normalizeDate(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

// Kalkulerer antall dager mellom to datoer (inkludert)
export function daysBetween(start, end) {
  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.round((normalizeDate(end) - normalizeDate(start)) / msPerDay) + 1;
}


// Legger til 'days' dager til 'date' og returnerer ny dato
export function addDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

// Returnerer true hvis datoen er lørdag eller søndag
export function isWeekend(date) {
  const day = date.getDay();
  return day === 0 || day === 6;
}

// Formaterer dato til "YYYY-MM-DD"
export function formatDateISO(date) {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}