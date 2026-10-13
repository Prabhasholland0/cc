// Publish only genuine work and customer-approved reviews. Empty sections stay hidden.
export interface WorkExample { id: string; serviceId: string; caption: string; before: string; after: string; consentConfirmed: boolean; }
export interface CustomerReview { id: string; serviceId: string; name: string; quote: string; consentConfirmed: boolean; }
export interface TeamPhoto { id: string; src: string; caption: string; consentConfirmed: boolean; }
export const workExamples: WorkExample[] = [];
export const customerReviews: CustomerReview[] = [];
export const teamPhotos: TeamPhoto[] = [];
