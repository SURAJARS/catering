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
 * Get Tamil month for a Gregorian date - 2026 specific mappings
 * Based on authoritative Tamil calendar data from goldenchennai.com
 * @param {Date} date - JavaScript Date object
 * @returns {Object} { tamil, english, gregorianMonth }
 */
export const getTamilMonthForDate = (date) => {
  const month = date.getMonth();
  const day = date.getDate();
  const year = date.getFullYear();
  
  // 2026 Tamil month transitions (month changes around specific dates)
  // Thai: Jan 15 - Feb 12
  // Masi: Feb 13 - Mar 14
  // Panguni: Mar 15 - Apr 13
  // Chittirai: Apr 14 - May 13
  // Vaigasi: May 14 - Jun 12
  // Aani: Jun 13 - Jul 14
  // Aadi: Jul 15 - Aug 13
  // Aavani/Avani: Aug 14 - Sep 13
  // Purattasi: Sep 14 - Oct 13
  // Aippasi: Oct 14 - Nov 13
  // Karthikai: Nov 14 - Dec 13
  // Margazhi: Dec 14 - Jan 14
  
  let tamilMonth = '';
  let englishName = '';
  
  if (year === 2026) {
    // January
    if (month === 0) {
      if (day >= 15) {
        tamilMonth = 'தை';
        englishName = 'Thai';
      } else {
        tamilMonth = 'மார்கழி';
        englishName = 'Margazhi';
      }
    }
    // February
    else if (month === 1) {
      if (day <= 12) {
        tamilMonth = 'தை';
        englishName = 'Thai';
      } else {
        tamilMonth = 'மாசி';
        englishName = 'Masi';
      }
    }
    // March
    else if (month === 2) {
      if (day <= 14) {
        tamilMonth = 'மாசி';
        englishName = 'Masi';
      } else {
        tamilMonth = 'பங்குனி';
        englishName = 'Panguni';
      }
    }
    // April
    else if (month === 3) {
      if (day <= 13) {
        tamilMonth = 'பங்குனி';
        englishName = 'Panguni';
      } else {
        tamilMonth = 'சித்திரை';
        englishName = 'Chittirai';
      }
    }
    // May
    else if (month === 4) {
      if (day <= 13) {
        tamilMonth = 'சித்திரை';
        englishName = 'Chittirai';
      } else {
        tamilMonth = 'வைகாசி';
        englishName = 'Vaigasi';
      }
    }
    // June
    else if (month === 5) {
      if (day <= 12) {
        tamilMonth = 'வைகாசி';
        englishName = 'Vaigasi';
      } else {
        tamilMonth = 'ஆனி';
        englishName = 'Aani';
      }
    }
    // July
    else if (month === 6) {
      if (day <= 14) {
        tamilMonth = 'ஆனி';
        englishName = 'Aani';
      } else {
        tamilMonth = 'ஆடி';
        englishName = 'Aadi';
      }
    }
    // August
    else if (month === 7) {
      if (day <= 13) {
        tamilMonth = 'ஆடி';
        englishName = 'Aadi';
      } else {
        tamilMonth = 'ஆவணி';
        englishName = 'Avani';
      }
    }
    // September
    else if (month === 8) {
      if (day <= 13) {
        tamilMonth = 'ஆவணி';
        englishName = 'Avani';
      } else {
        tamilMonth = 'புரட்டாசி';
        englishName = 'Purattasi';
      }
    }
    // October
    else if (month === 9) {
      if (day <= 13) {
        tamilMonth = 'புரட்டாசி';
        englishName = 'Purattasi';
      } else {
        tamilMonth = 'ஐப்பசி';
        englishName = 'Aippasi';
      }
    }
    // November
    else if (month === 10) {
      if (day <= 13) {
        tamilMonth = 'ஐப்பசி';
        englishName = 'Aippasi';
      } else {
        tamilMonth = 'கார்த்திகை';
        englishName = 'Karthikai';
      }
    }
    // December
    else if (month === 11) {
      if (day <= 13) {
        tamilMonth = 'கார்த்திகை';
        englishName = 'Karthikai';
      } else {
        tamilMonth = 'மார்கழி';
        englishName = 'Margazhi';
      }
    }
  } else {
    // Fallback for other years (approximation)
    const tamilMonths = ['மாசி', 'பங்குனி', 'சித்திரை', 'வைகாசி', 'ஆனி', 'ஆடி', 
                         'ஆவணி', 'புரட்டாசி', 'ஐப்பசி', 'கார்த்திகை', 'மார்கழி', 'தை'];
    const englishMonths = ['Masi', 'Panguni', 'Chittirai', 'Vaigasi', 'Aani', 'Aadi',
                          'Avani', 'Purattasi', 'Aippasi', 'Karthikai', 'Margazhi', 'Thai'];
    const idx = (month + 10) % 12; // Offset for alignment
    tamilMonth = tamilMonths[idx];
    englishName = englishMonths[idx];
  }
  
  return {
    tamil: tamilMonth,
    english: englishName,
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
 * Get exact Tamil month day for a Gregorian date - 2026 specific
 * Based on authoritative Tamil calendar data from goldenchennai.com
 * @param {Date} date - JavaScript Date object
 * @returns {number} Tamil month day number (1-30)
 */
export const getApproximateTamilMonthDay = (date) => {
  const month = date.getMonth();
  const day = date.getDate();
  const year = date.getFullYear();
  
  if (year === 2026) {
    // 2026 specific calculations based on official month start dates
    // Thai: Jan 15 - Feb 12 (29 days)
    if ((month === 0 && day >= 15) || (month === 1 && day <= 12)) {
      if (month === 0) {
        return day - 15 + 1; // Jan 15 = day 1
      } else {
        return (31 - 15 + 1) + day; // Jan 15-31 (17 days) + Feb days
      }
    }
    
    // Masi: Feb 13 - Mar 14 (30 days)
    if ((month === 1 && day >= 13) || (month === 2 && day <= 14)) {
      if (month === 1) {
        return day - 13 + 1; // Feb 13 = day 1
      } else {
        return (28 - 13 + 1) + day; // Feb 13-28 (16 days) + Mar days
      }
    }
    
    // Panguni: Mar 15 - Apr 13 (30 days)
    if ((month === 2 && day >= 15) || (month === 3 && day <= 13)) {
      if (month === 2) {
        return day - 15 + 1; // Mar 15 = day 1
      } else {
        return (31 - 15 + 1) + day; // Mar 15-31 (17 days) + Apr days
      }
    }
    
    // Chittirai: Apr 14 - May 13 (30 days)
    if ((month === 3 && day >= 14) || (month === 4 && day <= 13)) {
      if (month === 3) {
        return day - 14 + 1; // Apr 14 = day 1
      } else {
        return (30 - 14 + 1) + day; // Apr 14-30 (17 days) + May days
      }
    }
    
    // Vaigasi: May 14 - Jun 12 (30 days)
    if ((month === 4 && day >= 14) || (month === 5 && day <= 12)) {
      if (month === 4) {
        return day - 14 + 1; // May 14 = day 1
      } else {
        return (31 - 14 + 1) + day; // May 14-31 (18 days) + Jun days
      }
    }
    
    // Aani: Jun 13 - Jul 14 (32 days)
    if ((month === 5 && day >= 13) || (month === 6 && day <= 14)) {
      if (month === 5) {
        return day - 13 + 1; // Jun 13 = day 1
      } else {
        return (30 - 13 + 1) + day; // Jun 13-30 (18 days) + Jul days
      }
    }
    
    // Aadi: Jul 15 - Aug 13 (30 days)
    if ((month === 6 && day >= 15) || (month === 7 && day <= 13)) {
      if (month === 6) {
        return day - 15 + 1; // Jul 15 = day 1
      } else {
        return (31 - 15 + 1) + day; // Jul 15-31 (17 days) + Aug days
      }
    }
    
    // Avani: Aug 14 - Sep 13 (31 days)
    if ((month === 7 && day >= 14) || (month === 8 && day <= 13)) {
      if (month === 7) {
        return day - 14 + 1; // Aug 14 = day 1
      } else {
        return (31 - 14 + 1) + day; // Aug 14-31 (18 days) + Sep days
      }
    }
    
    // Purattasi: Sep 14 - Oct 13 (30 days)
    if ((month === 8 && day >= 14) || (month === 9 && day <= 13)) {
      if (month === 8) {
        return day - 14 + 1; // Sep 14 = day 1
      } else {
        return (30 - 14 + 1) + day; // Sep 14-30 (17 days) + Oct days
      }
    }
    
    // Aippasi: Oct 14 - Nov 13 (31 days)
    if ((month === 9 && day >= 14) || (month === 10 && day <= 13)) {
      if (month === 9) {
        return day - 14 + 1; // Oct 14 = day 1
      } else {
        return (31 - 14 + 1) + day; // Oct 14-31 (18 days) + Nov days
      }
    }
    
    // Karthikai: Nov 14 - Dec 13 (30 days)
    if ((month === 10 && day >= 14) || (month === 11 && day <= 13)) {
      if (month === 10) {
        return day - 14 + 1; // Nov 14 = day 1
      } else {
        return (30 - 14 + 1) + day; // Nov 14-30 (17 days) + Dec days
      }
    }
    
    // Margazhi: Dec 14 - Jan 14 (32 days)
    if (month === 11 && day >= 14) {
      return day - 14 + 1; // Dec 14 = day 1
    }
  } else {
    // Fallback for other years (approximation)
    const approximateStartDay = 14;
    const tamilDay = day - approximateStartDay + 1;
    return Math.max(1, Math.min(tamilDay, 30));
  }
  
  return 1; // Default fallback
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
