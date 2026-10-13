import { useEffect } from 'react';
import { ArrowRight, Check, X, Clock, Tag, ChevronRight, MessageCircle } from 'lucide-react';
import type { ServiceItem } from '../types';
import { money, startingRate } from '../lib/pricing';
import { responsiveImage } from '../lib/images';
import { faqs, serviceCopy, serviceFaqs } from '../data/customerContent';
import { whatsappLink } from '../lib/whatsapp';
import { CallbackRequest } from './CallbackRequest';
import { Promises } from './Promises';
import { CustomerProof } from './CustomerProof';
import { FAQ } from './FAQ';
export function ServicePage({ service, services, onBook }: { service: ServiceItem; services: ServiceItem[]; onBook: (id: string, packageId?: string) => void }) {
  const copy = serviceCopy[service.id];
  const image = responsiveImage(service.image, '(max-width: 860px) 100vw, 600px');
  useEffect(() => {
    const previous = document.title;
    const description = document.querySelector('meta[name="description"]');
    const canonical = document.querySelector('link[rel="canonical"]');
    const ogUrl = document.querySelector('meta[property="og:url"]');
    const oldDescription = description?.getAttribute('content') || '';
    const oldCanonical = canonical?.getAttribute('href') || '';
    const url = `https://cleancorners.in/services/${service.id}`;
    document.title = `${service.title} in Sainikpuri & Secunderabad | Clean Corners`;
    description?.setAttribute('content', `${copy?.summary || service.tagline} From ${money(startingRate(service))}. Pay after inspection. Call 95154 47834.`);
    canonical?.setAttribute('href', url);
    ogUrl?.setAttribute('content', url);
    // Prerendered pages already carry this schema in the HTML.
    const schema = document.createElement('script');
    schema.type = 'application/ld+json';
    schema.textContent = JSON.stringify({
      '@context': 'https://schema.org', '@type': 'Service', name: service.title, serviceType: service.title, description: copy?.summary || service.tagline, url,
      areaServed: ['Sainikpuri', 'Secunderabad', 'Hyderabad'], provider: { '@id': 'https://cleancorners.in/#business' },
      offers: { '@type': 'AggregateOffer', priceCurrency: 'INR', lowPrice: startingRate(service), offerCount: service.packages.length },
    });
    if (!document.getElementById('service-schema')) document.head.appendChild(schema);
    return () => { document.title = previous; description?.setAttribute('content', oldDescription); canonical?.setAttribute('href', oldCanonical); ogUrl?.setAttribute('content', 'https://cleancorners.in/'); schema.remove(); };
  }, [service, copy]);
  return <>
    <section className="service-hero">
      <div className="page-width">
        <nav aria-label="Breadcrumb" className="breadcrumb"><ol><li><a href="/">Home</a><ChevronRight size={14} aria-hidden="true" /></li><li><a href="/#services">Services</a><ChevronRight size={14} aria-hidden="true" /></li><li aria-current="page">{service.title}</li></ol></nav>
        <div className="service-intro">
          <div>
            <span className="eyebrow">Sainikpuri · Secunderabad</span>
            <h1>{service.title}</h1>
            <p className="service-lead">{copy?.summary || service.tagline}</p>
            <ul className="service-facts">
              <li><Tag aria-hidden="true" /><span>From <strong>{money(startingRate(service))}</strong> · {service.unitLabel}</span></li>
              <li><Clock aria-hidden="true" /><span>Typical duration: <strong>{service.durationEst}</strong></span></li>
            </ul>
            <div className="hero-actions"><button className="primary-button is-large" onClick={() => onBook(service.id)}>Choose a package <ArrowRight size={18} aria-hidden="true" /></button><a className="whatsapp-button is-large" href={whatsappLink(`Hello Clean Corners, I have a question about ${service.title}.`)} target="_blank" rel="noopener noreferrer"><MessageCircle size={18} aria-hidden="true" /> Ask on WhatsApp</a></div>
            <p className="service-call">Or call <a href="tel:+919515447834">95154 47834</a></p>
          </div>
          <figure><img {...image} alt={`${service.title} by Clean Corners`} fetchPriority="high" decoding="async" /><figcaption>Illustrative image. Scope and availability are confirmed before booking.</figcaption></figure>
        </div>
      </div>
    </section>
    <section className="section section-white service-page"><div className="page-width">
      <div className="service-detail-grid">
        <section className="detail-card"><h2>What’s included</h2><ul className="icon-list">{service.inclusions.map(item => <li key={item}><Check aria-hidden="true" />{item}</li>)}</ul></section>
        <section className="detail-card is-muted"><h2>Not included</h2><ul className="icon-list is-excluded">{service.exclusions.map(item => <li key={item}><X aria-hidden="true" />{item}</li>)}</ul></section>
      </div>
      <section className="service-packages" aria-labelledby="packages-title">
        <div className="section-heading"><div><span className="eyebrow">Packages</span><h2 id="packages-title">Choose your scope.</h2><p>Rates are per stated unit. Minimum visit: {money(service.minOrderAmount)}. You’ll see your full estimate before sending a request.</p></div></div>
        <ul className="package-grid">{service.packages.map(pkg => <li key={pkg.id} className={`package-card ${pkg.popular ? 'is-popular' : ''}`}>
          {pkg.popular && <span className="package-badge">Most popular</span>}
          <h3>{pkg.name}</h3>
          <p className="package-price">{money(pkg.price)} <small>{service.id === 'painting' ? '/ sq ft' : pkg.unit}</small></p>
          <ul className="icon-list">{pkg.features.map(feature => <li key={feature}><Check aria-hidden="true" />{feature}</li>)}</ul>
          {(pkg.requiresInspection || service.inspectionRequired) && <p className="package-note">Inspection required for a final quote.</p>}
          <button className={pkg.popular ? 'primary-button w-full' : 'secondary-button w-full'} onClick={() => onBook(service.id, pkg.id)} aria-label={`Select ${pkg.name}`}>Select package</button>
        </li>)}</ul>
      </section>
      <div className="service-detail-grid">
        <section className="detail-card"><h2>Before the team arrives</h2><ol className="numbered-list">{copy?.preparation.map(item => <li key={item}>{item}</li>)}</ol></section>
        <section className="detail-card"><h2>Equipment & methods</h2><ul className="icon-list">{service.equipment.map(item => <li key={item}><Check aria-hidden="true" />{item}</li>)}</ul></section>
      </div>
    </div></section>
    <Promises />
    <CustomerProof serviceId={service.id} />
    <CallbackRequest services={services} serviceId={service.id} />
    <FAQ items={[...(serviceFaqs[service.id] || []), ...faqs]} title={`${service.title}: your questions, answered.`} />
  </>;
}
