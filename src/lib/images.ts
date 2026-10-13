// Optimised 16:9 WebP variants live in /public/images/opt as `<name>-<width>.webp`.
const variants: Record<string, number[]> = {
  'hero-specialist-clean': [640, 960, 1440],
  'about-living-room': [640, 1200],
  'service-bathroom': [480, 800, 1200],
  'service-full-home': [480, 800, 1200],
  'service-kitchen': [480, 800, 1200],
  'service-painting': [480, 800, 1200],
  'service-sofa': [480, 800, 1200],
  'service-water-tank': [480, 800, 1200],
};

export interface ResponsiveImage { src: string; srcSet?: string; sizes?: string; width?: number; height?: number; }

export function responsiveImage(src: string, sizes: string): ResponsiveImage {
  const name = src.match(/^\/images\/([\w-]+)\.(?:jpe?g|png|webp)$/)?.[1];
  const widths = name ? variants[name] : undefined;
  if (!name || !widths) return { src };
  const fallback = widths[Math.min(1, widths.length - 1)];
  return {
    src: `/images/opt/${name}-${fallback}.webp`,
    srcSet: widths.map(width => `/images/opt/${name}-${width}.webp ${width}w`).join(', '),
    sizes,
    width: fallback,
    height: Math.round(fallback * 9 / 16),
  };
}
