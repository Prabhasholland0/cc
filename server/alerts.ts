// Email alerts to the owner for new bookings, callback requests and customer changes.
// Configure with SMTP_USER, SMTP_PASS and ALERT_EMAIL_TO (see README). Without them, alerts are skipped.
import nodemailer from 'nodemailer';
import type { CallbackRecord, EnquiryRecord } from '../src/types';

const user = process.env.SMTP_USER;
const pass = process.env.SMTP_PASS;
const to = process.env.ALERT_EMAIL_TO;
const siteUrl = (process.env.SITE_URL || 'https://cleancorners.in').replace(/\/$/, '');
const transport = user && pass && to ? nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: Number(process.env.SMTP_PORT || 465),
  secure: Number(process.env.SMTP_PORT || 465) === 465,
  auth: { user, pass },
}) : null;

export const alertsConfigured = () => !!transport;
const rupees = (value: number) => `₹${value.toLocaleString('en-IN')}`;

function send(subject: string, lines: (string | false | undefined)[]) {
  if (!transport) return;
  const text = [...lines.filter(Boolean), '', `Open the staff portal: ${siteUrl}/ (Staff login)`].join('\n');
  // Never block or fail the customer's request because an email could not be sent.
  transport.sendMail({ from: process.env.ALERT_EMAIL_FROM || `Clean Corners Website <${user}>`, to, subject, text })
    .catch(error => console.error('Alert email failed:', (error as Error).message));
}

export function alertNewBooking(record: EnquiryRecord) {
  send(`New booking ${record.id}: ${record.serviceName} · ${record.customerName}`, [
    `New booking request ${record.id}`, '',
    `Customer: ${record.customerName}`, `Phone: ${record.phone}  (call: tel:+91${record.phone})`,
    `Area: ${record.area}`, `Address: ${record.address}`, '',
    `Service: ${record.serviceName}`, `Scope: ${record.packageName}`, `Estimate: ${rupees(record.estimatedPrice)}`,
    `Preferred: ${record.preferredDate}, ${record.preferredTimeSlot}`,
    record.notes && `Notes: ${record.notes}`,
  ]);
}

export function alertCallback(record: CallbackRecord, serviceName?: string) {
  send(`Callback request: ${record.name} · ${record.phone}`, [
    `Please call back ${record.name} on ${record.phone}  (tel:+91${record.phone})`,
    `Best time: ${record.preferredTime}`, `Service: ${serviceName || 'Not specified'}`, `Reference: ${record.id}`,
  ]);
}

export function alertCustomerChange(record: EnquiryRecord) {
  const request = record.customerRequest;
  if (!request) return;
  const cancelled = request.type === 'cancel';
  send(`${cancelled ? 'Cancelled' : 'Reschedule request'}: ${record.id} · ${record.customerName}`, [
    cancelled ? `${record.customerName} cancelled booking ${record.id} online.` : `${record.customerName} asked to reschedule booking ${record.id}.`,
    `Phone: ${record.phone}  (tel:+91${record.phone})`, `Service: ${record.serviceName}`,
    record.appointmentDate ? `Confirmed visit was: ${record.appointmentDate}, ${record.appointmentTime || ''}` : `Requested date was: ${record.preferredDate}, ${record.preferredTimeSlot}`,
    !cancelled && `New preferred time: ${request.preferredDate}, ${request.preferredTimeSlot}`,
    request.reason && `Customer note: ${request.reason}`,
  ]);
}
