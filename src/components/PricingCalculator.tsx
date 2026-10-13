import { useState } from 'react';
import { ArrowRight, MessageCircle } from 'lucide-react';
import { estimateWhatsappLink } from '../lib/whatsapp';
import type { PricingConfig } from '../types';
import { defaultSelection } from '../lib/pricing';
import type { QuoteSelection } from '../lib/pricing';
import { ServiceConfigurator, QuoteSummary } from './ServiceConfigurator';
import { SectionHeading } from './SectionHeading';
export const PricingCalculator = ({ pricingConfig, onProceedToBook }: { pricingConfig: PricingConfig; onProceedToBook: (selection: QuoteSelection) => void }) => {
  const [selection, setSelection] = useState(() => defaultSelection(pricingConfig));
  let whatsapp = '';
  try { whatsapp = estimateWhatsappLink(pricingConfig, selection); } catch { /* The summary explains invalid selections. */ }
  return <section id="pricing" className="section section-white" aria-labelledby="pricing-title"><div className="page-width">
    <SectionHeading id="pricing-title" eyebrow="Instant estimate" title="Know the price before we visit." intro="Choose your service and scope to see an itemised estimate. Nothing is charged online, and our team confirms the final details with you." />
    <div className="estimate-layout"><ServiceConfigurator config={pricingConfig} selection={selection} onChange={setSelection} /><div className="estimate-aside"><QuoteSummary config={pricingConfig} selection={selection} /><button className="primary-button is-large w-full" onClick={() => onProceedToBook(selection)}>Continue with this estimate <ArrowRight size={18} aria-hidden="true" /></button>{whatsapp && <a className="whatsapp-button is-large w-full" href={whatsapp} target="_blank" rel="noopener noreferrer"><MessageCircle size={18} aria-hidden="true" /> Send this estimate on WhatsApp</a>}<p className="estimate-help">Prefer to talk first? <a href="#callback">Request a free callback</a></p></div></div>
  </div></section>;
};
