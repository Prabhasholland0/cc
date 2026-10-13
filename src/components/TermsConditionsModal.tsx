import { useDialog } from '../hooks/useDialog';
import { X, FileText } from 'lucide-react';

interface TermsConditionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TermsConditionsModal = ({ isOpen, onClose }: TermsConditionsModalProps) => {
  const dialog = useDialog(onClose);
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150">
      <div ref={dialog} role="dialog" aria-modal="true" aria-labelledby="TermsConditionsModal-title" tabIndex={-1} className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-[#1E252D] text-white p-5 sm:p-6 flex items-start justify-between gap-4 shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] uppercase tracking-wider font-extrabold bg-[#0875CF] text-white px-2.5 py-0.5 rounded-full">
                Customer Agreement
              </span>
            </div>
            <h2 id="TermsConditionsModal-title" className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Terms & Conditions
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              Effective Date: October 2026 | Service Guidelines for Sainikpuri, Secunderabad
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors shrink-0"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 overflow-y-auto grow space-y-6 text-sm text-slate-700 leading-relaxed">
          <section className="space-y-2">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#0875CF]" />
              1. Scope of Housekeeping & Home Improvement Services
            </h3>
            <p>
              These Terms & Conditions govern the booking, scheduling, execution, and payment for housekeeping, upholstery shampooing, water tank cleaning, and painting services provided by CLEAN CORNERS (“Service Provider”), operating out of Sainikpuri, Secunderabad, Telangana – 500094.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-base font-bold text-slate-900">2. Enquiries vs. Confirmed Bookings</h3>
            <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-xl text-xs sm:text-sm text-blue-950 space-y-1">
              <strong className="block text-blue-900 font-bold">Important Distinction:</strong>
              Submitting an online booking enquiry on cleancorners.in generates an official <em>Enquiry Reference</em>. A service is deemed formally confirmed only after a CLEAN CORNERS operations coordinator calls the customer on their provided telephone number (from 95154 47834 / 93914 59522) to verify slot availability, property configuration, and parking/access.
            </div>
          </section>

          <section className="space-y-2">
            <h3 className="text-base font-bold text-slate-900">3. Pricing Integrity & Minimum Order Policy</h3>
            <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-slate-600">
              <li>
                <strong>Rate Card Pricing:</strong> Published prices represent standard rate cards for normally soiled premises. Severe construction debris, post-renovation cement lumps, or hazardous waste requires custom assessment.
              </li>
              <li>
                <strong>Doorstep Minimum Charge:</strong> As advertised, standalone fixture add-ons start at ₹199/- (ceiling fan deep clean). A minimum doorstep service order of ₹499/- applies for standalone visits in Sainikpuri / Secunderabad, or ₹0 minimum fee when booked alongside any core home or upholstery package.
              </li>
              <li>
                <strong>Inspection Requirement:</strong> Interior/Exterior Painting and villas exceeding 2,400 sq ft require a mandatory, free on-site survey before quotation to accurately measure wall moisture, structural crack depths, and scaffolding needs.
              </li>
            </ul>
          </section>

          <section className="space-y-2">
            <h3 className="text-base font-bold text-slate-900">4. Customer Utility & Access Obligations</h3>
            <p>
              To enable our team to execute mechanized cleaning safely and efficiently, the client agrees to provide:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm text-slate-600">
              <li>Continuous domestic water supply for high-pressure jet washing and slurry extraction.</li>
              <li>Working 5A / 15A electrical supply outlets for single-disc scrubbers and industrial wet vacuums.</li>
              <li>Safe access to rooftops and sumps for water tank technicians.</li>
              <li>Safe custody and removal of high-value cash, jewelry, and delicate heirloom articles prior to crew entry.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h3 className="text-base font-bold text-slate-900">5. Payment Terms & Handover Walkthrough</h3>
            <p>
              We operate on an <strong>Inspection-First Payment Model</strong>:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm text-slate-600">
              <li>No advance payment is mandatory for standard residential bookings.</li>
              <li>Upon completion of the service, the client conducts a joint walkthrough with our squad supervisor.</li>
              <li>Payment must be settled immediately upon completion via UPI (Google Pay, PhonePe, Paytm) or Cash.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h3 className="text-base font-bold text-slate-900">6. Rescheduling & Cancellation Policy</h3>
            <p className="text-xs sm:text-sm text-slate-600">
              We understand plans change. Customers may reschedule or cancel their appointment with zero fee by giving at least 3 hours prior notice by phone or WhatsApp to 95154 47834. Last-minute cancellations when our squad has already mobilized to the premises may incur a nominal mobilization fee.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-base font-bold text-slate-900">7. Boundaries of Liability</h3>
            <p className="text-xs sm:text-sm text-slate-600">
              While our crew exercises maximum care using non-corrosive chemicals and soft pads, CLEAN CORNERS is not liable for pre-existing tile cracks, age-weakened grout disintegrating under normal washing, chemically burned fabrics prior to our arrival, or unstable plumbing pipes.
            </p>
          </section>

          <section className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-1 text-xs text-slate-600">
            <span className="font-bold text-slate-900 block">8. Jurisdiction:</span>
            Any dispute arising out of or related to our services is subject to the exclusive jurisdiction of the competent courts in Secunderabad / Hyderabad, Telangana.
          </section>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 border-t border-slate-200 p-4 px-6 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#1E252D] hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition-colors"
          >
            I Accept & Close
          </button>
        </div>
      </div>
    </div>
  );
};
