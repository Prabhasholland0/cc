import { useDialog } from '../hooks/useDialog';
import { X, ShieldCheck, Lock, Phone, MapPin } from 'lucide-react';

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyPolicyModal = ({ isOpen, onClose }: PrivacyPolicyModalProps) => {
  const dialog = useDialog(onClose);
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150">
      <div ref={dialog} role="dialog" aria-modal="true" aria-labelledby="PrivacyPolicyModal-title" tabIndex={-1} className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-[#1E252D] text-white p-5 sm:p-6 flex items-start justify-between gap-4 shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] uppercase tracking-wider font-extrabold bg-[#0875CF] text-white px-2.5 py-0.5 rounded-full">
                Legal & Governance
              </span>
            </div>
            <h2 id="PrivacyPolicyModal-title" className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Privacy Policy
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              Effective Date: October 2026 | CLEAN CORNERS Housekeeping Services
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
              <ShieldCheck className="w-4 h-4 text-[#0875CF]" />
              1. Business Overview & Commitment
            </h3>
            <p>
              CLEAN CORNERS Housekeeping Services (“Clean Corners”, “we”, “us”, or “our”), located in Sainikpuri, Secunderabad, Telangana – 500094, is committed to safeguarding the privacy and personal data of our customers. This Privacy Policy details our practices regarding the collection, storage, use, and protection of information obtained through our website (cleancorners.in), booking forms, and direct telephone/WhatsApp communications.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Lock className="w-4 h-4 text-[#0875CF]" />
              2. Information We Collect
            </h3>
            <p>
              We collect only the information strictly required to coordinate, price, schedule, and execute housekeeping and home improvement services at your premises:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-600 text-xs sm:text-sm">
              <li>
                <strong>Contact Information:</strong> Your full name, mobile telephone number, and optional WhatsApp contact handle.
              </li>
              <li>
                <strong>Service Location:</strong> House/flat number, building name, street, landmark, and locality in Sainikpuri, Secunderabad, or Hyderabad.
              </li>
              <li>
                <strong>Service Requirements:</strong> Property configuration (e.g. 1/2/3/4 BHK, sofa seating count, water tank capacity, square footage), preferred appointment dates and times, and specific site instructions.
              </li>
              <li>
                <strong>Transaction & Audit Logs:</strong> Enquiry reference IDs, service status logs, inspection notes, and payment mode on completion (Cash or UPI).
              </li>
            </ul>
          </section>

          <section className="space-y-2">
            <h3 className="text-base font-bold text-slate-900">3. Purpose and Legal Grounds for Processing</h3>
            <p>Your personal data is used solely for the following legitimate business purposes:</p>
            <ul className="list-disc pl-5 space-y-1 text-slate-600 text-xs sm:text-sm">
              <li>Contacting you by phone or WhatsApp to verify property access, schedule technician squads, and confirm service appointments.</li>
              <li>Providing accurate rate card estimates and calculating applicable minimum order thresholds.</li>
              <li>Dispatching our mobile housekeeping teams and equipment vans to your physical address.</li>
              <li>Conducting quality assurance walkthroughs and billing reconciliation upon job completion.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h3 className="text-base font-bold text-slate-900">4. Sharing and Non-Disclosure</h3>
            <p>
              <strong>We do not sell, rent, monetize, or trade your personal information to any third-party marketing companies or brokers.</strong>
            </p>
            <p className="text-xs text-slate-600">
              Access to your address and phone number is granted exclusively to assigned CLEAN CORNERS operations coordinators and active field supervisors dispatched for your booked appointment. We may disclose data only if strictly required by Indian law or competent statutory authority.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-base font-bold text-slate-900">5. Data Retention & Customer Rights</h3>
            <p>
              We retain customer enquiry records for a reasonable period to assist with repeat service bookings, warranty consultations for painting, and internal accounting audit trails.
            </p>
            <p>
              Under Indian digital personal data principles, you have the right to request a review of your stored contact details, request corrections, or instruct us to delete your contact records from our booking database.
            </p>
          </section>

          <section className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-2">
            <h3 className="text-sm font-bold text-slate-900">6. Privacy Inquiries & Grievances</h3>
            <p className="text-xs text-slate-600">
              For any questions regarding your data privacy or to request record deletion, please contact:
            </p>
            <div className="text-xs space-y-1 text-slate-700">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#0875CF]" />
                <span>CLEAN CORNERS, Sainikpuri, Secunderabad, Telangana – 500094</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#0875CF]" />
                <span>Primary Desk: 95154 47834 | Secondary: 93914 59522</span>
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 border-t border-slate-200 p-4 px-6 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#1E252D] hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition-colors"
          >
            I Understand & Close
          </button>
        </div>
      </div>
    </div>
  );
};
