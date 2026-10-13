import { serviceCopy } from '../data/customerContent';
import { money, startingRate } from '../lib/pricing';
import { responsiveImage } from '../lib/images';
import type { ServiceItem } from '../types';
import { SectionHeading } from './SectionHeading';
import { Home, UtensilsCrossed, Droplets, Armchair, PaintRoller, Waves, ArrowRight } from 'lucide-react';
interface ServicesGridProps { services: ServiceItem[]; }
const serviceIcons = { 'full-home': Home, kitchen: UtensilsCrossed, bathroom: Droplets, 'sofa-carpet': Armchair, painting: PaintRoller, 'water-tank': Waves };
export const ServicesGrid = ({ services }: ServicesGridProps) => (
  <section id="services" className="section section-white" aria-labelledby="services-title">
    <div className="page-width">
      <SectionHeading id="services-title" eyebrow="Our services" title="Everything your home needs, under one roof." intro="From a single sofa to a full move-in deep clean. Every service comes with a clear scope and a price you can check before booking." action={<a href="#pricing" className="text-button">Build your estimate <ArrowRight size={16} aria-hidden="true" /></a>} />
      <ul className="service-grid">
        {services.filter(service => service.id !== 'express-addons').map(service => {
          const Icon = serviceIcons[service.id as keyof typeof serviceIcons] || Home;
          const image = responsiveImage(service.image, '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px');
          return <li key={service.id}><a className="service-card" href={`/services/${service.id}`}>
            <div className="service-image"><img {...image} alt="" loading="lazy" decoding="async" /><span className="service-price">From {money(startingRate(service))}</span></div>
            <div className="service-card-body">
              <div className="service-card-title"><span className="service-icon"><Icon aria-hidden="true" /></span><h3>{service.title}</h3></div>
              <p>{serviceCopy[service.id]?.summary || service.tagline}</p>
              <span className="service-card-link">View packages & pricing <ArrowRight size={16} aria-hidden="true" /></span>
            </div>
          </a></li>;
        })}
      </ul>
    </div>
  </section>
);
