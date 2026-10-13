import type { QuoteSelection } from '../lib/pricing';
export interface ServicePackage {
  id: string;
  name: string;
  unit: string;
  price: number;
  description: string;
  popular?: boolean;
  features: string[];
  requiresInspection?: boolean;
}

export interface ServiceItem {
  id: string;
  title: string;
  tagline: string;
  category: 'housekeeping' | 'deep-cleaning' | 'restoration' | 'add-on';
  badge?: string;
  startingPrice: number;
  unitLabel: string;
  summary: string;
  image: string;
  inclusions: string[];
  exclusions: string[];
  equipment: string[];
  durationEst: string;
  inspectionRequired: boolean;
  minOrderAmount: number;
  packages: ServicePackage[];
}

export interface EnquirySubmission {
  selection: QuoteSelection;
  requestId: string;
  customerName: string;
  phone: string;
  address: string;
  area: string;
  serviceId: string;
  serviceName: string;
  packageId?: string;
  packageName?: string;
  customScope?: string;
  estimatedPrice: number;
  preferredDate: string;
  preferredTimeSlot: string;
  notes?: string;
}

export interface EnquiryRecord extends EnquirySubmission {
  id: string;
  createdAt: string;
  status: 'new' | 'contacted' | 'inspection_scheduled' | 'service_confirmed' | 'completed' | 'cancelled';
  adminNotes?: string;
  appointmentDate?: string;
  appointmentTime?: string;
  assignedTeam?: string;
  followUpDate?: string;
  updatedAt?: string;
  customerRequest?: CustomerRequest;
}

export interface CustomerRequest {
  type: 'cancel' | 'reschedule';
  preferredDate?: string;
  preferredTimeSlot?: string;
  reason?: string;
  createdAt: string;
  handled?: boolean;
}

/** What a customer sees when tracking a booking: no address, notes or staff fields. */
export interface TrackedBooking {
  id: string;
  serviceName: string;
  packageName?: string;
  estimatedPrice: number;
  status: EnquiryRecord['status'];
  createdAt: string;
  preferredDate: string;
  preferredTimeSlot: string;
  appointmentDate?: string;
  appointmentTime?: string;
  customerRequest?: CustomerRequest;
  canChangeOnline: boolean;
}

export interface PricingConfig {
  lastUpdated: string;
  updatedBy: string;
  minimumOrderThreshold: number;
  emergencyFee: number;
  services: ServiceItem[];
  inspectionPolicy: string;
}

export interface PreLaunchChecklistItem {
  id: string;
  label: string;
  requirement: string;
  isComplete: boolean;
  verificationEvidence: string;
}

export const CALLBACK_TIMES = ['As soon as possible', 'Morning: 9am–12pm', 'Afternoon: 12pm–4pm', 'Evening: 4pm–7:30pm'] as const;
export interface CallbackSubmission {
  requestId: string;
  name: string;
  phone: string;
  preferredTime: typeof CALLBACK_TIMES[number];
  serviceId?: string;
  website?: string;
}

export interface CallbackRecord extends Omit<CallbackSubmission, 'website'> {
  id: string;
  createdAt: string;
  status: 'new' | 'called';
  updatedAt?: string;
}
