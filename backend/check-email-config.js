#!/usr/bin/env node
import dotenv from 'dotenv';

dotenv.config();

console.log('=== Email Configuration Check ===');
console.log('EMAIL_USER:', process.env.EMAIL_USER);
console.log('EMAIL_PASSWORD:', process.env.EMAIL_PASSWORD ? '✓ Set (length: ' + process.env.EMAIL_PASSWORD.length + ')' : '✗ Not set');
console.log('ADMIN_EMAIL:', process.env.ADMIN_EMAIL);
console.log('EMAIL_FROM_NAME:', process.env.EMAIL_FROM_NAME);

if (process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
  console.log('\n✓ Email credentials are properly loaded!');
} else {
  console.log('\n✗ Email credentials are MISSING!');
}
