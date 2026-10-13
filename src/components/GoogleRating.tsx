import { Star } from 'lucide-react';
import { siteSettings } from '../data/siteSettings';
export function GoogleRating({ className = '' }: { className?: string }) {
  const { googleRating, googleReviewUrl } = siteSettings;
  if (!googleRating) return null;
  const label = <><span className="rating-stars" aria-hidden="true">{[0, 1, 2, 3, 4].map(index => <Star key={index} size={15} />)}</span><strong>{googleRating.rating.toFixed(1)}</strong> on Google · {googleRating.count.toLocaleString('en-IN')} reviews</>;
  return googleReviewUrl
    ? <a className={`google-rating ${className}`} href={googleReviewUrl} target="_blank" rel="noopener noreferrer">{label}</a>
    : <span className={`google-rating ${className}`}>{label}</span>;
}
