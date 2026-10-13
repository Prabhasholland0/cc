import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { Search, CalendarClock, XCircle, CheckCircle2, Phone, MessageCircle, ArrowLeft, Info } from 'lucide-react';
import { changeBookingApi, trackBookingApi } from '../services/api';
import type { BookingChange } from '../services/api';
import { indiaDate, money } from '../lib/pricing';
import { whatsappLink } from '../lib/whatsapp';
import { siteSettings } from '../data/siteSettings';
import type { TrackedBooking } from '../types';

const timeSlots = ['Morning: 9am–12pm', 'Afternoon: 1pm–4pm', 'Late afternoon: 4pm–7pm'];
const stages: { id: TrackedBooking['status'][]; label: string; text: string }[] = [
  { id: ['new'], label: 'Request received', text: 'We have your request and will call you soon.' },
  { id: ['contacted', 'inspection_scheduled'], label: 'We’ve been in touch', text: 'We’re agreeing the scope, price and time with you.' },
  { id: ['service_confirmed'], label: 'Visit confirmed', text: 'Your team and appointment are booked.' },
  { id: ['completed'], label: 'Completed', text: 'Thank you for choosing Clean Corners.' },
];
const formatDate = (value?: string) => value ? new Date(`${value}T00:00:00`).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }) : '';
const cleanPhone = (value: string) => value.replace(/[\s-]/g, '').replace(/^\+?91(?=\d{10}$)/, '');

export function TrackBooking() {
  const params = new URLSearchParams(window.location.search);
  const [reference, setReference] = useState(params.get('ref') || '');
  const [phone, setPhone] = useState('');
  const [booking, setBooking] = useState<TrackedBooking | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [mode, setMode] = useState<'view' | 'reschedule' | 'cancel'>('view');
  const [change, setChange] = useState({ preferredDate: indiaDate(2), preferredTimeSlot: timeSlots[0], reason: '' });
  const [notice, setNotice] = useState('');

  useEffect(() => {
    const previous = document.title;
    document.title = 'Track your booking | Clean Corners';
    const robots = document.createElement('meta'); robots.name = 'robots'; robots.content = 'noindex';
    document.head.appendChild(robots);
    return () => { document.title = previous; robots.remove(); };
  }, []);

  const lookup = async (event: FormEvent) => {
    event.preventDefault();
    const ref = reference.trim().toUpperCase(); const mobile = cleanPhone(phone);
    const found: Record<string, string> = {};
    if (!/^CC-[0-9A-F]{8}$/.test(ref)) found.reference = 'Enter your reference, e.g. CC-1A2B3C4D.';
    if (!/^[6-9]\d{9}$/.test(mobile)) found.phone = 'Enter the 10-digit mobile number you booked with.';
    setErrors(found); setError(''); setNotice('');
    if (Object.keys(found).length) { document.getElementById(`track-${Object.keys(found)[0]}`)?.focus(); return; }
    setBusy(true);
    const result = await trackBookingApi(ref, mobile);
    setBusy(false);
    if (result.success) { setBooking(result.booking); setMode('view'); requestAnimationFrame(() => document.getElementById('booking-status')?.focus()); }
    else setError(result.error);
  };

  const submitChange = async (event: FormEvent) => {
    event.preventDefault();
    if (!booking) return;
    const request: BookingChange = { reference: booking.id, phone: cleanPhone(phone), type: mode === 'cancel' ? 'cancel' : 'reschedule', reason: change.reason.trim() || undefined, ...(mode === 'reschedule' ? { preferredDate: change.preferredDate, preferredTimeSlot: change.preferredTimeSlot } : {}) };
    setBusy(true); setError('');
    const result = await changeBookingApi(request);
    setBusy(false);
    if (!result.success) { setError(result.error); return; }
    setBooking(result.booking); setMode('view');
    setNotice(request.type === 'cancel' ? 'Your booking has been cancelled. No fee applies.' : 'Your reschedule request has been sent. We’ll call you to confirm the new time.');
    requestAnimationFrame(() => document.getElementById('booking-status')?.focus());
  };

  const cancelled = booking?.status === 'cancelled';
  const currentStage = booking ? stages.findIndex(stage => stage.id.includes(booking.status)) : -1;
  const request = booking?.customerRequest;

  return <section className="section section-tint track-page" aria-labelledby="track-title">
    <div className="page-width track-layout">
      <div className="track-intro">
        <span className="eyebrow">Your booking</span>
        <h1 id="track-title">Track your booking.</h1>
        <p>Enter the reference from your confirmation screen and the mobile number you booked with. You can check the status, reschedule or cancel.</p>
        {!booking && <form className="track-card" onSubmit={lookup} noValidate>
          <label className="field-label" htmlFor="track-reference">Booking reference<input id="track-reference" value={reference} onChange={e => { setReference(e.target.value); setErrors(v => ({ ...v, reference: '' })); }} placeholder="CC-1A2B3C4D" autoCapitalize="characters" autoComplete="off" spellCheck={false} aria-invalid={!!errors.reference} aria-describedby={errors.reference ? 'track-reference-error' : undefined} />{errors.reference && <span className="field-error" id="track-reference-error">{errors.reference}</span>}</label>
          <label className="field-label" htmlFor="track-phone">Mobile number<input id="track-phone" type="tel" inputMode="tel" autoComplete="tel" value={phone} onChange={e => { setPhone(e.target.value); setErrors(v => ({ ...v, phone: '' })); }} placeholder="10-digit mobile number" aria-invalid={!!errors.phone} aria-describedby={errors.phone ? 'track-phone-error' : undefined} />{errors.phone && <span className="field-error" id="track-phone-error">{errors.phone}</span>}</label>
          <button className="primary-button is-large w-full" disabled={busy}><Search size={18} aria-hidden="true" /> {busy ? 'Finding your booking…' : 'Find my booking'}</button>
          {error && <p className="form-error" role="alert">{error}</p>}
          <p className="track-help">Lost your reference? <a href="tel:+919515447834">Call 95154 47834</a> or <a href={whatsappLink('Hello Clean Corners, I need help finding my booking.')} target="_blank" rel="noopener noreferrer">WhatsApp us</a>.</p>
        </form>}
      </div>

      {booking && <div className="track-card track-result">
        <div className="track-result-head">
          <div><span className="track-ref">{booking.id}</span><h2 id="booking-status" tabIndex={-1}>{booking.serviceName}</h2>{booking.packageName && <p>{booking.packageName}</p>}</div>
          <span className={`status-pill ${cancelled ? 'is-cancelled' : booking.status === 'completed' ? 'is-complete' : ''}`}>{cancelled ? 'Cancelled' : stages[currentStage]?.label}</span>
        </div>
        {notice && <p className="form-success" role="status"><CheckCircle2 size={18} aria-hidden="true" /> {notice}</p>}

        {!cancelled && <ol className="status-timeline">{stages.map((stage, index) => <li key={stage.label} className={index < currentStage ? 'is-done' : index === currentStage ? 'is-current' : ''} aria-current={index === currentStage ? 'step' : undefined}><span aria-hidden="true">{index < currentStage ? <CheckCircle2 size={16} /> : index + 1}</span><div><strong>{stage.label}</strong>{index === currentStage && <small>{stage.text}</small>}</div></li>)}</ol>}

        <dl className="booking-facts">
          {booking.appointmentDate ? <div><dt>Confirmed visit</dt><dd>{formatDate(booking.appointmentDate)}{booking.appointmentTime ? `, ${booking.appointmentTime}` : ''}</dd></div> : <div><dt>Requested date</dt><dd>{formatDate(booking.preferredDate)}, {booking.preferredTimeSlot}</dd></div>}
          <div><dt>Estimate</dt><dd>{money(booking.estimatedPrice)}</dd></div>
          <div><dt>Payment</dt><dd>After inspection, by UPI or cash</dd></div>
        </dl>

        {booking.status === 'completed' && <div className="review-request"><strong>How did we do?</strong><span>Your review helps neighbours in your area find a cleaning team they can trust.</span>{siteSettings.googleReviewUrl ? <a className="primary-button" href={siteSettings.googleReviewUrl} target="_blank" rel="noopener noreferrer">Review us on Google</a> : <a className="whatsapp-button" href={whatsappLink(`Hello Clean Corners, feedback on my booking ${booking.id}: `)} target="_blank" rel="noopener noreferrer">Share feedback on WhatsApp</a>}</div>}
        {request && !cancelled && request.type === 'reschedule' && <p className="form-hint"><Info size={16} aria-hidden="true" /> {request.handled ? 'Your reschedule request was handled.' : `Reschedule requested to ${formatDate(request.preferredDate)}, ${request.preferredTimeSlot}. We’ll call you to confirm.`}</p>}

        {mode === 'view' && !cancelled && booking.status !== 'completed' && (booking.canChangeOnline
          ? <div className="track-actions"><button className="secondary-button" onClick={() => { setMode('reschedule'); setError(''); setNotice(''); }}><CalendarClock size={18} aria-hidden="true" /> Reschedule</button><button className="danger-button" onClick={() => { setMode('cancel'); setError(''); setNotice(''); }}><XCircle size={18} aria-hidden="true" /> Cancel booking</button></div>
          : <p className="form-hint">Changes on the day of your visit need at least 3 hours’ notice. Please <a href="tel:+919515447834">call 95154 47834</a>.</p>)}

        {mode !== 'view' && <form className="change-form" onSubmit={submitChange}>
          <h3>{mode === 'cancel' ? 'Cancel this booking?' : 'Choose a new date and time'}</h3>
          {mode === 'reschedule' ? <div className="callback-row">
            <label className="field-label">New date<input type="date" min={indiaDate(1)} value={change.preferredDate} onChange={e => setChange(v => ({ ...v, preferredDate: e.target.value }))} required /></label>
            <label className="field-label">New time<select value={change.preferredTimeSlot} onChange={e => setChange(v => ({ ...v, preferredTimeSlot: e.target.value }))}>{timeSlots.map(slot => <option key={slot}>{slot}</option>)}</select></label>
          </div> : <p className="change-note">Cancelling now is free. If you only need a different day, you can reschedule instead.</p>}
          <label className="field-label">{mode === 'cancel' ? 'Reason (optional)' : 'Anything we should know? (optional)'}<textarea value={change.reason} maxLength={500} onChange={e => setChange(v => ({ ...v, reason: e.target.value }))} /></label>
          <div className="track-actions">
            <button type="button" className="secondary-button" onClick={() => { setMode('view'); setError(''); }}><ArrowLeft size={18} aria-hidden="true" /> Keep my booking</button>
            <button className={mode === 'cancel' ? 'danger-button' : 'primary-button'} disabled={busy}>{busy ? 'Sending…' : mode === 'cancel' ? 'Yes, cancel booking' : 'Send reschedule request'}</button>
          </div>
        </form>}
        {error && booking && <p className="form-error" role="alert">{error}</p>}

        <div className="track-footer">
          <a href="tel:+919515447834"><Phone size={16} aria-hidden="true" /> 95154 47834</a>
          <a href={whatsappLink(`Hello Clean Corners, I have a question about my booking ${booking.id}.`)} target="_blank" rel="noopener noreferrer"><MessageCircle size={16} aria-hidden="true" /> WhatsApp</a>
          <button className="text-button" onClick={() => { setBooking(null); setNotice(''); setError(''); }}>Track another booking</button>
        </div>
      </div>}
    </div>
  </section>;
}
