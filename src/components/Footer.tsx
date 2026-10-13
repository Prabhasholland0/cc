import { BrandLogo } from './BrandLogo';
import { coreAreas } from '../data/areas';
import { siteSettings } from '../data/siteSettings';
import { Phone, MapPin, MessageCircle, Clock, ArrowRight } from 'lucide-react';

interface FooterProps { onOpenPrivacy: () => void; onOpenTerms: () => void; onOpenBooking: () => void; }

const CURRENT_YEAR = new Date().getFullYear();
const whatsappUrl = 'https://wa.me/919515447834?text=Hello%20Clean%20Corners%2C%20I%20would%20like%20to%20enquire%20about%20cleaning%20services.';
const serviceLinks = [['Full home deep cleaning', '/services/full-home'], ['Kitchen deep cleaning', '/services/kitchen'], ['Bathroom deep cleaning', '/services/bathroom'], ['Sofa & carpet shampooing', '/services/sofa-carpet'], ['Water tank cleaning', '/services/water-tank'], ['Interior & exterior painting', '/services/painting'], ['Express add-ons', '/services/express-addons']];


export const Footer = ({ onOpenPrivacy, onOpenTerms, onOpenBooking }: FooterProps) => (
  <footer id="contact" className="site-footer">
    <div className="page-width">
      <div className="footer-cta">
        <div>
          <span className="eyebrow">Ready when you are</span>
          <h2>Book your home cleaning today.</h2>
          <p>Get a clear estimate in minutes. Our team confirms the details and you pay only after the work is done.</p>
        </div>
        <div className="footer-cta-actions">
          <button onClick={onOpenBooking} className="primary-button is-large is-light">Book a cleaning <ArrowRight size={18} aria-hidden="true" /></button>
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="whatsapp-button is-large"><MessageCircle size={18} aria-hidden="true" /> Chat on WhatsApp</a>
        </div>
      </div>

      <div className="footer-grid">
        <div className="footer-brand">
          <span className="footer-logo"><BrandLogo size="lg" /></span>
          <p>Professional housekeeping and home-improvement services in Sainikpuri and Secunderabad: deep cleaning, sofa and carpet shampooing, water tank cleaning and painting.</p>
        </div>
        <nav aria-labelledby="footer-services"><h3 id="footer-services">Services</h3><ul>{serviceLinks.map(([label, href]) => <li key={href}><a href={href}>{label}</a></li>)}</ul></nav>
        <nav aria-labelledby="footer-areas"><h3 id="footer-areas">Areas we serve</h3><ul>{coreAreas.map(area => <li key={area.slug}><a href={`/areas/${area.slug}`}>{area.name}</a></li>)}<li><a href="/#coverage">All areas</a></li></ul></nav>
        <div>
          <h3>Contact</h3>
          <address className="footer-contact">
            <span><MapPin aria-hidden="true" /> <span>Sainikpuri, Secunderabad,<br />Telangana 500094</span></span>
            <span><Phone aria-hidden="true" /> <span><a href="tel:+919515447834">95154 47834</a><br /><a href="tel:+919391459522">93914 59522</a></span></span>
            <span><Clock aria-hidden="true" /> <span>Monday – Sunday<br />8:00 AM – 7:30 PM</span></span>
          </address>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {CURRENT_YEAR} Clean Corners Housekeeping Services. All rights reserved.</p>
        <div><a href="/track">Track my booking</a>{siteSettings.googleReviewUrl && <a href={siteSettings.googleReviewUrl} target="_blank" rel="noopener noreferrer">Review us on Google</a>}<button onClick={onOpenPrivacy}>Privacy policy</button><button onClick={onOpenTerms}>Terms & conditions</button></div>
      </div>
    </div>
  </footer>
);
