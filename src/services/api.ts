
import type { CallbackRecord, CallbackSubmission, EnquiryRecord, EnquirySubmission, PricingConfig, TrackedBooking } from '../types';

const API_BASE = '/api';

export async function fetchPricing(): Promise<PricingConfig> {
  try {
    const res = await fetch(`${API_BASE}/pricing`);
    if (!res.ok) throw new Error('Failed to fetch pricing');
    return await res.json();
  } catch (err) {
    console.warn('API unavailable, using cached pricing config:', err);
    throw new Error('Live pricing is unavailable.');
  }
}

export async function updatePricingApi(pricing: PricingConfig, adminToken: string): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch(`${API_BASE}/pricing`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-token': adminToken,
      },
      body: JSON.stringify(pricing),
    });
    if (!res.ok) {
      const data = await res.json();
      return { success: false, error: data.error || 'Failed to update pricing' };
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Network error' };
  }
}

export async function submitEnquiryApi(data: EnquirySubmission): Promise<{
  success: boolean;
  enquiryId?: string;
  notice?: string;
  error?: string;
  issues?: Array<{ field: string; message: string }>;
}> {
  try {
    const res = await fetch(`${API_BASE}/enquiries`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const body = await res.json();
    if (!res.ok) {
      return {
        success: false,
        error: body.error || 'Submission failed. Please check form inputs.',
        issues: body.issues,
      };
    }

    return {
      success: true,
      enquiryId: body.enquiryId,
      notice: body.notice,
    };
  } catch (err) {
    console.warn('Enquiry submission offline fallback:', err);
    return { success: false, error: 'We could not confirm that your enquiry was saved. Your details are still here. Retry or call 95154 47834; no appointment is confirmed.' };
  }
}

export async function fetchEnquiriesApi(adminToken: string): Promise<EnquiryRecord[]> {
  try {
    const res = await fetch(`${API_BASE}/enquiries`, {
      headers: {
        'x-admin-token': adminToken,
      },
    });
    if (res.status === 429) throw new Error((await res.json().catch(() => ({}))).error || 'Too many attempts. Please wait 15 minutes.');
    if (!res.ok) throw new Error('Unauthorized or failed to fetch enquiries');
    return await res.json();
  } catch (err) {
    console.error('Error fetching enquiries:', err);
    throw err;
  }
}

export async function updateEnquiryStatusApi(
  id: string,
  updates: Partial<Pick<EnquiryRecord, 'status' | 'adminNotes' | 'appointmentDate' | 'appointmentTime' | 'assignedTeam' | 'followUpDate'>> & { customerRequestHandled?: boolean },
  adminToken: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch(`${API_BASE}/enquiries/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-token': adminToken,
      },
      body: JSON.stringify(updates),
    });
    if (!res.ok) {
      const body = await res.json();
      return { success: false, error: body.error || 'Failed to update' };
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function runPreLaunchAuditApi(): Promise<any> { throw new Error('Launch review is available only in the authenticated staff portal.'); }

export async function submitCallbackApi(data: CallbackSubmission): Promise<{ success: boolean; callbackId?: string; error?: string; issues?: Array<{ field: string; message: string }> }> {
  try {
    const res = await fetch(`${API_BASE}/callbacks`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    const body = await res.json();
    if (!res.ok) return { success: false, error: body.error || 'Your request could not be saved.', issues: body.issues };
    return { success: true, callbackId: body.callbackId };
  } catch {
    return { success: false, error: 'We could not confirm that your request was saved. Please retry, or call 95154 47834.' };
  }
}

export async function fetchCallbacksApi(adminToken: string): Promise<CallbackRecord[]> {
  const res = await fetch(`${API_BASE}/callbacks`, { headers: { 'x-admin-token': adminToken } });
  if (!res.ok) throw new Error('Unable to load callback requests');
  return res.json();
}

export async function updateCallbackStatusApi(id: string, status: CallbackRecord['status'], adminToken: string): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch(`${API_BASE}/callbacks/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json', 'x-admin-token': adminToken }, body: JSON.stringify({ status }) });
    if (!res.ok) return { success: false, error: (await res.json()).error || 'Failed to update' };
    return { success: true };
  } catch (err) {
    return { success: false, error: (err as Error).message };
  }
}

export type TrackResult = { success: true; booking: TrackedBooking } | { success: false; error: string; issues?: Array<{ field: string; message: string }> };
export interface BookingChange { reference: string; phone: string; type: 'cancel' | 'reschedule'; reason?: string; preferredDate?: string; preferredTimeSlot?: string; }

async function postTracking(url: string, body: unknown): Promise<TrackResult> {
  try {
    const res = await fetch(`${API_BASE}${url}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    const data = await res.json();
    if (!res.ok) return { success: false, error: data.error || 'Something went wrong. Please try again.', issues: data.issues };
    return { success: true, booking: data.booking };
  } catch {
    return { success: false, error: 'We couldn’t reach our booking system. Please check your connection, try again, or call 95154 47834.' };
  }
}
export const trackBookingApi = (reference: string, phone: string) => postTracking('/track', { reference, phone });
export const changeBookingApi = (change: BookingChange) => postTracking('/track/change', change);
