import { calculateQuote, money } from './pricing';
import type { QuoteSelection } from './pricing';
import type { PricingConfig } from '../types';

export const WHATSAPP_NUMBER = '919515447834';
export const whatsappLink = (text: string) => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;

export function estimateWhatsappLink(config: PricingConfig, selection: QuoteSelection) {
  const quote = calculateQuote(config, selection);
  const lines = [
    'Hello Clean Corners, I would like to book this service:',
    '',
    `*${quote.service.title}*`,
    ...quote.lines.map(line => `• ${line.quantity} × ${line.name}: ${money(line.amount)}`),
    ...(quote.minimumAdjustment > 0 ? [`• Minimum visit adjustment: ${money(quote.minimumAdjustment)}`] : []),
    ...(quote.priorityFee > 0 ? [`• Priority slot request: ${money(quote.priorityFee)}`] : []),
    `*Estimated total: ${money(quote.total)}*`,
    '',
    'My area:',
    'Preferred date and time:',
  ];
  return whatsappLink(lines.join('\n'));
}

export interface BookingDetails { reference: string; customerName: string; phone: string; area: string; address: string; preferredDate: string; preferredTimeSlot: string; notes?: string; }

/** A finished booking, with its reference, ready to send to the business WhatsApp. */
export function bookingWhatsappLink(config: PricingConfig, selection: QuoteSelection, booking: BookingDetails) {
  const quote = calculateQuote(config, selection);
  const lines = [
    `Hello Clean Corners, I just booked on your website. My reference is *${booking.reference}*.`,
    '',
    `*${quote.service.title}*`,
    ...quote.lines.map(line => `• ${line.quantity} × ${line.name}`),
    `Estimate: ${money(quote.total)}`,
    `Preferred: ${booking.preferredDate}, ${booking.preferredTimeSlot}`,
    `Name: ${booking.customerName}`,
    `Area: ${booking.area}`,
    `Address: ${booking.address}`,
    ...(booking.notes ? [`Notes: ${booking.notes}`] : []),
    '',
    'Please confirm my visit. Thank you!',
  ];
  return whatsappLink(lines.join('\n'));
}
