import { useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { fetchCallbacksApi, fetchEnquiriesApi, updateCallbackStatusApi, updateEnquiryStatusApi, updatePricingApi } from '../services/api';
import type { CallbackRecord, EnquiryRecord, PricingConfig } from '../types';
import { indiaDate, money, startingRate } from '../lib/pricing';
import { useDialog } from '../hooks/useDialog';
import { X, Bell } from 'lucide-react';
interface Props { isOpen: boolean; onClose: () => void; pricingConfig: PricingConfig; onPricingUpdated: (config: PricingConfig) => void; }
const statuses: { id: EnquiryRecord['status']; label: string }[] = [{ id: 'new', label: 'New' }, { id: 'contacted', label: 'Contacted' }, { id: 'service_confirmed', label: 'Confirmed' }, { id: 'completed', label: 'Completed' }, { id: 'inspection_scheduled', label: 'Inspection scheduled' }, { id: 'cancelled', label: 'Cancelled' }];
export function AdminPortal(props: Props) { return props.isOpen ? <StaffPortal {...props} /> : null; }
function StaffPortal({ onClose, pricingConfig, onPricingUpdated }: Props) {
  const [token, setToken] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [records, setRecords] = useState<EnquiryRecord[]>([]);
  const [callbacks, setCallbacks] = useState<CallbackRecord[]>([]);
  const [tab, setTab] = useState('enquiries');
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [pricing, setPricing] = useState(() => structuredClone(pricingConfig));
  const dialog = useDialog(onClose);
  const [alertsOn, setAlertsOn] = useState(() => typeof Notification !== 'undefined' && Notification.permission === 'granted');
  const [lastChecked, setLastChecked] = useState('');
  const seen = useRef<Set<string> | null>(null);

  // While the portal is open, check for new bookings, callbacks and customer changes every minute.
  useEffect(() => {
    if (!authenticated) return;
    const keysOf = (enquiries: EnquiryRecord[], requests: CallbackRecord[]) => new Set([...enquiries.map(r => r.id), ...enquiries.filter(r => r.customerRequest).map(r => `${r.id}:${r.customerRequest!.createdAt}`), ...requests.map(c => c.id)]);
    const check = async () => {
      try {
        const [enquiries, requests] = await Promise.all([fetchEnquiriesApi(token), fetchCallbacksApi(token)]);
        const keys = keysOf(enquiries, requests);
        if (seen.current) {
          const fresh = [...keys].filter(key => !seen.current!.has(key));
          if (fresh.length) {
            setRecords(enquiries); setCallbacks(requests);
            const summary = `${fresh.length} new update${fresh.length > 1 ? 's' : ''}: booking, callback or customer change`;
            setMessage(`${summary} (${new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour: 'numeric', minute: '2-digit' })}).`);
            playChime();
            if (typeof Notification !== 'undefined' && Notification.permission === 'granted') new Notification('Clean Corners', { body: summary, icon: '/brand-logo-240.png' });
          }
        }
        seen.current = keys;
        setLastChecked(new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour: 'numeric', minute: '2-digit' }));
      } catch { /* Try again on the next tick. */ }
    };
    void check();
    const timer = window.setInterval(check, 60_000);
    return () => window.clearInterval(timer);
  }, [authenticated, token]);
  const enableAlerts = async () => {
    if (typeof Notification === 'undefined') { setError('This browser does not support notifications. The portal will still chime.'); return; }
    setAlertsOn((await Notification.requestPermission()) === 'granted');
    playChime();
  };
  const load = async () => { setError(''); setBusy(true); try { setRecords(await fetchEnquiriesApi(token)); setAuthenticated(true); fetchCallbacksApi(token).then(setCallbacks).catch(() => setError('Enquiries loaded, but callback requests could not be loaded.')); } catch { setError('Unable to load enquiries. Check your staff passcode and server connection.'); } finally { setBusy(false); } };
  const login = (event: FormEvent) => { event.preventDefault(); void load(); };
  const saveRecord = async (id: string, updates: Parameters<typeof updateEnquiryStatusApi>[1]) => {
    const result = await updateEnquiryStatusApi(id, updates, token);
    if (!result.success) throw new Error(result.error || 'Could not save changes.');
    const { customerRequestHandled, ...changes } = updates;
    setRecords(previous => previous.map(record => record.id === id ? { ...record, ...changes, ...(record.customerRequest && customerRequestHandled !== undefined ? { customerRequest: { ...record.customerRequest, handled: customerRequestHandled } } : {}) } : record));
  };
  const savePricing = async () => {
    setError(''); setMessage(''); setBusy(true);
    const normalized = { ...pricing, services: pricing.services.map(service => ({ ...service, startingPrice: startingRate(service) })) };
    const result = await updatePricingApi(normalized, token);
    if (result.success) { onPricingUpdated(normalized); setPricing(normalized); setMessage('Pricing saved. Service pages, estimates, and booking now use these rates.'); }
    else setError(result.error || 'Pricing was not saved.');
    setBusy(false);
  };
  const exportCsv = async () => { setError(''); try { const response = await fetch('/api/enquiries/export', { headers: { 'x-admin-token': token } }); if (!response.ok) throw new Error('Export failed.'); const url = URL.createObjectURL(await response.blob()); const link = document.createElement('a'); link.href = url; link.download = 'clean-corners-enquiries.csv'; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000); } catch { setError('Unable to export enquiries. Please retry.'); } };
  const setCallbackStatus = async (id: string, status: CallbackRecord['status']) => {
    setError('');
    const result = await updateCallbackStatusApi(id, status, token);
    if (!result.success) { setError(result.error || 'Could not update the callback request.'); return; }
    setCallbacks(previous => previous.map(item => item.id === id ? { ...item, status } : item));
  };
  const serviceName = (id?: string) => pricingConfig.services.find(service => service.id === id)?.title || 'Not specified';
  const visible = records.filter(record => (filter === 'all' || record.status === filter || (filter === 'follow-up' && !!record.followUpDate && record.followUpDate <= indiaDate() && !['completed', 'cancelled'].includes(record.status))) && `${record.customerName} ${record.phone} ${record.area} ${record.id}`.toLowerCase().includes(search.toLowerCase()));
  return <div className="booking-backdrop"><div className="staff-dialog" role="dialog" aria-modal="true" aria-labelledby="staff-title" tabIndex={-1} ref={dialog}><header className="booking-heading"><div><span className="eyebrow">STAFF ONLY</span><h2 id="staff-title">Clean Corners operations</h2></div><button aria-label="Close portal" onClick={onClose}><X /></button></header><div className="staff-content">
    {!authenticated ? <form onSubmit={login} className="staff-login"><h3>Sign in to manage enquiries</h3><label className="field-label">Staff passcode<input type="password" autoComplete="current-password" value={token} onChange={e => setToken(e.target.value)} required /></label><button className="primary-button" disabled={busy}>{busy ? 'Checking…' : 'Sign in'}</button></form> : <>
      <nav className="staff-tabs" aria-label="Staff sections">{['enquiries', 'callbacks', 'pricing', 'launch checklist'].map(name => <button key={name} aria-pressed={tab === name} onClick={() => { setTab(name); setError(''); setMessage(''); }}>{name}{name === 'callbacks' && callbacks.some(item => item.status === 'new') ? ` (${callbacks.filter(item => item.status === 'new').length} new)` : ''}</button>)}<button onClick={() => { setToken(''); setRecords([]); setCallbacks([]); setAuthenticated(false); }}>Sign out</button></nav>
      <p className="live-status"><span className="live-dot" aria-hidden="true" /> Checking for new requests every minute{lastChecked ? ` · last checked ${lastChecked}` : ''}. Keep this window open. {!alertsOn && <button className="text-button" onClick={() => void enableAlerts()}><Bell size={16} aria-hidden="true" /> Turn on pop-up alerts</button>}</p>
      {tab === 'callbacks' && <section className="callback-queue"><h3>Callback requests</h3>{!callbacks.length && <p className="form-hint">No callback requests yet.</p>}{callbacks.map(item => <article key={item.id} className={`callback-item ${item.status === 'called' ? 'is-done' : ''}`}><div><strong>{item.name}</strong><small>{item.id} · {new Date(item.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</small><small>{item.preferredTime} · {serviceName(item.serviceId)}</small></div><div className="callback-actions"><a className="primary-button" href={`tel:+91${item.phone}`}>Call {item.phone}</a><button className="secondary-button" onClick={() => void setCallbackStatus(item.id, item.status === 'new' ? 'called' : 'new')}>{item.status === 'new' ? 'Mark as called' : 'Mark as new'}</button></div></article>)}</section>}
      {tab === 'enquiries' && <><div className="queue-stages">{statuses.slice(0, 4).map(status => <button key={status.id} aria-pressed={filter === status.id} onClick={() => setFilter(status.id)}><strong>{records.filter(record => record.status === status.id).length}</strong>{status.label}</button>)}</div>{records.some(record => record.customerRequest && !record.customerRequest.handled) && <p className="form-hint">{records.filter(record => record.customerRequest && !record.customerRequest.handled).length} booking(s) have a customer cancel or reschedule request to review.</p>}<div className="staff-toolbar"><input aria-label="Search enquiries" placeholder="Search name, phone, area, or reference" value={search} onChange={e => setSearch(e.target.value)} /><select aria-label="Filter enquiries" value={filter} onChange={e => setFilter(e.target.value)}><option value="all">All enquiries</option><option value="follow-up">Follow-up due</option>{statuses.map(status => <option key={status.id} value={status.id}>{status.label}</option>)}</select><button className="text-button" disabled={busy} onClick={load}>Refresh</button><button className="text-button" onClick={exportCsv}>Export CSV</button></div>{!visible.length && <p className="form-hint">No enquiries match this view.</p>}<div className="enquiry-list">{visible.map(record => <EnquiryEditor key={record.id + (record.updatedAt || '')} record={record} save={saveRecord} />)}</div></>}
      {tab === 'pricing' && <div className="pricing-editor"><h3>One rate card for the whole website</h3><p>Starting rates are calculated from packages. Update package prices and visit minimums here.</p><div className="form-grid"><label className="field-label">Minimum visit (₹)<input type="number" min="0" value={pricing.minimumOrderThreshold} onChange={e => setPricing({ ...pricing, minimumOrderThreshold: Number(e.target.value) })} /></label><label className="field-label">Priority fee (₹)<input type="number" min="0" value={pricing.emergencyFee} onChange={e => setPricing({ ...pricing, emergencyFee: Number(e.target.value) })} /></label></div>{pricing.services.map((service, index) => <details key={service.id}><summary>{service.title} · from {money(startingRate(service))}</summary><label className="field-label">Service minimum visit (₹)<input type="number" min="0" value={service.minOrderAmount} onChange={e => setPricing(previous => ({ ...previous, services: previous.services.map((item, i) => i === index ? { ...item, minOrderAmount: Number(e.target.value) } : item) }))} /></label>{service.packages.map(pkg => <label className="field-label" key={pkg.id}>{pkg.name} · {pkg.unit}<input type="number" min="0" value={pkg.price} onChange={e => setPricing(previous => ({ ...previous, services: previous.services.map((item, i) => i === index ? { ...item, packages: item.packages.map(p => p.id === pkg.id ? { ...p, price: Number(e.target.value) } : p) } : item) }))} /></label>)}</details>)}<button className="primary-button" disabled={busy} onClick={savePricing}>{busy ? 'Saving…' : 'Save pricing'}</button></div>}
      {tab === 'launch checklist' && <section className="launch-checklist"><h3>Review before publishing</h3><p>These are manual checks. This page does not certify the website as ready.</p><ul><li>Complete a test enquiry, confirm its reference, and check it appears in the queue.</li><li>Check package rates, minimum visit charges, and priority fees.</li><li>Confirm appointment details before moving an enquiry to Confirmed.</li><li>Use genuine customer work and record consent before adding photos or reviews.</li><li>Verify business details, cancellation terms, privacy information, HTTPS, and public service-page links.</li><li>Configure a private staff passcode through ADMIN_SECRET and back up enquiry storage.</li></ul></section>}
    </>}{error && <p className="form-error" role="alert">{error}</p>}{message && <p className="form-hint" role="status">{message}</p>}
  </div></div></div>;
}
function EnquiryEditor({ record, save }: { record: EnquiryRecord; save: (id: string, updates: Parameters<typeof updateEnquiryStatusApi>[1]) => Promise<void> }) {
  const [draft, setDraft] = useState({ status: record.status, adminNotes: record.adminNotes || '', appointmentDate: record.appointmentDate || '', appointmentTime: record.appointmentTime || '', assignedTeam: record.assignedTeam || '', followUpDate: record.followUpDate || '' });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);
  const update = (key: keyof typeof draft, value: string) => { setSaved(false); setDraft(previous => ({ ...previous, [key]: value })); };
  return <details className="enquiry-card"><summary><span><strong>{record.customerName}</strong><small>{record.id} · {record.area}</small></span><span>{record.customerRequest && !record.customerRequest.handled && <em className="request-flag">{record.customerRequest.type === 'cancel' ? 'Cancelled online' : 'Reschedule request'}</em>}{statuses.find(status => status.id === record.status)?.label} · {money(record.estimatedPrice)}</span></summary><div className="enquiry-content"><p><strong>{record.serviceName}</strong> · {record.packageName}</p><p>{record.address}</p><p>Requested: {record.preferredDate} · {record.preferredTimeSlot}</p><p>Customer notes: {record.notes || 'None'}</p>{record.customerRequest && <div className={`customer-request ${record.customerRequest.handled ? 'is-handled' : ''}`}><strong>{record.customerRequest.type === 'cancel' ? 'Cancelled by customer online' : `Reschedule requested: ${record.customerRequest.preferredDate} · ${record.customerRequest.preferredTimeSlot}`}</strong><small>{new Date(record.customerRequest.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}{record.customerRequest.reason ? ` · “${record.customerRequest.reason}”` : ''}</small>{!record.customerRequest.handled && <button type="button" className="secondary-button" onClick={async () => { setError(''); try { await save(record.id, { customerRequestHandled: true }); } catch (e) { setError((e as Error).message); } }}>Mark request handled</button>}</div>}<a className="text-button" href={`tel:+91${record.phone}`}>Call {record.phone}</a><form onSubmit={async event => { event.preventDefault(); setBusy(true); setError(''); setSaved(false); try { await save(record.id, draft); setSaved(true); } catch (e) { setError((e as Error).message); } finally { setBusy(false); } }}><fieldset disabled={busy}><div className="form-grid"><label className="field-label">Status<select value={draft.status} onChange={e => update('status', e.target.value)}>{statuses.map(status => <option key={status.id} value={status.id}>{status.label}</option>)}</select></label><label className="field-label">Follow-up date<input type="date" value={draft.followUpDate} onChange={e => update('followUpDate', e.target.value)} /></label><label className="field-label">Agreed appointment date<input type="date" value={draft.appointmentDate} onChange={e => update('appointmentDate', e.target.value)} /></label><label className="field-label">Agreed time<input value={draft.appointmentTime} placeholder="e.g. 9:30am–12:30pm" onChange={e => update('appointmentTime', e.target.value)} /></label><label className="field-label">Assigned team<input value={draft.assignedTeam} onChange={e => update('assignedTeam', e.target.value)} /></label><label className="field-label">Internal follow-up notes<textarea value={draft.adminNotes} onChange={e => update('adminNotes', e.target.value)} /></label></div><button className="primary-button" disabled={busy}>{busy ? 'Saving…' : 'Save enquiry updates'}</button></fieldset>{error && <p role="alert" className="form-error">{error}</p>}{saved && <p role="status" className="form-hint">Updates saved.</p>}</form></div></details>;
}

/** A short two-note chime, generated in the browser so no audio file is needed. */
function playChime() {
  try {
    const context = new AudioContext();
    [880, 1320].forEach((frequency, index) => {
      const oscillator = context.createOscillator(); const gain = context.createGain();
      oscillator.frequency.value = frequency; oscillator.connect(gain); gain.connect(context.destination);
      const start = context.currentTime + index * 0.18;
      gain.gain.setValueAtTime(0.0001, start); gain.gain.exponentialRampToValueAtTime(0.25, start + 0.02); gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.3);
      oscillator.start(start); oscillator.stop(start + 0.32);
    });
    window.setTimeout(() => void context.close(), 800);
  } catch { /* Sound is optional. */ }
}
