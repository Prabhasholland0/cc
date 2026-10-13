import { ClipboardList, PhoneCall, Sparkles, Wallet } from 'lucide-react';
import { SectionHeading } from './SectionHeading';
const steps = [
  { icon: ClipboardList, title: 'Choose your service', text: 'Pick a service and scope online and see your estimate instantly. No sign-up needed.' },
  { icon: PhoneCall, title: 'We confirm the details', text: 'Our team calls to confirm the scope, final price and a time that suits you.' },
  { icon: Sparkles, title: 'We clean, carefully', text: 'A trained team arrives with professional equipment and works through a written checklist.' },
  { icon: Wallet, title: 'Inspect, then pay', text: 'Walk through the finished work with the supervisor. Pay by UPI or cash only when you’re happy.' },
];
export const HowItWorks = () => (
  <section id="how-it-works" className="section section-tint" aria-labelledby="how-title">
    <div className="page-width">
      <SectionHeading id="how-title" eyebrow="How it works" title="Booking a clean takes a few minutes." intro="A simple, transparent process from estimate to a sparkling home." align="center" />
      <ol className="steps-grid">
        {steps.map(({ icon: Icon, title, text }, index) => <li key={title} className="step-card">
          <span className="step-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
          <span className="step-icon"><Icon aria-hidden="true" /></span>
          <h3>{title}</h3>
          <p>{text}</p>
        </li>)}
      </ol>
    </div>
  </section>
);
