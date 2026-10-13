// Service areas. Each one gets its own page at /areas/<slug>.
export interface ServiceArea {
  slug: string;
  name: string;
  /** Distance from our Sainikpuri base. */
  distance?: string;
  /** Core areas pay no travel charge. */
  core: boolean;
  /** Short description of the homes we usually clean there. */
  homes: string;
  /** Service IDs that are most requested in this area. */
  popular: string[];
}

export const serviceAreas: ServiceArea[] = [
  { slug: 'sainikpuri', name: 'Sainikpuri', distance: '0 km', core: true, homes: 'our home base, with apartments, independent houses and villas', popular: ['full-home', 'sofa-carpet', 'water-tank', 'painting'] },
  { slug: 'defence-colony', name: 'Defence Colony', distance: '1.2 km', core: true, homes: 'family homes that book full home and sofa cleaning most often', popular: ['full-home', 'sofa-carpet', 'kitchen'] },
  { slug: 'vayupuri', name: 'Vayupuri', distance: '1.8 km', core: true, homes: 'homes that book regular housekeeping and painting', popular: ['full-home', 'painting', 'bathroom'] },
  { slug: 'yapral-kowkoor', name: 'Yapral & Kowkoor', distance: '2.5 km', core: true, homes: 'villas and gated communities', popular: ['full-home', 'water-tank', 'painting'] },
  { slug: 'as-rao-nagar', name: 'AS Rao Nagar', distance: '2.8 km', core: true, homes: 'apartments and offices', popular: ['full-home', 'kitchen', 'bathroom'] },
  { slug: 'neredmet-rk-puram', name: 'Neredmet & RK Puram', distance: '3.4 km', core: true, homes: 'homes that book deep cleaning and water tank cleaning', popular: ['full-home', 'water-tank', 'sofa-carpet'] },
  { slug: 'kapra-ecil', name: 'Kapra & ECIL', distance: '4.2 km', core: true, homes: 'family homes and apartments', popular: ['full-home', 'sofa-carpet', 'kitchen'] },
  { slug: 'alwal-lothkunta', name: 'Alwal & Lothkunta', distance: '5.5 km', core: true, homes: 'independent houses and duplexes', popular: ['water-tank', 'painting', 'full-home'] },
  ...['Moula Ali', 'Malkajgiri', 'Trimulgherry', 'Karkhana', 'East & West Marredpally', 'Tarnaka', 'Habsiguda', 'Secunderabad Cantonment', 'Padmarao Nagar', 'Bolarum'].map(name => ({
    slug: name.toLowerCase().replace(/&/g, '').replace(/[^a-z]+/g, '-').replace(/^-|-$/g, ''),
    name, core: false, homes: 'apartments and independent homes', popular: ['full-home', 'sofa-carpet', 'water-tank'],
  })),
];

export const coreAreas = serviceAreas.filter(area => area.core);
export const extendedAreas = serviceAreas.filter(area => !area.core);
export const findArea = (slug?: string) => serviceAreas.find(area => area.slug === slug);

export function areaFaqs(area: ServiceArea): [string, string][] {
  return [
    [`Do you charge for travel to ${area.name}?`, area.core
      ? `No. ${area.name} is one of our core areas, so there is no travel charge. Your quote includes equipment and travel.`
      : `We serve ${area.name} regularly from our Sainikpuri base. We confirm availability and any travel charge when we call you, before anything is booked.`],
    [`How soon can you come to ${area.name}?`, 'Choose your preferred date when you request a visit. Our team calls to confirm the earliest available slot. A priority slot can be requested for an extra fee, subject to availability.'],
    ['Do I pay in advance?', 'No. Inspect the finished work with the team, then pay by UPI or cash.'],
  ];
}
