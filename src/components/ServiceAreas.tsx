import { MapPin, CheckCircle2, Phone, ArrowRight } from 'lucide-react';
import { SectionHeading } from './SectionHeading';
import { coreAreas, extendedAreas } from '../data/areas';

interface ServiceAreasProps { onOpenBooking: () => void; }

export const ServiceAreas = ({ onOpenBooking }: ServiceAreasProps) => (
  <section id="coverage" className="section section-white" aria-labelledby="coverage-title">
    <div className="page-width">
      <SectionHeading id="coverage-title" eyebrow="Service areas" title="Serving Sainikpuri, Secunderabad & Hyderabad." intro="Our teams travel from Sainikpuri with all the equipment they need. Homes in our core areas pay no travel charge." />
      <div className="coverage-layout">
        <div>
          <h3 className="coverage-subtitle"><MapPin aria-hidden="true" /> Core areas · no travel charge</h3>
          <ul className="locality-grid">
            {coreAreas.map(area => (
              <li key={area.slug}><a className="locality-card" href={`/areas/${area.slug}`}>
                <div><strong>{area.name}</strong><small>{area.homes.charAt(0).toUpperCase() + area.homes.slice(1)}</small></div>
                <span>{area.distance}</span>
              </a></li>
            ))}
          </ul>
          <h3 className="coverage-subtitle">Also serving</h3>
          <ul className="chip-list">{extendedAreas.map(area => <li key={area.slug}><a href={`/areas/${area.slug}`}>{area.name}</a></li>)}</ul>
        </div>

        <aside className="coverage-card" aria-label="Book in your area">
          <span className="feature-icon"><MapPin aria-hidden="true" /></span>
          <h3>Clean Corners</h3>
          <p className="coverage-address">Sainikpuri, Secunderabad,<br />Telangana 500094</p>
          <ul className="check-list">
            <li><CheckCircle2 aria-hidden="true" /><span><strong>Fully equipped teams.</strong> Floor scrubbers, slurry pumps and shampoo extractors come with us.</span></li>
            <li><CheckCircle2 aria-hidden="true" /><span><strong>Morning or afternoon slots.</strong> We confirm a time that suits you before the visit.</span></li>
            <li><CheckCircle2 aria-hidden="true" /><span><strong>No hidden charges.</strong> Your quote includes equipment and travel within our core areas.</span></li>
          </ul>
          <button onClick={onOpenBooking} className="primary-button is-large w-full">Book in your area <ArrowRight size={18} aria-hidden="true" /></button>
          <p className="coverage-help">Not sure we cover your area? <a href="tel:+919515447834"><Phone size={14} aria-hidden="true" /> 95154 47834</a></p>
        </aside>
      </div>
    </div>
  </section>
);
