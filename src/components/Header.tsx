import { useEffect, useState } from 'react';
import { BrandLogo } from './BrandLogo';
import { Phone, MapPin, Menu, X, ArrowRight, Clock, Search } from 'lucide-react';
interface HeaderProps {
  onOpenBooking: (serviceId?: string, packageId?: string) => void;
  onOpenAdmin: () => void;
}
const links = [['Services', '/#services'], ['How it works', '/#how-it-works'], ['Pricing', '/#pricing'], ['Service areas', '/#coverage'], ['FAQ', '/#faq']];
export const Header = ({ onOpenBooking, onOpenAdmin }: HeaderProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const close = (event: KeyboardEvent) => { if (event.key === 'Escape') setMobileMenuOpen(false); };
    const scroll = () => setScrolled(window.scrollY > 8);
    scroll();
    window.addEventListener('keydown', close);
    window.addEventListener('scroll', scroll, { passive: true });
    return () => { window.removeEventListener('keydown', close); window.removeEventListener('scroll', scroll); };
  }, []);
  return (
    <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`}>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <div className="utility-bar"><div className="page-width">
        <span><MapPin size={14} aria-hidden="true" /> Home cleaning & care in Sainikpuri, Secunderabad</span>
        <span className="utility-contact">
          <a href="/track" className="utility-track"><Search size={14} aria-hidden="true" /> Track my booking</a>
          <span className="utility-hours"><Clock size={14} aria-hidden="true" /> Mon–Sun, 8am–7:30pm</span>
          <a href="tel:+919515447834"><Phone size={14} aria-hidden="true" /> 95154 47834</a>
        </span>
      </div></div>
      <div className="main-navigation page-width">
        <a href="/" className="brand-link" aria-label="Clean Corners home"><BrandLogo /></a>
        <nav className="desktop-navigation" aria-label="Main navigation">{links.map(([label, href]) => <a key={href} href={href}>{label}</a>)}</nav>
        <div className="nav-actions">
          <button className="staff-button" onClick={onOpenAdmin}>Staff login</button>
          <button className="nav-book primary-button" onClick={() => onOpenBooking()}>Book a cleaning <ArrowRight size={16} aria-hidden="true" /></button>
          <button className="menu-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'} aria-expanded={mobileMenuOpen} aria-controls="mobile-navigation">{mobileMenuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}</button>
        </div>
      </div>
      {mobileMenuOpen && <nav id="mobile-navigation" className="mobile-navigation" aria-label="Mobile navigation">
        {links.map(([label, href]) => <a key={href} href={href} onClick={() => setMobileMenuOpen(false)}>{label}<ArrowRight size={16} aria-hidden="true" /></a>)}
        <button className="primary-button" onClick={() => { setMobileMenuOpen(false); onOpenBooking(); }}>Book a cleaning <ArrowRight size={16} aria-hidden="true" /></button>
        <a className="secondary-button" href="/track"><Search size={16} aria-hidden="true" /> Track my booking</a>
        <a className="secondary-button" href="tel:+919515447834"><Phone size={16} aria-hidden="true" /> Call 95154 47834</a>
        <div className="staff-links"><button onClick={() => { setMobileMenuOpen(false); onOpenAdmin(); }}>Staff login</button></div>
      </nav>}
    </header>
  );
};
