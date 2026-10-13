import { siteSettings } from '../data/siteSettings';
export function OfferBanner() {
  const { offer } = siteSettings;
  if (!offer.enabled) return null;
  return <div className="offer-banner" role="note"><div className="page-width"><strong>{offer.text}</strong>{offer.detail && <span>{offer.detail}</span>}</div></div>;
}
