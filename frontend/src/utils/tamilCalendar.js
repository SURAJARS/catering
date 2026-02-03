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
  0: 'மாசி',        // January -> Masi
  1: 'பங்குனி',     // February -> Panguni
  2: 'சோம ஆனி',    // March -> Soma Aani
  3: 'சித்திரை',    // April -> Chittirai
  4: 'வைகாசி',      // May -> Vaigasi
  5: 'ஆனி',         // June -> Aani
  6: 'ஆடி',         // July -> Aadi
  7: 'ஐப்பசி',      // August -> Aipasi
  8: 'கார்த்திகை',  // September -> Karthikai
  9: 'மார்கழி',     // October -> Margazhi
  10: 'தை',         // November -> Thai
  11: 'தை',         // December -> Thai (Thai spans Nov-Dec)
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

export default {
  TAMIL_MONTHS,
  TAMIL_MONTHS_ENGLISH,
  getTamilMonthForDate,
  formatDateWithTamil,
  TAMIL_WEEKDAYS,
  getTamilWeekday,
};
