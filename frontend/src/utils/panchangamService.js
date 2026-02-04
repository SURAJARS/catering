/**
 * Panchangam Service
 * Fetches and manages panchangam data from backend API
 */

const API_BASE = import.meta.env.VITE_API_URL || 'https://catering-guhq.onrender.com/api';

/**
 * Get panchangam data for a date range
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {Promise<Array>} Array of panchangam data
 */
export const getPanchangamRange = async (startDate, endDate) => {
  try {
    const start = startDate.toISOString().split('T')[0];
    const end = endDate.toISOString().split('T')[0];
    
    console.log(`Fetching panchangam from ${start} to ${end}...`);
    
    const response = await fetch(
      `${API_BASE}/panchangam/range?startDate=${start}&endDate=${end}`
    );
    
    if (!response.ok) {
      console.error(`HTTP ${response.status}: ${response.statusText}`);
      throw new Error(`HTTP ${response.status}`);
    }
    
    const jsonData = await response.json();
    console.log('Panchangam response:', jsonData);
    
    return jsonData.data || [];
  } catch (error) {
    console.error('Failed to fetch panchangam data:', error);
    return [];
  }
};

/**
 * Get panchangam data for a specific date
 * @param {Date} date - The date
 * @returns {Promise<Object>} Panchangam object
 */
export const getPanchangamForDate = async (date) => {
  try {
    const dateStr = date.toISOString().split('T')[0];
    const response = await fetch(`${API_BASE}/panchangam/date/${dateStr}`);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const data = await response.json();
    return data.data || null;
  } catch (error) {
    console.error('Failed to fetch panchangam for date:', error);
    return null;
  }
};

/**
 * Get auspicious days for a date range
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {Promise<Array>} Array of auspicious day objects
 */
export const getAuspiciousDays = async (startDate, endDate) => {
  try {
    const start = startDate.toISOString().split('T')[0];
    const end = endDate.toISOString().split('T')[0];
    
    const response = await fetch(
      `${API_BASE}/panchangam/auspicious-days?startDate=${start}&endDate=${end}`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Failed to fetch auspicious days:', error);
    return [];
  }
};

/**
 * Cache panchangam data by month to reduce API calls
 */
const panchangamCache = new Map();

/**
 * Get panchangam data for a month (with caching)
 * @param {Date} date - Any date in the month
 * @returns {Promise<Object>} Map of date string to panchangam data
 */
export const getPanchangamForMonth = async (date) => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const cacheKey = `${year}-${month}`;
  
  // Return cached data if available
  if (panchangamCache.has(cacheKey)) {
    return panchangamCache.get(cacheKey);
  }
  
  try {
    // Get first and last day of month
    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 0);
    
    const panchangamData = await getPanchangamRange(startDate, endDate);
    
    console.log(`Creating map for ${panchangamData.length} panchangam records...`);
    
    // Create map for easy access by date
    const dataMap = new Map();
    panchangamData.forEach((item) => {
      // Handle both string and Date objects from API
      let dateKey;
      if (typeof item.date === 'string') {
        dateKey = item.date.split('T')[0]; // Already in YYYY-MM-DD format
      } else {
        dateKey = new Date(item.date).toISOString().split('T')[0];
      }
      dataMap.set(dateKey, item);
      console.log(`Mapped ${dateKey}:`, { isPournami: item.isPournami, isAmavasai: item.isAmavasai, isAuspicious: item.isAuspiciousDay });
    });
    
    console.log(`Panchangam map created with ${dataMap.size} entries`);
    
    // Cache the result
    panchangamCache.set(cacheKey, dataMap);
    
    return dataMap;
  } catch (error) {
    console.error('Failed to get panchangam for month:', error);
    return new Map();
  }
};

/**
 * Clear panchangam cache
 */
export const clearPanchangamCache = () => {
  panchangamCache.clear();
};

/**
 * Get astrological information for a date
 * @param {Date} date - The date
 * @param {Map} panchangamMap - Panchangam data map
 * @returns {Object} Astrological info
 */
export const getAstrologicalInfo = (date, panchangamMap) => {
  const dateKey = date.toISOString().split('T')[0];
  const panchangam = panchangamMap?.get(dateKey);
  
  // Always return hasData true for now to show icons
  // Fallback to marking as non-auspicious if no data
  if (!panchangam) {
    return {
      hasData: true, // Show UI elements even without data
      isPournami: false,
      isAmavasai: false,
      isAuspicious: false,
      festival: null,
      tithi: null,
    };
  }
  
  return {
    hasData: true,
    isPournami: panchangam.isPournami || false,
    isAmavasai: panchangam.isAmavasai || false,
    isAuspicious: panchangam.isAuspiciousDay || false,
    festival: panchangam.festival || null,
    tithi: panchangam.tithi || null,
    nakshatra: panchangam.nakshatra || null,
    auspiciousTimes: panchangam.auspiciousTimes || [],
  };
};

export default {
  getPanchangamRange,
  getPanchangamForDate,
  getAuspiciousDays,
  getPanchangamForMonth,
  getAstrologicalInfo,
  clearPanchangamCache,
};
