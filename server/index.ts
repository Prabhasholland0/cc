import 'dotenv/config';
import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import path from 'node:path';
import fs from 'node:fs';
import { randomUUID, timingSafeEqual } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { z } from 'zod';
import { getCallbacks, getEnquiries, getPricing, saveCallback, saveEnquiry, savePricing, updateCallback, updateEnquiry } from './storage';
import { calculateQuote, indiaDate, startingRate } from '../src/lib/pricing';
import { CALLBACK_TIMES } from '../src/types';
import { alertCallback, alertCustomerChange, alertNewBooking, alertsConfigured } from './alerts';
import type { CallbackRecord, EnquiryRecord, TrackedBooking } from '../src/types';
const directory = path.dirname(fileURLToPath(import.meta.url));
const app = express();
app.use(express.json({ limit: '250kb' }));
// The server listens on loopback behind a reverse proxy; trust it so req.ip is the visitor's address.
app.set('trust proxy', 'loopback');
// Simple in-memory limiter per visitor IP: `max` counted events per `windowMs`.
function limiter(max: number, windowMs: number) {
  const hits = new Map<string, { count: number; since: number }>();
  const current = (req: Request) => { const key = req.ip || 'unknown'; const entry = hits.get(key); if (entry && Date.now() - entry.since > windowMs) { hits.delete(key); return undefined; } return entry; };
  return {
    allowed: (req: Request) => (current(req)?.count ?? 0) < max,
    hit: (req: Request) => { const entry = current(req); hits.set(req.ip || 'unknown', entry ? { ...entry, count: entry.count + 1 } : { count: 1, since: Date.now() }); },
  };
}
const staffFailures = limiter(10, 15 * 60_000);
const newBookings = limiter(10, 60 * 60_000);
const newCallbacks = limiter(5, 60 * 60_000);
const tooMany = (res: Response, message: string) => res.status(429).json({ error: message });
const secret = process.env.ADMIN_SECRET;
function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const token = req.header('x-admin-token');
  if (!secret) { res.status(503).json({ error: 'Staff access is not configured. Set ADMIN_SECRET on the server.' }); return; }
  if (!staffFailures.allowed(req)) { tooMany(res, 'Too many wrong passcodes. Staff login is locked for 15 minutes on this network.'); return; }
  if (!token || Buffer.byteLength(token) !== Buffer.byteLength(secret) || !timingSafeEqual(Buffer.from(token), Buffer.from(secret))) { staffFailures.hit(req); res.status(401).json({ error: 'Invalid staff credentials.' }); return; }
  next();
}
const date = z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine(value => !Number.isNaN(Date.parse(value)) && new Date(value).toISOString().slice(0, 10) === value, 'Enter a valid date');
const optionalDate = z.union([date, z.literal('')]).optional();
const selectionSchema = z.object({ serviceId: z.string(), quantities: z.record(z.string(), z.number().int().min(0).max(100000)), priority: z.boolean(), extraBathrooms: z.number().int().min(0).max(20).optional() });
const enquirySchema = z.object({
  requestId: z.string().uuid(), selection: selectionSchema,
  customerName: z.string().trim().min(2).max(100), phone: z.string().regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit mobile number'),
  address: z.string().trim().min(5).max(500), area: z.string().trim().min(2).max(100),
  preferredDate: date.refine(value => value >= indiaDate(), 'Choose today or a future date'), preferredTimeSlot: z.enum(['Morning: 9am–12pm', 'Afternoon: 1pm–4pm', 'Late afternoon: 4pm–7pm']),
  notes: z.string().max(2000).optional(), estimatedPrice: z.number().finite().nonnegative(),
});
const updateSchema = z.object({
  status: z.enum(['new', 'contacted', 'inspection_scheduled', 'service_confirmed', 'completed', 'cancelled']).optional(),
  adminNotes: z.string().max(5000).optional(), appointmentDate: optionalDate, appointmentTime: z.string().max(100).optional(), assignedTeam: z.string().max(100).optional(), followUpDate: optionalDate,
  customerRequestHandled: z.boolean().optional(),
}).strict();
const price = z.number().finite().nonnegative();
const packageSchema = z.object({ id: z.string().min(1), name: z.string().min(1), unit: z.string(), price, description: z.string(), popular: z.boolean().optional(), features: z.array(z.string()), requiresInspection: z.boolean().optional() });
const serviceSchema = z.object({ id: z.string().min(1), title: z.string().min(1), tagline: z.string(), category: z.enum(['housekeeping', 'deep-cleaning', 'restoration', 'add-on']), badge: z.string().optional(), startingPrice: price, unitLabel: z.string(), summary: z.string(), image: z.string(), inclusions: z.array(z.string()), exclusions: z.array(z.string()), equipment: z.array(z.string()), durationEst: z.string(), inspectionRequired: z.boolean(), minOrderAmount: price, packages: z.array(packageSchema).min(1).refine(items => new Set(items.map(item => item.id)).size === items.length, 'Duplicate package IDs') });
const pricingSchema = z.object({ lastUpdated: z.string(), updatedBy: z.string(), minimumOrderThreshold: price, emergencyFee: price, inspectionPolicy: z.string(), services: z.array(serviceSchema).min(1).refine(items => new Set(items.map(item => item.id)).size === items.length, 'Duplicate service IDs') });
app.get('/api/health', (_req, res) => res.json({ status: 'healthy', businessLocation: 'Sainikpuri, Secunderabad, Telangana – 500094', phones: ['95154 47834', '93914 59522'] }));
app.get('/api/pricing', (_req, res) => { res.set('Cache-Control', 'no-store').json(getPricing()); });
app.put('/api/pricing', requireAdmin, (req, res) => {
  const parsed = pricingSchema.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: 'Check package prices, minimums, and fees. All must be valid nonnegative numbers.', issues: parsed.error.issues }); return; }
  const pricing = { ...parsed.data, lastUpdated: new Date().toISOString(), services: parsed.data.services.map(service => ({ ...service, startingPrice: startingRate(service) })) };
  savePricing(pricing); res.json({ success: true, pricing });
});
function receipt(res: Response, record: EnquiryRecord, status = 201) { res.status(status).json({ success: true, enquiryId: record.id, type: 'enquiry_received', notice: 'Enquiry received. Our team will contact you to confirm availability, scope, and price. This is not a confirmed appointment.', details: record }); }
app.post('/api/enquiries', (req, res) => {
  const parsed = enquirySchema.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: 'Please check your request details.', issues: parsed.error.issues.map(issue => ({ field: issue.path.join('.'), message: issue.message })) }); return; }
  const input = parsed.data;
  const existing = getEnquiries().find(record => record.requestId === input.requestId);
  if (existing) {
    const fields = ['selection', 'customerName', 'phone', 'address', 'area', 'preferredDate', 'preferredTimeSlot', 'notes'] as const;
    if (fields.some(key => JSON.stringify(existing[key]) !== JSON.stringify(input[key]))) { res.status(409).json({ error: `An earlier version of this request was already saved as ${existing.id}. Please call us with that reference to change its details.` }); return; }
    receipt(res, existing, 200); return;
  }
  if (!newBookings.allowed(req)) { tooMany(res, 'We’ve received several bookings from this network in the last hour. Please call 95154 47834 or message us on WhatsApp to book.'); return; }
  let quote;
  try { quote = calculateQuote(getPricing(), input.selection); } catch (error) { res.status(400).json({ error: (error as Error).message }); return; }
  if (Math.abs(quote.total - input.estimatedPrice) > 0.01) { res.status(409).json({ error: 'Pricing has changed. Please close this form and refresh the page to review current rates before submitting.' }); return; }
  const record: EnquiryRecord = { ...input, id: `CC-${randomUUID().slice(0, 8).toUpperCase()}`, createdAt: new Date().toISOString(), status: 'new', serviceId: quote.service.id, serviceName: quote.service.title, packageName: quote.scope, customScope: quote.scope, estimatedPrice: quote.total };
  saveEnquiry(record); newBookings.hit(req); alertNewBooking(record); receipt(res, record);
});
const callbackSchema = z.object({
  requestId: z.string().uuid(), name: z.string().trim().min(2).max(100), phone: z.string().regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit mobile number'),
  preferredTime: z.enum(CALLBACK_TIMES), serviceId: z.string().max(60).optional(), website: z.string().max(0).optional(),
});
app.post('/api/callbacks', (req, res) => {
  const parsed = callbackSchema.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: 'Please check your name and mobile number.', issues: parsed.error.issues.map(issue => ({ field: issue.path.join('.'), message: issue.message })) }); return; }
  const { website: _honeypot, ...input } = parsed.data;
  const existing = getCallbacks().find(record => record.requestId === input.requestId);
  if (existing) { res.status(200).json({ success: true, callbackId: existing.id }); return; }
  if (!newCallbacks.allowed(req)) { tooMany(res, 'We’ve received several callback requests from this network. Please call 95154 47834 or message us on WhatsApp.'); return; }
  const serviceId = getPricing().services.some(service => service.id === input.serviceId) ? input.serviceId : undefined;
  const record: CallbackRecord = { ...input, serviceId, id: `CB-${randomUUID().slice(0, 8).toUpperCase()}`, createdAt: new Date().toISOString(), status: 'new' };
  saveCallback(record); newCallbacks.hit(req); alertCallback(record, getPricing().services.find(service => service.id === serviceId)?.title); res.status(201).json({ success: true, callbackId: record.id });
});
app.get('/api/callbacks', requireAdmin, (_req, res) => res.json(getCallbacks()));
app.patch('/api/callbacks/:id', requireAdmin, (req, res) => {
  const parsed = z.object({ status: z.enum(['new', 'called']) }).strict().safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: 'Invalid callback status.' }); return; }
  const record = updateCallback(String(req.params.id), { ...parsed.data, updatedAt: new Date().toISOString() });
  if (!record) { res.status(404).json({ error: 'Callback request not found.' }); return; }
  res.json({ success: true, callback: record });
});
// ---- Customer booking tracking (reference + mobile number, no account) ----
const trackSchema = z.object({ reference: z.string().trim().toUpperCase().regex(/^CC-[0-9A-F]{8}$/, 'Enter your booking reference, e.g. CC-1A2B3C4D'), phone: z.string().regex(/^[6-9]\d{9}$/, 'Enter the 10-digit mobile number used for the booking') });
const changeSchema = trackSchema.extend({
  type: z.enum(['cancel', 'reschedule']), reason: z.string().trim().max(500).optional(),
  preferredDate: date.refine(value => value > indiaDate(), 'Choose a date from tomorrow onwards').optional(), preferredTimeSlot: enquirySchema.shape.preferredTimeSlot.optional(),
}).refine(value => value.type === 'cancel' || (value.preferredDate && value.preferredTimeSlot), { message: 'Choose a new date and time', path: ['preferredDate'] });
const failedLookups = new Map<string, { count: number; since: number }>();
function lookupAllowed(req: Request) {
  const key = req.ip || 'unknown'; const entry = failedLookups.get(key);
  if (!entry || Date.now() - entry.since > 15 * 60_000) { failedLookups.delete(key); return true; }
  return entry.count < 10;
}
function lookupFailed(req: Request) {
  const key = req.ip || 'unknown'; const entry = failedLookups.get(key);
  failedLookups.set(key, entry && Date.now() - entry.since <= 15 * 60_000 ? { ...entry, count: entry.count + 1 } : { count: 1, since: Date.now() });
}
// Online changes close on the visit day (the policy needs 3 hours' notice), and after completion or cancellation.
const canChangeOnline = (record: EnquiryRecord) => !['completed', 'cancelled'].includes(record.status) && (record.appointmentDate || record.preferredDate) > indiaDate();
const publicView = (record: EnquiryRecord): TrackedBooking => ({ id: record.id, serviceName: record.serviceName, packageName: record.packageName, estimatedPrice: record.estimatedPrice, status: record.status, createdAt: record.createdAt, preferredDate: record.preferredDate, preferredTimeSlot: record.preferredTimeSlot, appointmentDate: record.appointmentDate, appointmentTime: record.appointmentTime, customerRequest: record.customerRequest, canChangeOnline: canChangeOnline(record) });
function findBooking(req: Request, res: Response, input: { reference: string; phone: string }) {
  if (!lookupAllowed(req)) { res.status(429).json({ error: 'Too many attempts. Please wait 15 minutes or call 95154 47834.' }); return undefined; }
  const record = getEnquiries().find(item => item.id === input.reference && item.phone === input.phone);
  if (!record) { lookupFailed(req); res.status(404).json({ error: 'We couldn’t find a booking with that reference and mobile number. Please check both, or call 95154 47834.' }); return undefined; }
  return record;
}
const issues = (error: z.ZodError) => error.issues.map(issue => ({ field: issue.path.join('.'), message: issue.message }));
app.post('/api/track', (req, res) => {
  const parsed = trackSchema.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: 'Please check your reference and mobile number.', issues: issues(parsed.error) }); return; }
  const record = findBooking(req, res, parsed.data);
  if (record) res.set('Cache-Control', 'no-store').json({ success: true, booking: publicView(record) });
});
app.post('/api/track/change', (req, res) => {
  const parsed = changeSchema.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: 'Please check the details of your request.', issues: issues(parsed.error) }); return; }
  const record = findBooking(req, res, parsed.data);
  if (!record) return;
  if (!canChangeOnline(record)) { res.status(409).json({ error: record.status === 'cancelled' ? 'This booking is already cancelled.' : record.status === 'completed' ? 'This booking is already completed.' : 'Changes on the day of your visit need at least 3 hours’ notice. Please call 95154 47834.' }); return; }
  const { type, reason, preferredDate, preferredTimeSlot } = parsed.data;
  const customerRequest = { type, reason: reason || undefined, preferredDate: type === 'reschedule' ? preferredDate : undefined, preferredTimeSlot: type === 'reschedule' ? preferredTimeSlot : undefined, createdAt: new Date().toISOString(), handled: false };
  const updated = updateEnquiry(record.id, { customerRequest, ...(type === 'cancel' ? { status: 'cancelled' as const } : {}), updatedAt: new Date().toISOString() });
  alertCustomerChange(updated!);
  res.json({ success: true, booking: publicView(updated!) });
});
app.get('/api/enquiries', requireAdmin, (_req, res) => res.json(getEnquiries()));
app.patch('/api/enquiries/:id', requireAdmin, (req, res) => {
  const parsed = updateSchema.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: 'Invalid status, date, or follow-up fields.' }); return; }
  const current = getEnquiries().find(record => record.id === req.params.id);
  if (!current) { res.status(404).json({ error: 'Enquiry not found.' }); return; }
  const { customerRequestHandled, ...changes } = parsed.data;
  const next = { ...current, ...changes };
  if (next.status === 'service_confirmed' && (!next.appointmentDate || !next.appointmentTime?.trim())) { res.status(400).json({ error: 'Save an agreed appointment date and time before confirming.' }); return; }
  const customerRequest = current.customerRequest && customerRequestHandled !== undefined ? { ...current.customerRequest, handled: customerRequestHandled } : current.customerRequest;
  const record = updateEnquiry(String(req.params.id), { ...changes, customerRequest, updatedAt: new Date().toISOString() });
  res.json({ success: true, enquiry: record });
});
app.get('/api/enquiries/export', requireAdmin, (_req, res) => {
  const fields: (keyof EnquiryRecord)[] = ['id', 'createdAt', 'customerName', 'phone', 'area', 'address', 'serviceName', 'packageName', 'estimatedPrice', 'preferredDate', 'preferredTimeSlot', 'status', 'appointmentDate', 'appointmentTime', 'assignedTeam', 'followUpDate', 'adminNotes'];
  const cell = (value: unknown) => { let text = String(value ?? ''); if (/^[=+@\-\t\r]/.test(text)) text = "'" + text; return '"' + text.replace(/"/g, '""') + '"'; };
  res.type('text/csv').attachment('clean-corners-enquiries.csv').send([fields.join(','), ...getEnquiries().map(record => fields.map(field => cell(record[field])).join(','))].join('\n'));
});
app.get('/api/audit', requireAdmin, (_req, res) => res.json({ status: 'manual_review_required', timestamp: new Date().toISOString(), notice: 'Local checks do not verify public hosting, HTTPS, customer consent, or business claims. Review these before launch.' }));
app.use('/api', (_req, res) => res.status(404).json({ error: 'API route not found' }));
const dist = path.join(directory, '..', 'dist');
if (fs.existsSync(dist)) {
  app.get(['/services/:id', '/areas/:id'], (req, res, next) => {
    const page = path.join(dist, req.path.startsWith('/areas/') ? 'areas' : 'services', path.basename(String(req.params.id)), 'index.html');
    if (fs.existsSync(page)) res.sendFile(page); else next();
  });
  app.use(express.static(dist, { redirect: false })); app.get('/{*path}', (_req, res) => res.sendFile(path.join(dist, 'index.html'))); }
app.use((error: Error, _req: Request, res: Response, _next: NextFunction) => { console.error(error.message); res.status(500).json({ error: 'Unable to save or load data. Please retry or contact the team.' }); });
app.listen(Number(process.env.PORT || 3001), '127.0.0.1', () => {
  console.log(`Clean Corners running on http://127.0.0.1:${process.env.PORT || 3001}`);
  console.log(alertsConfigured() ? `Email alerts on: sending to ${process.env.ALERT_EMAIL_TO}` : 'Email alerts off: set SMTP_USER, SMTP_PASS and ALERT_EMAIL_TO to turn them on.');
});
