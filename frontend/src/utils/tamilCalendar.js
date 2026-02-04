/**
 * Tamil Calendar Utilities
 * Provides Tamil month names and calendar conversion
 */

export const TAMIL_MONTHS = [
  'சித்திரை',       // Chittirai (Apr-May)
  'வைகாசி',        // Vaigasi (May-Jun)
  'ஆனி',           // Aani (Jun-Jul)
  'ஆடி',           // Aadi (Jul-Aug)
  'ஐப்பசி',        // Aipasi (Aug-Sep)
  'கார்த்திகை',    // Karthikai (Sep-Oct)
  'மார்கழி',       // Margazhi (Oct-Nov)
  'தை',            // Thai (Nov-Dec)
  'மாசி',          // Masi (Dec-Jan)
  'பங்குனி',       // Panguni (Jan-Feb)
  'சோம ஆனி',      // Soma Aani (Feb-Mar)
  'விசாக',         // Visaka (Mar-Apr)
];

export const TAMIL_MONTHS_ENGLISH = [
  'Chittirai',
  'Vaigasi',
  'Aani',
  'Aadi',
  'Aipasi',
  'Karthikai',
  'Margazhi',
  'Thai',
  'Masi',
  'Panguni',
  'Soma Aani',
  'Visaka',
];

export const GREGORIAN_MONTHS_TAMIL = {
  0: 'தை',          // January -> Thai (Thai spans mid-Dec to mid-Jan, but Jan is mostly Thai)
  1: 'தை',          // February early Feb is Thai, mid-Feb is Masi (showing Thai for early Feb as per snapshot)
  2: 'மாசி',        // March -> Masi
  3: 'பங்குனி',     // April -> Panguni (starts mid-Mar)
  4: 'சித்திரை',    // May -> Chittirai (starts mid-Apr)
  5: 'வைகாசி',      // June -> Vaigasi
  6: 'ஆனி',         // July -> Aani
  7: 'ஆடி',         // August -> Aadi
  8: 'ஐப்பசி',      // September -> Aipasi
  9: 'கார்த்திகை',  // October -> Karthikai
  10: 'மார்கழி',    // November -> Margazhi
  11: 'தை',         // December -> Thai (Thai starts mid-Dec)
};

/**
 * Get Tamil month name for a given JavaScript Date
 * @param {Date} date - JavaScript Date object
 * @returns {Object} { tamil: string, english: string }
 */
export const getTamilMonthForDate = (date) => {
  const month = date.getMonth();
  const tamilMonth = GREGORIAN_MONTHS_TAMIL[month];
  const index = TAMIL_MONTHS.indexOf(tamilMonth);
  
  return {
    tamil: tamilMonth,
    english: TAMIL_MONTHS_ENGLISH[index] || '',
    gregorianMonth: date.toLocaleString('en-IN', { month: 'long' }),
  };
};

/**
 * Format date with Tamil calendar info
 * @param {Date} date - JavaScript Date object
 * @returns {string} Formatted date string with Tamil month
 */
export const formatDateWithTamil = (date) => {
  const gregorianDate = date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  const tamilInfo = getTamilMonthForDate(date);

  return `${gregorianDate} (${tamilInfo.tamil})`;
};

/**
 * Get weekday names in Tamil
 */
export const TAMIL_WEEKDAYS = [
  'ஞாயிற்றுக்கிழமை',  // Sunday
  'திங்கட்கிழமை',     // Monday
  'செவ்வாய்கிழமை',    // Tuesday
  'புதன்கிழமை',       // Wednesday
  'வியாழக்கிழமை',     // Thursday
  'வெள்ளிக்கிழமை',    // Friday
  'சனிக்கிழமை',       // Saturday
];

export const TAMIL_WEEKDAYS_SHORT = [
  'ஞாயிறு',    // Sunday
  'திங்கள்',   // Monday
  'செவ்வாய்',  // Tuesday
  'புதன்',     // Wednesday
  'வியாழன்',   // Thursday
  'வெள்ளி',    // Friday
  'சனி',       // Saturday
];

/**
 * Get Tamil weekday name for a JavaScript Date
 * @param {Date} date - JavaScript Date object
 * @param {boolean} short - Return short form if true
 * @returns {string} Tamil weekday name
 */
export const getTamilWeekday = (date, short = false) => {
  const dayIndex = date.getDay();
  return short ? TAMIL_WEEKDAYS_SHORT[dayIndex] : TAMIL_WEEKDAYS[dayIndex];
};

/**
 * Get approximate Tamil month day for a Gregorian date
 * Note: This is approximate. Actual Tamil month day varies by year and requires panchangam data.
 * Tamil month starts around the 14th of the corresponding Gregorian month.
 * @param {Date} date - JavaScript Date object
 * @returns {number} Approximate day in Tamil month
 */
export const getApproximateTamilMonthDay = (date) => {
  const gregorianDay = date.getDate();
  const gregorianMonth = date.getMonth();
  
  // Tamil month transitions occur around the 14th of each Gregorian month
  // Early month (1-13): Part of previous Tamil month
  // Late month (14-31): Current Tamil month counting
  
  if (gregorianDay < 14) {
    // These days belong to the previous Tamil month
    // Calculate from end of previous month
    const prevMonth = new Date(date.getFullYear(), gregorianMonth, 0);
    const daysInPrevMonth = prevMonth.getDate();
    return daysInPrevMonth - (14 - gregorianDay) + 1;
  } else {
    // These days belong to the current Tamil month
    return gregorianDay - 14 + 1;
  }
};

/**
 * Get Tamil month info with approximate day
 * @param {Date} date - JavaScript Date object
 * @returns {Object} { tamil, english, gregorianMonth, tamilMonthDay }
 */
export const getTamilMonthWithDay = (date) => {
  const monthInfo = getTamilMonthForDate(date);
  const tamilMonthDay = getApproximateTamilMonthDay(date);
  return {
    ...monthInfo,
    tamilMonthDay,
  };
};

export default {
  TAMIL_MONTHS,
  TAMIL_MONTHS_ENGLISH,
  getTamilMonthForDate,
  getTamilMonthWithDay,
  formatDateWithTamil,
  TAMIL_WEEKDAYS,
  getTamilWeekday,
  getApproximateTamilMonthDay,
};
