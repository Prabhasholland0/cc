import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { DEFAULT_PRICING } from '../src/data/defaultPricing';
import { CallbackRecord, EnquiryRecord, PricingConfig } from '../src/types';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, 'data');
const PRICING_FILE = path.join(DATA_DIR, 'pricing.json');
const ENQUIRIES_FILE = path.join(DATA_DIR, 'enquiries.json');
const CALLBACKS_FILE = path.join(DATA_DIR, 'callbacks.json');

// Ensure directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initialize pricing if missing or outdated
if (!fs.existsSync(PRICING_FILE)) {
  fs.writeFileSync(PRICING_FILE, JSON.stringify(DEFAULT_PRICING, null, 2), 'utf-8');
}

// Initialize enquiries if missing
if (!fs.existsSync(ENQUIRIES_FILE)) {
  fs.writeFileSync(ENQUIRIES_FILE, JSON.stringify([], null, 2), 'utf-8');
}

export function getPricing(): PricingConfig {
  try {
    const raw = fs.readFileSync(PRICING_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading pricing.json:', err);
    throw new Error('Pricing storage is unavailable');
  }
}

export function savePricing(pricing: PricingConfig): void {
  atomicWrite(PRICING_FILE, pricing);
}

export function getEnquiries(): EnquiryRecord[] {
  try {
    const raw = fs.readFileSync(ENQUIRIES_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading enquiries.json:', err);
    throw new Error('Enquiry storage unavailable');
  }
}

export function saveEnquiry(record: EnquiryRecord): EnquiryRecord {
  const all = getEnquiries();
  all.unshift(record); // newest first
  atomicWrite(ENQUIRIES_FILE, all);
  return record;
}

export function updateEnquiry(
  id: string,
  updates: Partial<Pick<EnquiryRecord, 'status' | 'adminNotes' | 'appointmentDate' | 'appointmentTime' | 'assignedTeam' | 'followUpDate' | 'updatedAt' | 'customerRequest'>>
): EnquiryRecord | null {
  const all = getEnquiries();
  const idx = all.findIndex((e) => e.id === id);
  if (idx === -1) return null;

  all[idx] = {
    ...all[idx],
    ...updates,
  };
  atomicWrite(ENQUIRIES_FILE, all);
  return all[idx];
}

export function getCallbacks(): CallbackRecord[] {
  if (!fs.existsSync(CALLBACKS_FILE)) return [];
  try {
    return JSON.parse(fs.readFileSync(CALLBACKS_FILE, 'utf-8'));
  } catch (err) {
    console.error('Error reading callbacks.json:', err);
    throw new Error('Callback storage unavailable');
  }
}

export function saveCallback(record: CallbackRecord): CallbackRecord {
  atomicWrite(CALLBACKS_FILE, [record, ...getCallbacks()]);
  return record;
}

export function updateCallback(id: string, updates: Pick<CallbackRecord, 'status' | 'updatedAt'>): CallbackRecord | null {
  const all = getCallbacks();
  const idx = all.findIndex((c) => c.id === id);
  if (idx === -1) return null;
  all[idx] = { ...all[idx], ...updates };
  atomicWrite(CALLBACKS_FILE, all);
  return all[idx];
}

function atomicWrite(file: string, data: unknown) {
  const temporary = file + '.tmp';
  fs.writeFileSync(temporary, JSON.stringify(data, null, 2), 'utf-8');
  fs.renameSync(temporary, file);
}
