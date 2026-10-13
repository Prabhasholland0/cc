import { workExamples, customerReviews, teamPhotos } from '../data/customerProof';
export function CustomerProof({ serviceId }: { serviceId?: string }) {
  const work = workExamples.filter(item => item.consentConfirmed && (!serviceId || item.serviceId === serviceId));
  const reviews = customerReviews.filter(item => item.consentConfirmed && (!serviceId || item.serviceId === serviceId));
  const photos = teamPhotos.filter(item => item.consentConfirmed);
  if (!work.length && !reviews.length && !photos.length) return null;
  return <section className="customer-proof page-width"><div className="section-heading"><span className="eyebrow">OUR WORK, IN REAL HOMES</span><h2>See the care for yourself.</h2></div>{work.map(item => <figure key={item.id}><div className="before-after"><div><span>Before</span><img src={item.before} alt={`Before: ${item.caption}`} loading="lazy" /></div><div><span>After</span><img src={item.after} alt={`After: ${item.caption}`} loading="lazy" /></div></div><figcaption>{item.caption}</figcaption></figure>)}{reviews.map(review => <blockquote key={review.id}><p>“{review.quote}”</p><cite>{review.name}</cite></blockquote>)}<div className="team-photos">{photos.map(photo => <figure key={photo.id}><img src={photo.src} alt={photo.caption} loading="lazy" /><figcaption>{photo.caption}</figcaption></figure>)}</div></section>;
}
