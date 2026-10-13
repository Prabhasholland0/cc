import { useRef, useState } from 'react';
import type { FormEvent } from 'react';
import type { PricingConfig } from '../types';
import { calculateQuote, indiaDate, money } from '../lib/pricing';
import type { QuoteSelection } from '../lib/pricing';
import { submitEnquiryApi } from '../services/api';
import { ServiceConfigurator, QuoteSummary } from './ServiceConfigurator';
import { useDialog } from '../hooks/useDialog';
import { X, CheckCircle2, MessageCircle } from 'lucide-react';
import { bookingWhatsappLink, estimateWhatsappLink } from '../lib/whatsapp';
interface Props { pricingConfig: PricingConfig; initialSelection: QuoteSelection; onClose: () => void; }
const steps = ['Choose service', 'Home details', 'Contact & preferred date'];
export function BookingModal({ pricingConfig, initialSelection, onClose }: Props) {
  const [selection, setSelection] = useState(initialSelection);
  const [step, setStep] = useState(0);
  const [values, setValues] = useState({ area: '', address: '', notes: '', customerName: '', phone: '', preferredDate: indiaDate(1), preferredTimeSlot: 'Morning: 9am–12pm' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [reference, setReference] = useState('');
  const submitting = useRef(false);
  const [requestId] = useState(() => crypto.randomUUID());
  const dialog = useDialog(() => { if (!submitting.current) onClose(); });
  let liveTotal = 'Choose a package';
  let liveService = pricingConfig.services.find(service => service.id === selection.serviceId)?.title || 'Your service';
  let whatsappEstimate = '';
  try { liveTotal = money(calculateQuote(pricingConfig, selection).total); whatsappEstimate = estimateWhatsappLink(pricingConfig, selection); } catch { /* The configurator explains invalid selections. */ }
  const heading = useRef<HTMLHeadingElement>(null);
  const change = (key: keyof typeof values, value: string) => { setValues(v => ({ ...v, [key]: value })); setErrors(e => ({ ...e, [key]: '' })); };
  const move = (next: number) => { setStep(next); setError(''); setErrors({}); requestAnimationFrame(() => heading.current?.focus()); };
  const validate = () => {
    const result: Record<string, string> = {};
    if (step === 0) { try { calculateQuote(pricingConfig, selection); } catch (e) { setError((e as Error).message); return false; } }
    if (step === 1) {
      if (values.area.trim().length < 2) result.area = 'Enter your locality.';
      if (values.address.trim().length < 5) result.address = 'Add your house or flat number and street.';
    }
    if (step === 2) {
      if (values.customerName.trim().length < 2) result.customerName = 'Enter your full name.';
      if (!/^[6-9]\d{9}$/.test(values.phone.replace(/[\s-]/g, '').replace(/^\+91/, ''))) result.phone = 'Enter a valid 10-digit Indian mobile number.';
      if (!values.preferredDate || values.preferredDate < indiaDate()) result.preferredDate = 'Choose today or a future date.';
    }
    setErrors(result);
    const first = Object.keys(result)[0];
    if (first) requestAnimationFrame(() => document.getElementById(`booking-${first}`)?.focus());
    return !first;
  };
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (submitting.current || !validate()) return;
    if (step < 2) { move(step + 1); return; }
    setError(''); setBusy(true); submitting.current = true;
    try {
      const quote = calculateQuote(pricingConfig, selection);
      const result = await submitEnquiryApi({ ...values, phone: values.phone.replace(/[\s-]/g, '').replace(/^\+91/, ''), serviceId: quote.service.id, serviceName: quote.service.title, packageName: quote.scope, customScope: quote.scope, estimatedPrice: quote.total, selection, requestId });
      if (result.success && result.enquiryId) { setReference(result.enquiryId); requestAnimationFrame(() => heading.current?.focus()); }
      else {
        setError(result.error || 'Your request could not be saved. Please try again or call us.');
        if (result.issues) setErrors(Object.fromEntries(result.issues.map(issue => [issue.field, issue.message])));
      }
    } catch (e) { setError((e as Error).message); }
    finally { setBusy(false); submitting.current = false; }
  };
  const field = (key: keyof typeof values, label: string, type = 'text', extra: Record<string, string> = {}) => <label className="field-label" htmlFor={`booking-${key}`}>{label}<input id={`booking-${key}`} type={type} value={values[key]} onChange={e => change(key, e.target.value)} aria-invalid={!!errors[key]} aria-describedby={errors[key] ? `error-${key}` : undefined} {...extra} />{errors[key] && <span className="field-error" id={`error-${key}`}>{errors[key]}</span>}</label>;
  return <div className="booking-backdrop"><div className="booking-dialog" role="dialog" aria-modal="true" aria-labelledby="booking-title" tabIndex={-1} ref={dialog}>
    <header className="booking-heading"><div><span className="eyebrow">LET’S TAKE CARE OF YOUR HOME</span><h2 id="booking-title" ref={heading} tabIndex={-1}>{reference ? 'Request received. Thank you.' : 'Request your cleaning'}</h2></div><button type="button" aria-label="Close booking" disabled={busy} onClick={onClose}><X /></button></header>
    {reference ? <div className="booking-success"><CheckCircle2 size={48} /><h3>Your reference: {reference}</h3><p>Your enquiry is saved. This is <strong>not a confirmed appointment</strong>. Our team will contact you to agree the scope, final price, and available time.</p><p>Preferred date: {values.preferredDate} · {values.preferredTimeSlot}</p><div className="whatsapp-callout"><strong>Want a faster confirmation?</strong><span>Send your booking to our WhatsApp. Everything is filled in, so just tap send.</span><a className="whatsapp-button is-large" href={bookingWhatsappLink(pricingConfig, selection, { reference, ...values })} target="_blank" rel="noopener noreferrer"><MessageCircle size={18} aria-hidden="true" /> Send booking on WhatsApp</a></div><a className="secondary-button" href={`/track?ref=${reference}`}>Track this booking</a><p className="form-hint">Save your reference. With it and your mobile number you can check the status, reschedule or cancel at any time.</p><button className="text-button" onClick={onClose}>Back to website</button></div> : <>
      <div className="booking-live-total" aria-live="polite"><span>{liveService}</span><strong>Estimate: {liveTotal}</strong></div><ol className="booking-steps">{steps.map((label, index) => <li key={label} aria-current={step === index ? 'step' : undefined} className={step === index ? 'current' : step > index ? 'complete' : ''}><span>{index + 1}</span>{label}</li>)}</ol>
      <div className="booking-content"><form id="booking-form" onSubmit={submit} noValidate><fieldset disabled={busy}>
        <h3 className="step-heading">{steps[step]}</h3>
        {step === 0 && whatsappEstimate && <p className="whatsapp-alt">Prefer to book by chat? <a href={whatsappEstimate} target="_blank" rel="noopener noreferrer"><MessageCircle size={16} aria-hidden="true" /> Book on WhatsApp instead</a></p>}
        {step === 0 && <ServiceConfigurator config={pricingConfig} selection={selection} onChange={setSelection} />}
        {step === 1 && <div className="form-fields">{field('area', 'Locality / area', 'text', { autoComplete: 'address-level2', placeholder: 'e.g. Sainikpuri' })}{field('address', 'House / flat number, street & landmark', 'text', { autoComplete: 'street-address', placeholder: 'Where should our team arrive?' })}<label className="field-label" htmlFor="booking-notes">Access or preparation notes (optional)<textarea id="booking-notes" value={values.notes} onChange={e => change('notes', e.target.value)} placeholder="Pets, parking, lift access, water supply, or anything we should know" /></label><p className="form-hint">Please arrange access to water and electricity, and put away valuables before the visit.</p></div>}
        {step === 2 && <div className="form-fields">{field('customerName', 'Full name', 'text', { autoComplete: 'name' })}{field('phone', 'Mobile number', 'tel', { autoComplete: 'tel', inputMode: 'tel', placeholder: '10-digit Indian number' })}{field('preferredDate', 'Preferred date', 'date', { min: indiaDate() })}<label className="field-label">Preferred time<select value={values.preferredTimeSlot} onChange={e => change('preferredTimeSlot', e.target.value)}><option>Morning: 9am–12pm</option><option>Afternoon: 1pm–4pm</option><option>Late afternoon: 4pm–7pm</option></select></label><div className="form-hint"><strong>Request summary</strong><p>{values.address}, {values.area}</p><p>We’ll call to confirm availability. No payment is collected here.</p></div></div>}
      </fieldset>{error && <p role="alert" className="form-error">{error} <a href="tel:+919515447834">Call 95154 47834</a></p>}</form><QuoteSummary config={pricingConfig} selection={selection} /></div>
      <footer className="booking-controls"><button type="button" className="text-button" disabled={busy} onClick={() => step > 0 ? move(step - 1) : onClose()}>{step > 0 ? '← Back' : 'Cancel'}</button><button form="booking-form" type="submit" className="primary-button" disabled={busy}>{busy ? 'Saving your request…' : step === 2 ? 'Send booking request' : 'Continue →'}</button></footer>
    </>}
  </div></div>;
}
