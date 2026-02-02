import axios from 'axios';
import * as cheerio from 'cheerio';
import Panchangam from '../models/Panchangam.js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load panchangam data with better error handling
let panchangamData2026;
try {
  const dataPath = join(__dirname, '../data/panchangamData2026.json');
  panchangamData2026 = JSON.parse(readFileSync(dataPath, 'utf-8'));
  console.log('✓ Panchangam data loaded from JSON file');
} catch (error) {
  console.error('❌ Failed to load panchangam data:', error.message);
  panchangamData2026 = { auspiciousDates: [], inauspiciousDates: [] };
}

/**
 * Panchangam Service
 * Fetches Tamil calendar data from internet sources
 * Parses and stores auspiciousness information
 * 
 * Data Sources:
 * 1. Local JSON data (primary - from ProKerala)
 * 2. ProKerala API (fallback)
 * 3. Web scraping fallback (secondary)
 */

const PROKERALA_API = 'https://www.prokerala.com/api/panchangam/';

/**
 * Fetch panchangam data for a date range from ProKerala API
 * @param {Date} startDate - Start date for fetch
 * @param {Date} endDate - End date for fetch
 * @returns {Promise<Array>} Array of panchangam data
 */
const fetchFromProKerala = async (startDate, endDate) => {
  try {
    // Format dates as YYYY-MM-DD
    const start = startDate.toISOString().split('T')[0];
    const end = endDate.toISOString().split('T')[0];

    console.log(`🔄 Fetching panchangam from ProKerala (${start} to ${end})`);

    // ProKerala API endpoint - public API
    const response = await axios.get(
      `${PROKERALA_API}?start=${start}&end=${end}&cal_type=tamil`,
      {
        timeout: 30000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
      }
    );

    if (response.data && response.data.panchangam) {
      console.log(`✓ Fetched ${response.data.panchangam.length} days of panchangam data`);
      return response.data.panchangam;
    }

    return [];
  } catch (error) {
    console.error('ProKerala API fetch failed:', error.message);
    return [];
  }
};

/**
 * Parse and enrich panchangam data with auspiciousness indicators
 * @param {Object} rawData - Raw panchangam data from API
 * @returns {Object} Structured panchangam document
 */
const parsePanchangamData = (rawData) => {
  const doc = {
    date: new Date(rawData.date),
    tithi: rawData.tithi || '',
    nakshatra: rawData.nakshatra || '',
    festival: rawData.festival || '',
    isAmavasai: rawData.tithi?.includes('Amavasai') || false,
    isPournami: rawData.tithi?.includes('Pournami') || false,
    rawData: rawData,
  };

  // Parse time slots
  if (rawData.rahukalam) {
    doc.rahukalam = {
      startTime: rawData.rahukalam.start,
      endTime: rawData.rahukalam.end,
    };
  }

  if (rawData.yamagandam) {
    doc.yamagandam = {
      startTime: rawData.yamagandam.start,
      endTime: rawData.yamagandam.end,
    };
  }

  if (rawData.kuligai) {
    doc.kuligai = {
      startTime: rawData.kuligai.start,
      endTime: rawData.kuligai.end,
    };
  }

  // Parse auspicious times
  if (rawData.muhurtham && Array.isArray(rawData.muhurtham)) {
    doc.auspiciousTimes = rawData.muhurtham.map((m) => ({
      type: m.type || 'General',
      startTime: m.start,
      endTime: m.end,
    }));
  }

  // Mark as auspicious for marriage if flagged
  doc.isMarriageDay = rawData.is_marriage_day || false;
  doc.isAuspiciousDay = rawData.is_auspicious_day || false;

  return doc;
};

/**
 * Load panchangam from local JSON data (ProKerala 2026)
 * @param {Date} startDate - Start date for fetch
 * @param {Date} endDate - End date for fetch
 * @returns {Promise<Array>} Array of panchangam data
 */
const loadFromLocalData = async (startDate, endDate) => {
  try {
    console.log(`📄 Loading panchangam from local data`);

    const result = [];
    const start = startDate.toISOString().split('T')[0];
    const end = endDate.toISOString().split('T')[0];

    // Iterate through all dates in the range
    const current = new Date(startDate);
    while (current <= endDate) {
      const dateStr = current.toISOString().split('T')[0];
      
      // Check if date is in auspicious list
      const isAuspicious = panchangamData2026.auspiciousDates.includes(dateStr);
      // Check if date is in inauspicious list
      const isInauspicious = panchangamData2026.inauspiciousDates.includes(dateStr);

      const entry = {
        date: new Date(dateStr),
        tithi: '',
        nakshatra: '',
        festival: '',
        isAmavasai: false,
        isPournami: false,
        isMarriageDay: isAuspicious || isInauspicious,
        isAuspiciousDay: isAuspicious,
        rahukalam: null,
        yamagandam: null,
        kuligai: null,
        auspiciousTimes: [],
        rawData: { date: dateStr, is_auspicious: isAuspicious },
      };

      result.push(entry);
      current.setDate(current.getDate() + 1);
    }

    console.log(`✓ Loaded ${result.length} days from local panchangam data`);
    return result;
  } catch (error) {
    console.error('Local data load failed:', error.message);
    return [];
  }
};

/**
 * Fetch and store panchangam data for upcoming months
 * Called via cron job daily
 * @returns {Promise<Number>} Number of records upserted
 */
export const fetchAndStorePanchangam = async () => {
  try {
    const startDate = new Date();
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 365); // Fetch full year

    // Load from local JSON data first (ProKerala 2026)
    let panchangamData = await loadFromLocalData(startDate, endDate);

    if (panchangamData.length === 0) {
      console.log('⚠ No panchangam data fetched');
      return 0;
    }

    // Prepare bulk operations - upsert data
    const bulkOps = panchangamData.map((data) => ({
      updateOne: {
        filter: { date: data.date },
        update: { $set: data },
        upsert: true,
      },
    }));

    const result = await Panchangam.bulkWrite(bulkOps);

    console.log(
      `✓ Panchangam data updated: ${result.upsertedCount} inserted, ${result.modifiedCount} updated`
    );

    return result.upsertedCount + result.modifiedCount;
  } catch (error) {
    console.error('Failed to fetch and store panchangam:', error.message);
    throw error;
  }
};

/**
 * Get panchangam data for a specific date
 * @param {Date} date - Target date
 * @returns {Promise<Object>} Panchangam document
 */
export const getPanchangamForDate = async (date) => {
  try {
    const dateOnly = new Date(date);
    dateOnly.setHours(0, 0, 0, 0);

    const panchangam = await Panchangam.findOne({ date: dateOnly });
    return panchangam;
  } catch (error) {
    console.error('Error fetching panchangam for date:', error.message);
    return null;
  }
};

/**
 * Get auspicious marriage days in a date range
 * @param {Date} startDate - Range start
 * @param {Date} endDate - Range end
 * @returns {Promise<Array>} Array of auspicious dates
 */
export const getAuspiciousDays = async (startDate, endDate) => {
  try {
    const auspiciousDays = await Panchangam.find({
      date: { $gte: startDate, $lte: endDate },
      isMarriageDay: true,
      isAuspiciousDay: true,
    }).select('date festival tithi nakshatra');

    return auspiciousDays;
  } catch (error) {
    console.error('Error fetching auspicious days:', error.message);
    return [];
  }
};

/**
 * Get panchangam data for a date range (for calendar view)
 * @param {Date} startDate - Range start
 * @param {Date} endDate - Range end
 * @returns {Promise<Array>} Array of panchangam records
 */
export const getPanchangamRange = async (startDate, endDate) => {
  try {
    const panchangamData = await Panchangam.find({
      date: { $gte: startDate, $lte: endDate },
    }).lean();

    return panchangamData;
  } catch (error) {
    console.error('Error fetching panchangam range:', error.message);
    return [];
  }
};

/**
 * Initialize panchangam data on startup
 * Ensures panchangam data is loaded into MongoDB on server start
 */
export const initializePanchangamData = async () => {
  try {
    console.log('Initializing panchangam data...');
    const count = await Panchangam.countDocuments();
    
    if (count < 100) { // If less than 100 records, reload all data
      console.log('Loading panchangam data into database...');
      await fetchAndStorePanchangam();
    } else {
      console.log(`✓ Panchangam data already loaded (${count} records)`);
    }
  } catch (error) {
    console.error('❌ Failed to initialize panchangam data:', error.message);
  }
};

export default {
  fetchAndStorePanchangam,
  getPanchangamForDate,
  getAuspiciousDays,
  getPanchangamRange,
  initializePanchangamData,
};
