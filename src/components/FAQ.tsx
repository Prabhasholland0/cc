import { ChevronDown } from 'lucide-react';
import { faqs } from '../data/customerContent';
import { SectionHeading } from './SectionHeading';
interface FAQProps { items?: [string, string][]; title?: string; tone?: 'white' | 'tint'; }
export function FAQ({ items = faqs, title = 'Questions, answered.', tone = 'white' }: FAQProps) {
  return <section className={`section section-${tone}`} id="faq" aria-labelledby="faq-title"><div className="page-width faq-layout">
    <SectionHeading id="faq-title" eyebrow="FAQ" title={title} intro={<>Can’t find what you’re looking for? Call <a href="tel:+919515447834">95154 47834</a> or message us on WhatsApp.</>} />
    <div className="faq-list">{items.map(([question, answer]) => <details key={question}><summary>{question}<ChevronDown size={20} aria-hidden="true" /></summary><p>{answer}</p></details>)}</div>
  </div></section>;
}
