import { useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { PhoneCall, CheckCircle2, Clock, ShieldCheck, MessageCircle } from 'lucide-react';
import { whatsappLink } from '../lib/whatsapp';
import { submitCallbackApi } from '../services/api';
import { CALLBACK_TIMES } from '../types';
import type { CallbackSubmission, ServiceItem } from '../types';

interface Props { services: ServiceItem[]; serviceId?: string; tone?: 'white' | 'tint'; }
const emptyForm = (serviceId = '') => ({ name: '', phone: '', preferredTime: CALLBACK_TIMES[0] as CallbackSubmission['preferredTime'], serviceId, website: '' });

export function CallbackRequest({ services, serviceId, tone = 'tint' }: Props) {
  const [values, setValues] = useState(() => emptyForm(serviceId));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [reference, setReference] = useState('');
  const requestId = useRef(crypto.randomUUID());
  const change = (key: keyof typeof values, value: string) => { setValues(v => ({ ...v, [key]: value })); setErrors(e => ({ ...e, [key]: '' })); };
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (busy) return;
    const phone = values.phone.replace(/[\s-]/g, '').replace(/^\+?91(?=\d{10}$)/, '');
    const found: Record<string, string> = {};
    if (values.name.trim().length < 2) found.name = 'Enter your name.';
    if (!/^[6-9]\d{9}$/.test(phone)) found.phone = 'Enter a valid 10-digit mobile number.';
    setErrors(found);
    if (Object.keys(found).length) { document.getElementById(`callback-${Object.keys(found)[0]}`)?.focus(); return; }
    setBusy(true); setError('');
    const result = await submitCallbackApi({ requestId: requestId.current, name: values.name.trim(), phone, preferredTime: values.preferredTime, serviceId: values.serviceId || undefined, website: values.website });
    setBusy(false);
    if (result.success && result.callbackId) { setReference(result.callbackId); return; }
    setError(result.error || 'Your request could not be saved.');
    if (result.issues) setErrors(Object.fromEntries(result.issues.map(issue => [issue.field, issue.message])));
  };
  const reset = () => { requestId.current = crypto.randomUUID(); setValues(emptyForm(serviceId)); setReference(''); };

  return <section id="callback" className={`section section-${tone} callback-section`} aria-labelledby="callback-title">
    <div className="page-width callback-layout">
      <div className="callback-copy">
        <span className="eyebrow">Prefer to talk?</span>
        <h2 id="callback-title">Request a free callback.</h2>
        <p>Not ready to book? Leave your name and number and our team will call you to answer questions, suggest the right package and share a price.</p>
        <ul className="callback-points">
          <li><Clock aria-hidden="true" /> We call during working hours, Mon–Sun 8am–7:30pm</li>
          <li><ShieldCheck aria-hidden="true" /> Your number is only used to contact you about this request</li>
        </ul>
      </div>
      <div className="callback-card" aria-live="polite">
        {reference ? <div className="callback-success">
          <CheckCircle2 size={40} aria-hidden="true" />
          <h3>Thanks, {values.name.split(' ')[0]}. We’ll call you soon.</h3>
          <p>Your reference is <strong>{reference}</strong>. We’ll call {values.phone} ({values.preferredTime.toLowerCase()}).</p>
          <a className="whatsapp-button" href={whatsappLink(`Hello Clean Corners, I just requested a callback (reference ${reference}). My name is ${values.name.trim()}.`)} target="_blank" rel="noopener noreferrer"><MessageCircle size={18} aria-hidden="true" /> Or chat with us on WhatsApp now</a>
          <button className="text-button" onClick={reset}>Request another callback</button>
        </div> : <form onSubmit={submit} noValidate>
          <label className="field-label" htmlFor="callback-name">Your name<input id="callback-name" autoComplete="name" value={values.name} onChange={e => change('name', e.target.value)} aria-invalid={!!errors.name} aria-describedby={errors.name ? 'callback-name-error' : undefined} />{errors.name && <span className="field-error" id="callback-name-error">{errors.name}</span>}</label>
          <label className="field-label" htmlFor="callback-phone">Mobile number<input id="callback-phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="10-digit mobile number" value={values.phone} onChange={e => change('phone', e.target.value)} aria-invalid={!!errors.phone} aria-describedby={errors.phone ? 'callback-phone-error' : undefined} />{errors.phone && <span className="field-error" id="callback-phone-error">{errors.phone}</span>}</label>
          <div className="callback-row">
            <label className="field-label" htmlFor="callback-time">Best time to call<select id="callback-time" value={values.preferredTime} onChange={e => change('preferredTime', e.target.value)}>{CALLBACK_TIMES.map(time => <option key={time}>{time}</option>)}</select></label>
            <label className="field-label" htmlFor="callback-service">Service (optional)<select id="callback-service" value={values.serviceId} onChange={e => change('serviceId', e.target.value)}><option value="">Not sure yet</option>{services.map(service => <option key={service.id} value={service.id}>{service.title}</option>)}</select></label>
          </div>
          <label className="visually-hidden" aria-hidden="true">Leave this field empty<input tabIndex={-1} autoComplete="off" value={values.website} onChange={e => change('website', e.target.value)} /></label>
          <button className="primary-button is-large w-full" disabled={busy}><PhoneCall size={18} aria-hidden="true" /> {busy ? 'Sending…' : 'Call me back'}</button>
          {error && <p className="form-error" role="alert">{error} <a href="tel:+919515447834">Call 95154 47834</a></p>}
        </form>}
      </div>
    </div>
  </section>;
}
