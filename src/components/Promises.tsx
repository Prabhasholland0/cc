import { RotateCcw, ShieldCheck, BadgeCheck, Gift } from 'lucide-react';
import { anyPromiseEnabled, siteSettings } from '../data/siteSettings';
import { SectionHeading } from './SectionHeading';

/** Guarantee, damage cover, verified team and referral cards. Hidden until switched on in siteSettings. */
export function Promises() {
  if (!anyPromiseEnabled()) return null;
  const items = [
    { ...siteSettings.guarantee, icon: RotateCcw },
    { ...siteSettings.damageCover, icon: ShieldCheck },
    { ...siteSettings.verifiedTeam, icon: BadgeCheck },
    { ...siteSettings.referral, icon: Gift },
  ].filter(item => item.enabled);
  return <section className="section section-dark" aria-labelledby="promise-title"><div className="page-width">
    <SectionHeading id="promise-title" eyebrow="Our promise" title="Book with complete peace of mind." align="center" />
    <ul className={`promise-grid count-${items.length}`}>{items.map(({ icon: Icon, title, text }) => <li key={title} className="promise-card"><span className="feature-icon"><Icon aria-hidden="true" /></span><div><h3>{title}</h3><p>{text}</p></div></li>)}</ul>
  </div></section>;
}
