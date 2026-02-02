#!/usr/bin/env node
import dotenv from 'dotenv';
import connectDB from './src/config/database.js';
import { fetchAndStorePanchangam } from './src/services/panchangamService.js';

dotenv.config();
await connectDB();

console.log('Loading panchangam data for 2026...');
await fetchAndStorePanchangam();
console.log('Done!');
process.exit(0);
