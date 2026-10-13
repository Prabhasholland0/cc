// Writes dist/services/<id>/index.html so each service page has its own title,
// description, canonical URL, social preview and structured data before JavaScript runs.
import fs from 'node:fs';
import path from 'node:path';
import { DEFAULT_PRICING } from '../src/data/defaultPricing';
import { faqs, serviceCopy, serviceFaqs } from '../src/data/customerContent';
import { money, startingRate } from '../src/lib/pricing';
import type { PricingConfig } from '../src/types';
import { areaFaqs, serviceAreas } from '../src/data/areas';

const SITE = 'https://cleancorners.in';
const dist = path.resolve('dist');
// Use the live rate card when the server has one, so prices match what staff last saved.
const pricingFile = path.join(process.env.DATA_DIR || path.resolve('server/data'), 'pricing.json');
const pricing: PricingConfig = fs.existsSync(pricingFile) ? JSON.parse(fs.readFileSync(pricingFile, 'utf8')) : DEFAULT_PRICING;
const template = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');
const escape = (value: string) => value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const json = (value: unknown) => JSON.stringify(value).replace(/</g, '\\u003c');
const setMeta = (html: string, pattern: RegExp, content: string) => {
  if (!pattern.test(html)) throw new Error(`Prerender: tag not found for ${pattern}`);
  return html.replace(pattern, (_match, before: string) => `${before}${escape(content)}"`);
};

function writePage(route: string, meta: { title: string; description: string; url: string; image: string; ogTitle: string; schemas: unknown[] }) {
  let html = template.replace(/<title>[^<]*<\/title>/, `<title>${escape(meta.title)}</title>`);
  html = setMeta(html, /(<meta name="description" content=")[^"]*"/, meta.description);
  html = setMeta(html, /(<link rel="canonical" href=")[^"]*"/, meta.url);
  html = setMeta(html, /(<meta property="og:url" content=")[^"]*"/, meta.url);
  html = setMeta(html, /(<meta property="og:title" content=")[^"]*"/, meta.ogTitle);
  html = setMeta(html, /(<meta property="og:description" content=")[^"]*"/, meta.description);
  html = setMeta(html, /(<meta property="og:image" content=")[^"]*"/, meta.image);
  html = setMeta(html, /(<meta name="twitter:title" content=")[^"]*"/, meta.ogTitle);
  html = setMeta(html, /(<meta name="twitter:description" content=")[^"]*"/, meta.description);
  html = setMeta(html, /(<meta name="twitter:image" content=")[^"]*"/, meta.image);
  html = html.replace(/\s*<link rel="preload" as="image"[^>]*>/, '');
  html = html.replace(/\s*<script type="application\/ld\+json">\{"@context": "https:\/\/schema.org", "@type": "FAQPage"[\s\S]*?<\/script>/, '');
  html = html.replace('</head>', `    <script type="application/ld+json" id="page-schema">${json(meta.schemas)}</script>\n  </head>`);
  const out = path.join(dist, route, 'index.html');
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, html);
  console.log(`prerendered /${route}`);
}
const faqSchema = (items: [string, string][]) => ({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: items.map(([name, text]) => ({ '@type': 'Question', name, acceptedAnswer: { '@type': 'Answer', text } })) });

for (const area of serviceAreas) {
  const url = `${SITE}/areas/${area.slug}`;
  writePage(`areas/${area.slug}`, {
    title: `Home Cleaning in ${area.name}, Secunderabad | Clean Corners`,
    description: `Deep cleaning, sofa shampooing, water tank cleaning and painting in ${area.name}. Local team from Sainikpuri, upfront prices, pay after inspection. Call 95154 47834.`,
    url, image: `${SITE}/og-image.jpg`, ogTitle: `Home cleaning in ${area.name} · Clean Corners`,
    schemas: [
      { '@context': 'https://schema.org', '@type': 'Service', name: `Home cleaning in ${area.name}`, serviceType: 'House cleaning', url, areaServed: { '@type': 'Place', name: `${area.name}, Secunderabad, Telangana` }, provider: { '@id': `${SITE}/#business` } },
      { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` }, { '@type': 'ListItem', position: 2, name: 'Service areas', item: `${SITE}/#coverage` }, { '@type': 'ListItem', position: 3, name: area.name, item: url }] },
      faqSchema([...areaFaqs(area), ...faqs]),
    ],
  });
}

for (const service of pricing.services) {
  const url = `${SITE}/services/${service.id}`;
  const summary = serviceCopy[service.id]?.summary || service.tagline;
  const title = `${service.title} in Sainikpuri & Secunderabad | Clean Corners`;
  const description = `${summary} From ${money(startingRate(service))}. Pay after inspection. Call 95154 47834.`;
  const image = fs.existsSync(path.join(dist, 'og', `${service.id}.jpg`)) ? `${SITE}/og/${service.id}.jpg` : `${SITE}/og-image.jpg`;
  let html = template.replace(/<title>[^<]*<\/title>/, `<title>${escape(title)}</title>`);
  html = setMeta(html, /(<meta name="description" content=")[^"]*"/, description);
  html = setMeta(html, /(<link rel="canonical" href=")[^"]*"/, url);
  html = setMeta(html, /(<meta property="og:url" content=")[^"]*"/, url);
  html = setMeta(html, /(<meta property="og:title" content=")[^"]*"/, `${service.title} · Clean Corners`);
  html = setMeta(html, /(<meta property="og:description" content=")[^"]*"/, description);
  html = setMeta(html, /(<meta property="og:image" content=")[^"]*"/, image);
  html = setMeta(html, /(<meta property="og:image:alt" content=")[^"]*"/, `${service.title} by Clean Corners`);
  html = setMeta(html, /(<meta name="twitter:title" content=")[^"]*"/, `${service.title} · Clean Corners`);
  html = setMeta(html, /(<meta name="twitter:description" content=")[^"]*"/, description);
  html = setMeta(html, /(<meta name="twitter:image" content=")[^"]*"/, image);
  // Drop the homepage hero preload and FAQ schema; add this service's own schema instead.
  html = html.replace(/\s*<link rel="preload" as="image"[^>]*>/, '');
  html = html.replace(/\s*<script type="application\/ld\+json">\{"@context": "https:\/\/schema.org", "@type": "FAQPage"[\s\S]*?<\/script>/, '');
  const schemas = [
    { '@context': 'https://schema.org', '@type': 'Service', name: service.title, serviceType: service.title, description: summary, url, image, areaServed: ['Sainikpuri', 'Secunderabad', 'Hyderabad'], provider: { '@id': `${SITE}/#business` }, offers: { '@type': 'AggregateOffer', priceCurrency: 'INR', lowPrice: startingRate(service), offerCount: service.packages.length } },
    { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` }, { '@type': 'ListItem', position: 2, name: 'Services', item: `${SITE}/#services` }, { '@type': 'ListItem', position: 3, name: service.title, item: url }] },
    { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: [...(serviceFaqs[service.id] || []), ...faqs].map(([name, text]) => ({ '@type': 'Question', name, acceptedAnswer: { '@type': 'Answer', text } })) },
  ];
  html = html.replace('</head>', `    <script type="application/ld+json" id="service-schema">${json(schemas)}</script>\n  </head>`);
  const out = path.join(dist, 'services', service.id, 'index.html');
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, html);
  console.log(`prerendered /services/${service.id}`);
}
