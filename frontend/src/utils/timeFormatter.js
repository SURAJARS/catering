/**
 * Time Formatter Utilities
 * Convert between 24-hour and 12-hour (AM/PM) formats
 */

/**
 * Convert 24-hour format to 12-hour AM/PM format
 * @param {string} time24 - Time in HH:MM format (24-hour)
 * @returns {string} Time in HH:MM AM/PM format
 */
export const formatTo12Hour = (time24) => {
  if (!time24) return '';
  
  const [hours, minutes] = time24.split(':');
  let hour = parseInt(hours, 10);
  const period = hour >= 12 ? 'PM' : 'AM';
  
  if (hour > 12) {
    hour -= 12;
  } else if (hour === 0) {
    hour = 12;
  }
  
  return `${String(hour).padStart(2, '0')}:${minutes} ${period}`;
};

/**
 * Convert 12-hour AM/PM format to 24-hour format
 * @param {string} time12 - Time in HH:MM AM/PM format
 * @returns {string} Time in HH:MM format (24-hour)
 */
export const formatTo24Hour = (time12) => {
  if (!time12) return '';
  
  const [time, period] = time12.split(' ');
  let [hours, minutes] = time.split(':');
  hours = parseInt(hours, 10);
  
  if (period === 'PM' && hours !== 12) {
    hours += 12;
  } else if (period === 'AM' && hours === 12) {
    hours = 0;
  }
  
  return `${String(hours).padStart(2, '0')}:${minutes}`;
};

export default {
  formatTo12Hour,
  formatTo24Hour,
};
