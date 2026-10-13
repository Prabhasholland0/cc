import { Check, CalendarClock, MessageCircle } from 'lucide-react';
import { siteSettings } from '../data/siteSettings';
import { whatsappLink } from '../lib/whatsapp';
import { SectionHeading } from './SectionHeading';

/** Maintenance plans. Hidden while siteSettings.plans is empty. */
export function Plans() {
  const { plans } = siteSettings;
  if (!plans.length) return null;
  return <section id="plans" className="section section-tint" aria-labelledby="plans-title"><div className="page-width">
    <SectionHeading id="plans-title" eyebrow="Maintenance plans" title="Stay clean all year, for less." intro="Regular visits on a schedule that suits you. We remind you before each visit, so you never have to remember. No advance payment, and you can pause or stop any time." align="center" />
    <ul className="package-grid plan-grid">{plans.map(plan => <li key={plan.id} className={`package-card ${plan.popular ? 'is-popular' : ''}`}>
      {plan.popular && <span className="package-badge">Most popular</span>}
      <h3>{plan.name}</h3>
      <p className="plan-frequency"><CalendarClock size={16} aria-hidden="true" /> {plan.frequency}</p>
      <p className="package-price">{plan.price}</p>
      {plan.saving && <p className="plan-saving">{plan.saving}</p>}
      <ul className="icon-list">{plan.includes.map(item => <li key={item}><Check aria-hidden="true" />{item}</li>)}</ul>
      <a className={plan.popular ? 'whatsapp-button w-full' : 'secondary-button w-full'} href={whatsappLink(`Hello Clean Corners, I'm interested in the ${plan.name} plan (${plan.frequency}).`)} target="_blank" rel="noopener noreferrer"><MessageCircle size={18} aria-hidden="true" /> Ask about this plan</a>
    </li>)}</ul>
  </div></section>;
}
