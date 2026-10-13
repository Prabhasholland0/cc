// Business promises, offers, plans and review links shown on the website.
// Everything here is OFF until you switch it on. Only switch on what you will honour
// for every customer, and edit the wording and numbers to match your real policy.

export interface MaintenancePlan {
  id: string;
  name: string;
  /** How often the visit happens, e.g. "Every 6 months". */
  frequency: string;
  /** What each visit includes. */
  includes: string[];
  /** Shown as the headline price, e.g. "₹1,299 per visit". */
  price: string;
  /** Optional saving line, e.g. "Save 10% on every visit". */
  saving?: string;
  popular?: boolean;
}

export const siteSettings = {
  /** Re-clean promise. Shown on the homepage, service pages and area pages. */
  guarantee: {
    enabled: false,
    title: 'Missed a spot? We’ll come back free.',
    text: 'If anything in your agreed scope isn’t right, tell us within 48 hours and we’ll re-clean that area at no extra cost.',
  },
  /** Accidental damage cover. Only enable if you are insured or will pay for damage yourself. */
  damageCover: {
    enabled: false,
    title: 'Covered for accidental damage',
    text: 'In the rare case something is accidentally damaged during our work, we cover repair or replacement up to ₹5,000 per booking.',
  },
  /** Verified team promise. Only enable if every team member is ID- and police-verified. */
  verifiedTeam: {
    enabled: false,
    title: 'ID- and police-verified team',
    text: 'Every team member is ID-checked and police-verified, wears a Clean Corners uniform and is trained on our checklists.',
  },
  /** Thin banner at the very top of every page. */
  offer: {
    enabled: false,
    text: 'First booking? Get ₹200 off any deep cleaning.',
    detail: 'Mention code FIRST200 when we call. One per household.',
  },
  /** Referral card shown with the promises. */
  referral: {
    enabled: false,
    title: 'Refer a neighbour, you both save ₹200',
    text: 'Share your booking reference with a friend. When they book, you both get ₹200 off your next clean.',
  },
  /** Your Google Business Profile review link, e.g. https://g.page/r/XXXX/review. */
  googleReviewUrl: '',
  /** Your current Google rating. Leave null until you have one to show; update it as it changes. */
  googleRating: null as null | { rating: number; count: number },
  /** Maintenance plans. Leave empty to hide the section. See PLAN_EXAMPLES below. */
  plans: [] as MaintenancePlan[],
};

// Example plans. Copy into `plans` above and set your own prices to switch the section on.
export const PLAN_EXAMPLES: MaintenancePlan[] = [
  { id: 'tank-care', name: 'Tank Care', frequency: 'Every 6 months', includes: ['Overhead tank cleaning (up to 1,000 L)', 'Reminder before each visit', 'Priority slot booking'], price: '₹629 per visit', saving: 'Save 10% on every visit' },
  { id: 'home-fresh', name: 'Home Fresh', frequency: 'Every 3 months', includes: ['2 BHK deep cleaning', 'Ceiling fans and switchboards', 'Same team on every visit where possible'], price: '₹3,149 per visit', saving: 'Save 10% on every visit', popular: true },
  { id: 'complete-care', name: 'Complete Care', frequency: 'Every 3 months', includes: ['2 BHK deep cleaning', 'Sofa shampooing (5 seats)', 'Same team on every visit where possible'], price: '₹3,999 per visit', saving: 'Save about 15% compared with separate bookings' },
];

export const anyPromiseEnabled = () => [siteSettings.guarantee, siteSettings.damageCover, siteSettings.verifiedTeam, siteSettings.referral].some(item => item.enabled);
