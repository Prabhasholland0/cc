import { useState } from 'react';
import type { ServiceItem, ServicePackage } from '../types';
import { X, Check, AlertCircle, Wrench, Clock, ShieldAlert, ArrowRight, Sparkles } from 'lucide-react';

interface ServiceDetailModalProps {
  service: ServiceItem | null;
  onClose: () => void;
  onSelectPackageForBooking: (service: ServiceItem, pkg?: ServicePackage) => void;
}

export const ServiceDetailModal = ({
  service,
  onClose,
  onSelectPackageForBooking,
}: ServiceDetailModalProps) => {
  const [activeTab, setActiveTab] = useState<'scope' | 'packages' | 'equipment'>('scope');

  if (!service) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="bg-[#1E252D] text-white p-5 sm:p-6 flex items-start justify-between gap-4 shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[11px] uppercase tracking-wider font-extrabold bg-[#0875CF] text-white px-2.5 py-0.5 rounded-full">
                {service.category.replace('-', ' ')}
              </span>
              {service.badge && (
                <span className="text-[11px] uppercase tracking-wider font-extrabold bg-[#0875CF] text-white px-2.5 py-0.5 rounded-full">
                  {service.badge}
                </span>
              )}
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              {service.title}
            </h2>
            <p className="text-sm text-slate-300 mt-1">{service.tagline}</p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors shrink-0"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 4K High-Resolution Service Photography Banner */}
        {service.image && (
          <div className="relative w-full h-44 sm:h-56 bg-slate-900 shrink-0 overflow-hidden">
            <img
              src={service.image}
              alt={service.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />
            <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white text-xs font-semibold">
              <span className="bg-black/50 backdrop-blur-md px-3 py-1 rounded-md border border-white/20">
                Verified On-Site Equipment & Method
              </span>
              <span className="bg-[#0072FF] px-3 py-1 rounded-md font-bold shadow-xs">
                Starting ₹{service.startingPrice}/-
              </span>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex items-center border-b border-slate-200 bg-slate-50 px-6 shrink-0">
          <button
            onClick={() => setActiveTab('scope')}
            className={`py-3 px-4 text-sm font-bold border-b-2 transition-colors ${
              activeTab === 'scope'
                ? 'border-[#0875CF] text-[#0875CF]'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Scope & Boundaries
          </button>
          <button
            onClick={() => setActiveTab('packages')}
            className={`py-3 px-4 text-sm font-bold border-b-2 transition-colors ${
              activeTab === 'packages'
                ? 'border-[#0875CF] text-[#0875CF]'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Packages & Pricing ({service.packages.length})
          </button>
          <button
            onClick={() => setActiveTab('equipment')}
            className={`py-3 px-4 text-sm font-bold border-b-2 transition-colors ${
              activeTab === 'equipment'
                ? 'border-[#0875CF] text-[#0875CF]'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Tools & Protocol
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 grow text-slate-800">
          {activeTab === 'scope' && (
            <div className="space-y-6">
              {/* Service Summary */}
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl text-sm leading-relaxed text-blue-950">
                <p className="font-medium">{service.summary}</p>
                <div className="mt-3 flex flex-wrap gap-4 text-xs font-semibold text-blue-800">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    Est. Duration: {service.durationEst}
                  </span>
                  <span className="flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    Min. Booking: ₹{service.minOrderAmount}
                  </span>
                </div>
              </div>

              {/* What is Included */}
              <div>
                <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  What is Included in This Service
                </h3>
                <ul className="space-y-2.5">
                  {service.inclusions.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* What is NOT Included */}
              <div>
                <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  Clear Exclusions (Honest Boundaries)
                </h3>
                <ul className="space-y-2">
                  {service.exclusions.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-600 bg-rose-50/50 p-2.5 rounded-lg border border-rose-100">
                      <ShieldAlert className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Inspection Notice if required */}
              {service.inspectionRequired && (
                <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div className="text-xs sm:text-sm text-amber-950">
                    <span className="font-bold block">On-Site Inspection Required:</span>
                    Because wall dampness, structural cracks, or large square footage require accurate measurement, our technical supervisor will visit your site in Sainikpuri / Secunderabad at zero cost before finalizing the exact quote.
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'packages' && (
            <div className="space-y-4">
              <div className="text-xs text-slate-500 mb-2">
                All prices reflect transparent rate-card pricing. Rates include equipment, consumables, and labor.
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {service.packages.map((pkg) => (
                  <div
                    key={pkg.id}
                    className={`p-4 rounded-xl border flex flex-col justify-between ${
                      pkg.popular
                        ? 'border-[#0875CF] bg-blue-50/30 ring-1 ring-[#0875CF]/20'
                        : 'border-slate-200 bg-white'
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h4 className="font-bold text-slate-900 text-sm">{pkg.name}</h4>
                        {pkg.popular && (
                          <span className="text-[10px] font-extrabold uppercase bg-[#0875CF] text-white px-2 py-0.5 rounded">
                            Popular
                          </span>
                        )}
                      </div>
                      <div className="text-xs font-semibold text-slate-500 mb-2">{pkg.unit}</div>
                      <div className="text-2xl font-black text-[#1E252D] mb-2">
                        ₹{pkg.price.toLocaleString('en-IN')}
                        {pkg.unit.includes('sq ft') && <span className="text-xs font-normal text-slate-500"> / sq ft</span>}
                      </div>
                      <p className="text-xs text-slate-600 mb-3">{pkg.description}</p>

                      <ul className="space-y-1.5 mb-4">
                        {pkg.features.map((feat, fidx) => (
                          <li key={fidx} className="flex items-start gap-2 text-xs text-slate-700">
                            <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <button
                      onClick={() => onSelectPackageForBooking(service, pkg)}
                      className="w-full mt-2 py-2.5 px-3 bg-[#0875CF] hover:bg-[#055CA7] text-white font-bold text-xs rounded-lg flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <span>Book This Package</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'equipment' && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Wrench className="w-4 h-4 text-[#0875CF]" />
                Mechanized Tools & Consumables Used
              </h3>
              <p className="text-xs sm:text-sm text-slate-600">
                We bring specialized industrial machinery and verified eco-friendly solutions to ensure maximum hygiene without damaging your property's tiles, granite, paint, or plumbing fixtures.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {service.equipment.map((eq, idx) => (
                  <div key={idx} className="flex items-start gap-3 bg-slate-50 border border-slate-200 p-3 rounded-xl text-xs sm:text-sm text-slate-800">
                    <Sparkles className="w-4 h-4 text-[#0875CF] shrink-0 mt-0.5" />
                    <span>{eq}</span>
                  </div>
                ))}
              </div>

              <div className="bg-slate-100 p-4 rounded-xl text-xs text-slate-600 mt-4 leading-relaxed">
                <span className="font-bold text-slate-800 block mb-1">Customer Requirements On-Site:</span>
                • Uninterrupted water supply for pressure washing / tank dewatering.
                <br />
                • Functional 5A / 15A electrical socket for industrial scrubbing & vacuum machinery.
                <br />
                • Safe parking access in Sainikpuri / Secunderabad locality for service van/kits.
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="bg-slate-50 border-t border-slate-200 p-4 px-6 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-slate-500">
            Starting from <span className="font-bold text-slate-900">₹{service.startingPrice}</span> {service.unitLabel}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => onSelectPackageForBooking(service)}
              className="px-5 py-2 text-xs font-bold bg-[#0875CF] hover:bg-[#055CA7] text-white rounded-lg shadow-xs flex items-center gap-1.5 transition-colors"
            >
              <span>Proceed to Booking</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
