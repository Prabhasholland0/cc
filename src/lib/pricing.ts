import type { PricingConfig } from '../types';
export interface QuoteSelection { serviceId: string; quantities: Record<string, number>; priority: boolean; extraBathrooms?: number; }
export const money = (value: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);
export const indiaDate = (offset = 0) => new Date(Date.now() + offset * 86400000).toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
export function defaultSelection(config: PricingConfig, serviceId = config.services[0]?.id, packageId?: string): QuoteSelection {
  const service = config.services.find(s => s.id === serviceId) || config.services[0];
  const pkg = service?.packages.find(p => p.id === packageId) || service?.packages.find(p => p.popular) || service?.packages[0];
  return { serviceId: service?.id || '', quantities: pkg ? { [pkg.id]: service.id === 'painting' ? 1000 : 1 } : {}, priority: false };
}
export function startingRate(service: PricingConfig['services'][number]) { return service.packages.length ? Math.min(...service.packages.map(p => p.price)) : service.startingPrice; }
export function calculateQuote(config: PricingConfig, selection: QuoteSelection) {
  const service = config.services.find(s => s.id === selection.serviceId);
  if (!service) throw new Error('Please choose an available service.');
  const selected = Object.entries(selection.quantities).filter(([, quantity]) => quantity !== 0);
  if (!selected.length) throw new Error('Choose at least one package or item.');
  if (['full-home', 'kitchen', 'bathroom', 'painting'].includes(service.id) && selected.length > 1) throw new Error('Choose one package for this service.');
  const lines = selected.map(([id, quantity]) => {
    const pkg = service.packages.find(p => p.id === id);
    if (!pkg || !Number.isInteger(quantity) || quantity < 1 || quantity > (service.id === 'painting' ? 100000 : 100)) throw new Error('Please check your selected items and quantities.');
    if (['full-home', 'kitchen', 'bathroom'].includes(service.id) && quantity !== 1) throw new Error('Choose one package.');
    return { packageId: id, name: pkg.name, unit: pkg.unit, quantity, rate: pkg.price, amount: pkg.price * quantity, inspection: !!pkg.requiresInspection };
  });
  const extras = selection.extraBathrooms ?? 0;
  if (!Number.isInteger(extras) || extras < 0 || extras > 20 || (extras > 0 && service.id !== 'full-home')) throw new Error('Please check additional bathrooms.');
  if (extras) {
    const bath = config.services.find(s => s.id === 'bathroom')?.packages.find(p => p.id === 'bath-single');
    if (!bath) throw new Error('Additional bathrooms are currently unavailable.');
    lines.push({ packageId: bath.id, name: 'Additional bathroom', unit: bath.unit, quantity: extras, rate: bath.price, amount: extras * bath.price, inspection: false });
  }
  const subtotal = lines.reduce((total, line) => total + line.amount, 0);
  const minimum = Math.max(config.minimumOrderThreshold, service.minOrderAmount);
  const minimumAdjustment = Math.max(0, minimum - subtotal);
  const priorityFee = selection.priority ? config.emergencyFee : 0;
  const total = subtotal + minimumAdjustment + priorityFee;
  return { service, lines, subtotal, minimum, minimumAdjustment, priorityFee, total, requiresInspection: service.inspectionRequired || lines.some(l => l.inspection), scope: lines.map(l => `${l.quantity} × ${l.name}`).join('; ') };
}
