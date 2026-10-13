import type { PricingConfig } from '../types';
import { calculateQuote, defaultSelection, money } from '../lib/pricing';
import type { QuoteSelection } from '../lib/pricing';
interface Props { config: PricingConfig; selection: QuoteSelection; onChange: (value: QuoteSelection) => void; }
export function ServiceConfigurator({ config, selection, onChange }: Props) {
  const service = config.services.find(s => s.id === selection.serviceId);
  const single = service && ['full-home', 'kitchen', 'bathroom', 'painting'].includes(service.id);
  return <div className="configurator">
    <label className="field-label">Choose your service<select value={selection.serviceId} onChange={e => onChange(defaultSelection(config, e.target.value))}>{config.services.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}</select></label>
    <div className="package-options">{service?.packages.map(pkg => <div className={`package-option ${selection.quantities[pkg.id] ? 'selected' : ''}`} key={pkg.id}>
      {single ? <label><input type="radio" name="service-package" checked={!!selection.quantities[pkg.id]} onChange={() => onChange({ ...selection, quantities: { [pkg.id]: service.id === 'painting' ? 1000 : 1 } })} /><span><strong>{pkg.name}</strong><small>{pkg.unit} · {money(pkg.price)}{service.id === 'painting' ? ' / sq ft' : ''}</small></span></label> : <label className="quantity-row"><span><strong>{pkg.name}</strong><small>{money(pkg.price)} · {pkg.unit}</small></span><input aria-label={`Quantity: ${pkg.name}`} type="number" inputMode="numeric" min="0" max="100" value={selection.quantities[pkg.id] || 0} onChange={e => onChange({ ...selection, quantities: { ...selection.quantities, [pkg.id]: Number(e.target.value) } })} /></label>}
    </div>)}</div>
    {service?.id === 'painting' && <label className="field-label">Wall area to paint (sq ft)<input type="number" inputMode="numeric" min="1" max="100000" value={Object.values(selection.quantities)[0] ?? 0} onChange={e => onChange({ ...selection, quantities: { [Object.keys(selection.quantities)[0]]: Number(e.target.value) } })} /><small>This is wall area, not floor area. Final measurements and price require inspection.</small></label>}
    {service?.id === 'full-home' && <label className="field-label">Additional bathrooms beyond the package<input type="number" inputMode="numeric" min="0" max="20" value={selection.extraBathrooms || 0} onChange={e => onChange({ ...selection, extraBathrooms: Number(e.target.value) })} /></label>}
    <label className="priority-option"><input type="checkbox" checked={selection.priority} onChange={e => onChange({ ...selection, priority: e.target.checked })} /><span>Request a priority slot (+{money(config.emergencyFee)})<small>Subject to team availability; the requested slot is not guaranteed.</small></span></label>
  </div>;
}
export function QuoteSummary({ config, selection }: Omit<Props, 'onChange'>) {
  try {
    const quote = calculateQuote(config, selection);
    return <aside className="quote-summary" aria-live="polite"><span className="eyebrow">YOUR ESTIMATE</span><h3>{quote.service.title}</h3><ul>{quote.lines.map(line => <li key={line.packageId}><span>{line.quantity} × {line.name}</span><strong>{money(line.amount)}</strong></li>)}</ul>{quote.minimumAdjustment > 0 && <p>Minimum visit adjustment <strong>{money(quote.minimumAdjustment)}</strong></p>}{quote.priorityFee > 0 && <p>Priority request <strong>{money(quote.priorityFee)}</strong></p>}<div className="quote-total"><span>Estimated total</span><strong>{money(quote.total)}</strong></div><small>{quote.requiresInspection ? 'An on-site inspection is needed before the final quote.' : 'Based on the selected scope. Our team confirms details before booking.'} No online advance payment.</small></aside>;
  } catch (error) { return <aside className="quote-summary" role="status">{(error as Error).message}</aside>; }
}
