import { ArrowRight, Check, ShieldCheck, Sparkles, ClipboardCheck, Wallet, Star } from 'lucide-react';
import { responsiveImage } from '../lib/images';
import { GoogleRating } from './GoogleRating';
interface HeroProps { onOpenBooking: () => void; onExplorePricing: () => void; }
const heroImage = responsiveImage('/images/hero-specialist-clean.jpg', '(max-width: 860px) 100vw, 50vw');
export const Hero = ({ onOpenBooking, onExplorePricing }: HeroProps) => (
  <section className="home-hero" aria-labelledby="hero-title">
    <div className="hero-layout page-width">
      <div className="hero-copy">
        <span className="hero-badge"><Sparkles size={15} aria-hidden="true" /> Trusted local home care · Sainikpuri</span>
        <h1 id="hero-title">A cleaner home.<br />A little more <span>peace of mind.</span></h1>
        <p>Deep cleaning, sofa and carpet shampooing, water tank cleaning and painting for homes across Sainikpuri and Secunderabad. See the price before we visit, and pay only after you’ve inspected the work.</p>
        <div className="hero-actions">
          <button className="primary-button is-large" onClick={onOpenBooking}>Book your cleaning <ArrowRight size={18} aria-hidden="true" /></button>
          <button className="secondary-button is-large" onClick={onExplorePricing}>Get an instant estimate</button>
        </div>
        <GoogleRating />
        <ul className="hero-reassurance" aria-label="Why customers choose us">
          <li><Check size={16} aria-hidden="true" /> No advance payment</li>
          <li><Check size={16} aria-hidden="true" /> Itemised, upfront pricing</li>
          <li><Check size={16} aria-hidden="true" /> Pay by UPI or cash</li>
        </ul>
      </div>
      <div className="hero-visual">
        <img className="hero-photo" {...heroImage} alt="Clean Corners specialist wiping a glass table in a bright living room" fetchPriority="high" decoding="async" />
        <div className="photo-label"><Star size={15} aria-hidden="true" /> A little care. A big difference.</div>
        <div className="hero-note"><span className="note-icon"><ShieldCheck size={24} aria-hidden="true" /></span><div><strong>Inspect first, then pay</strong><span>Walk through every room with our team before you pay.</span></div></div>
      </div>
    </div>
    <div className="page-width">
      <ul className="trust-strip">
        <li><span className="trust-icon"><ShieldCheck aria-hidden="true" /></span><span><strong>Surface-safe methods</strong><small>pH-balanced products for tiles, fabric and fittings</small></span></li>
        <li><span className="trust-icon"><ClipboardCheck aria-hidden="true" /></span><span><strong>Know what’s included</strong><small>An itemised scope and checklist for every visit</small></span></li>
        <li><span className="trust-icon"><Wallet aria-hidden="true" /></span><span><strong>Pay after inspection</strong><small>No online advance. UPI or cash on completion</small></span></li>
      </ul>
    </div>
  </section>
);
