import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ServicesGrid } from './components/ServicesGrid';
import { PricingCalculator } from './components/PricingCalculator';
import { ServiceAreas } from './components/ServiceAreas';
import { WhyCleanCorners } from './components/WhyCleanCorners';
import { Footer } from './components/Footer';
import { BookingModal } from './components/BookingModal';
import { AdminPortal } from './components/AdminPortal';
import { PrivacyPolicyModal } from './components/PrivacyPolicyModal';
import { TermsConditionsModal } from './components/TermsConditionsModal';
import { ServicePage } from './components/ServicePage';
import { CustomerProof } from './components/CustomerProof';
import { FAQ } from './components/FAQ';
import { HowItWorks } from './components/HowItWorks';
import { CallbackRequest } from './components/CallbackRequest';
import { TrackBooking } from './components/TrackBooking';
import { AreaPage } from './components/AreaPage';
import { Promises } from './components/Promises';
import { Plans } from './components/Plans';
import { OfferBanner } from './components/OfferBanner';
import { findArea } from './data/areas';
import { Phone } from 'lucide-react';
import { DEFAULT_PRICING } from './data/defaultPricing';
import { fetchPricing } from './services/api';
import { defaultSelection } from './lib/pricing';
import type { QuoteSelection } from './lib/pricing';
import type { PricingConfig } from './types';
export function App() {
  const [pricingConfig, setPricingConfig] = useState<PricingConfig>(DEFAULT_PRICING);
  const [booking, setBooking] = useState<QuoteSelection | null>(null);
  const [adminOpen, setAdminOpen] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);
  const [pricingAvailable, setPricingAvailable] = useState(false);
  useEffect(() => { fetchPricing().then(data => { setPricingConfig(data); setPricingAvailable(true); }).catch(() => setPricingAvailable(false)); }, []);
  const openBooking = (serviceId?: string, packageId?: string) => setBooking(defaultSelection(pricingConfig, serviceId, packageId));
  const servicePath = window.location.pathname.match(/^\/services\/([^/]+)\/?$/)?.[1];
  const service = pricingConfig.services.find(s => s.id === servicePath);
  const areaPath = window.location.pathname.match(/^\/areas\/([^/]+)\/?$/)?.[1];
  const area = findArea(areaPath);
  const trackPage = /^\/track\/?$/.test(window.location.pathname);
  const notFound = window.location.pathname !== '/' && !service && !trackPage && !area;
  const explorePricing = () => { if (service || notFound || trackPage || area) window.location.href = '/#pricing'; else document.getElementById('pricing')?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' }); };
  return <div className="site-shell">
    <OfferBanner />
    <Header onOpenBooking={() => openBooking(service?.id)} onOpenAdmin={() => setAdminOpen(true)} />
    <main id="main-content" className="grow" tabIndex={-1}>
      {!pricingAvailable && <p className="pricing-notice" role="status">Showing reference rates while live pricing is unavailable. Your request is saved only when the server confirms it.</p>}
      {notFound ? <section className="page-width not-found"><span className="eyebrow">Page not found</span><h1>We couldn’t find that page.</h1><p>The link may be out of date. Head back home or browse our services.</p><a className="primary-button" href="/">Return to home</a></section> : trackPage ? <TrackBooking /> : area ? <AreaPage area={area} services={pricingConfig.services} onBook={serviceId => openBooking(serviceId)} /> : service ? <ServicePage service={service} services={pricingConfig.services} onBook={openBooking} /> : <>
        <Hero onOpenBooking={() => openBooking()} onExplorePricing={explorePricing} />
        <ServicesGrid services={pricingConfig.services} />
        <HowItWorks />
        <Promises />
        <CustomerProof />
        <WhyCleanCorners />
        <PricingCalculator pricingConfig={pricingConfig} onProceedToBook={setBooking} />
        <Plans />
        <CallbackRequest services={pricingConfig.services} />
        <ServiceAreas onOpenBooking={() => openBooking()} />
        <FAQ tone="tint" />
      </>}
    </main>
    <Footer onOpenPrivacy={() => setPrivacyOpen(true)} onOpenTerms={() => setTermsOpen(true)} onOpenBooking={() => openBooking(service?.id)} />
    {!booking && !adminOpen && !privacyOpen && !termsOpen && <div className="mobile-action-bar"><a className="mobile-call" href="tel:+919515447834" aria-label="Call Clean Corners"><Phone size={20} aria-hidden="true" /></a><button className="primary-button" onClick={() => openBooking(service?.id)}>Book a cleaning</button><a className="mobile-whatsapp" href="https://wa.me/919515447834?text=Hello%20Clean%20Corners%2C%20I%20would%20like%20a%20cleaning%20estimate." target="_blank" rel="noopener noreferrer">WhatsApp</a></div>}
    {booking && <BookingModal pricingConfig={pricingConfig} initialSelection={booking} onClose={() => setBooking(null)} />}
    <AdminPortal isOpen={adminOpen} onClose={() => setAdminOpen(false)} pricingConfig={pricingConfig} onPricingUpdated={data => { setPricingConfig(data); setPricingAvailable(true); }} />
    {privacyOpen && <PrivacyPolicyModal isOpen onClose={() => setPrivacyOpen(false)} />}
    {termsOpen && <TermsConditionsModal isOpen onClose={() => setTermsOpen(false)} />}
  </div>;
}
export default App;
