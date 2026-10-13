import type { ReactNode } from 'react';
interface SectionHeadingProps { eyebrow: string; title: ReactNode; intro?: ReactNode; id?: string; align?: 'left' | 'center'; action?: ReactNode; }
export const SectionHeading = ({ eyebrow, title, intro, id, align = 'left', action }: SectionHeadingProps) => (
  <div className={`section-heading ${align === 'center' ? 'is-centered' : ''} ${action ? 'has-action' : ''}`}>
    <div>
      <span className="eyebrow">{eyebrow}</span>
      <h2 id={id}>{title}</h2>
      {intro && <p>{intro}</p>}
    </div>
    {action}
  </div>
);
