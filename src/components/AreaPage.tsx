import { useEffect } from 'react';
import { ArrowRight, ChevronRight, MapPin, MessageCircle, Check } from 'lucide-react';
import type { ServiceItem } from '../types';
import type { ServiceArea } from '../data/areas';
import { areaFaqs, coreAreas, serviceAreas } from '../data/areas';
import { faqs, serviceCopy } from '../data/customerContent';
import { money, startingRate } from '../lib/pricing';
import { responsiveImage } from '../lib/images';
import { whatsappLink } from '../lib/whatsapp';
import { HowItWorks } from './HowItWorks';
import { Promises } from './Promises';
import { CallbackRequest } from './CallbackRequest';
import { FAQ } from './FAQ';
import { GoogleRating } from './GoogleRating';

interface Props { area: ServiceArea; services: ServiceItem[]; onBook: (serviceId?: string) => void; }

export function AreaPage({ area, services, onBook }: Props) {
  const visible = services.filter(service => service.id !== 'express-addons');
  const popular = area.popular.map(id => visible.find(service => service.id === id)).filter((service): service is ServiceItem => !!service);
  const nearby = (area.core ? coreAreas : serviceAreas).filter(item => item.slug !== area.slug).slice(0, 8);
  const lowest = Math.min(...visible.map(startingRate));

  useEffect(() => {
    const previous = document.title;
    const description = document.querySelector('meta[name="description"]');
    const canonical = document.querySelector('link[rel="canonical"]');
    const oldDescription = description?.getAttribute('content') || '';
    const oldCanonical = canonical?.getAttribute('href') || '';
    document.title = `Home Cleaning in ${area.name}, Secunderabad | Clean Corners`;
    description?.setAttribute('content', `Deep cleaning, sofa shampooing, water tank cleaning and painting in ${area.name}. Local team from Sainikpuri, upfront prices, pay after inspection. Call 95154 47834.`);
    canonical?.setAttribute('href', `https://cleancorners.in/areas/${area.slug}`);
    return () => { document.title = previous; description?.setAttribute('content', oldDescription); canonical?.setAttribute('href', oldCanonical); };
  }, [area]);

  return <>
    <section className="service-hero area-hero">
      <div className="page-width">
        <nav aria-label="Breadcrumb" className="breadcrumb"><ol><li><a href="/">Home</a><ChevronRight size={14} aria-hidden="true" /></li><li><a href="/#coverage">Service areas</a><ChevronRight size={14} aria-hidden="true" /></li><li aria-current="page">{area.name}</li></ol></nav>
        <div className="area-intro">
          <span className="eyebrow"><MapPin size={14} aria-hidden="true" /> {area.distance ? `${area.distance} from our Sainikpuri base` : 'Served from our Sainikpuri base'}</span>
          <h1>Home cleaning in {area.name}.</h1>
          <p className="service-lead">Deep cleaning, sofa and carpet shampooing, water tank cleaning and painting for {area.homes} in {area.name}. Prices start at {money(lowest)}, you see your estimate before we visit, and you pay only after inspecting the work.</p>
          <ul className="area-facts">
            <li><Check aria-hidden="true" /> {area.core ? 'No travel charge' : 'Travel confirmed when we call'}</li>
            <li><Check aria-hidden="true" /> No advance payment</li>
            <li><Check aria-hidden="true" /> Team brings all equipment</li>
          </ul>
          <GoogleRating />
          <div className="hero-actions">
            <button className="primary-button is-large" onClick={() => onBook()}>Book in {area.name} <ArrowRight size={18} aria-hidden="true" /></button>
            <a className="whatsapp-button is-large" href={whatsappLink(`Hello Clean Corners, I'd like a cleaning quote for my home in ${area.name}.`)} target="_blank" rel="noopener noreferrer"><MessageCircle size={18} aria-hidden="true" /> WhatsApp us</a>
          </div>
        </div>
      </div>
    </section>

    <section className="section section-white" aria-labelledby="area-services-title"><div className="page-width">
      <div className="section-heading"><div><span className="eyebrow">Popular in {area.name}</span><h2 id="area-services-title">What {area.name} homes book most.</h2></div><a href="/#services" className="text-button">All services <ArrowRight size={16} aria-hidden="true" /></a></div>
      <ul className="service-grid">{popular.map(service => {
        const image = responsiveImage(service.image, '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px');
        return <li key={service.id}><a className="service-card" href={`/services/${service.id}`}>
          <div className="service-image"><img {...image} alt="" loading="lazy" decoding="async" /><span className="service-price">From {money(startingRate(service))}</span></div>
          <div className="service-card-body"><div className="service-card-title"><h3>{service.title} in {area.name}</h3></div><p>{serviceCopy[service.id]?.summary || service.tagline}</p><span className="service-card-link">View packages & pricing <ArrowRight size={16} aria-hidden="true" /></span></div>
        </a></li>;
      })}</ul>
      <p className="area-more">Also available in {area.name}: {visible.filter(service => !area.popular.includes(service.id)).map((service, index, list) => <span key={service.id}><a href={`/services/${service.id}`}>{service.title}</a>{index < list.length - 1 ? ', ' : '.'}</span>)}</p>
    </div></section>

    <HowItWorks />
    <Promises />
    <CallbackRequest services={services} />
    <FAQ items={[...areaFaqs(area), ...faqs]} title={`Cleaning in ${area.name}: your questions, answered.`} />

    <section className="section section-tint" aria-labelledby="nearby-title"><div className="page-width">
      <div className="section-heading"><div><span className="eyebrow">Nearby</span><h2 id="nearby-title">We also clean homes near {area.name}.</h2></div></div>
      <ul className="chip-list">{nearby.map(item => <li key={item.slug}><a href={`/areas/${item.slug}`}>{item.name}</a></li>)}</ul>
    </div></section>
  </>;
}
