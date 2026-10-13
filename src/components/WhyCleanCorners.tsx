import { ShieldCheck, Wrench, ListChecks, Wallet, MapPin, BadgeCheck } from 'lucide-react';
import { responsiveImage } from '../lib/images';
import { SectionHeading } from './SectionHeading';

const standards = [
  { icon: Wrench, title: 'Professional equipment', description: 'Single-disc rotary scrubbers, injection-extraction upholstery shampooers and submersible slurry pumps.' },
  { icon: ShieldCheck, title: 'Surface-safe products', description: 'Non-acidic, pH-balanced descalers that lift hard-water scale without harming glazed tiles or chrome.' },
  { icon: ListChecks, title: 'Written checklists', description: 'Every visit follows an itemised scope, checked off by the team supervisor before handover.' },
  { icon: Wallet, title: 'Inspect first, then pay', description: 'No online advance. Walk through every cleaned room, then pay by UPI or cash.' },
];
const aboutImage = responsiveImage('/images/about-living-room.jpg', '(max-width: 1024px) 100vw, 600px');

export const WhyCleanCorners = () => (
  <>
    <section id="about" className="section section-white" aria-labelledby="about-title">
      <div className="page-width about-layout">
        <div className="about-copy">
          <span className="eyebrow">About Clean Corners</span>
          <h2 id="about-title">More than just a cleaning company.</h2>
          <p>Clean Corners is a local housekeeping and home-improvement team based in Sainikpuri. We turn lived-in homes into fresh, welcoming spaces, from detailed deep cleaning to a fresh coat of paint, and we treat every home with the same care we’d want in our own.</p>
          <ul className="about-points">
            <li><span><MapPin aria-hidden="true" /></span><div><strong>Based in Sainikpuri</strong><small>Quick to reach homes across Secunderabad and Hyderabad</small></div></li>
            <li><span><BadgeCheck aria-hidden="true" /></span><div><strong>Clear rate-card pricing</strong><small>The same published rates, online and on the invoice</small></div></li>
          </ul>
        </div>
        <figure className="about-visual">
          <img {...aboutImage} alt="Bright, freshly cleaned modern living room" loading="lazy" decoding="async" />
        </figure>
      </div>
    </section>

    <section id="standards" className="section section-dark standards-band" aria-labelledby="standards-title">
      <div className="page-width">
        <SectionHeading id="standards-title" eyebrow="Our standards" title="Professional care, on every visit." intro="The right equipment, safe products and a written checklist, so you always know what you’re getting." />
        <ul className="feature-grid">
          {standards.map(({ icon: Icon, title, description }) => (
            <li key={title} className="feature-card">
              <span className="feature-icon"><Icon aria-hidden="true" /></span>
              <h3>{title}</h3>
              <p>{description}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  </>
);
