export const serviceCopy: Record<string, { summary: string; preparation: string[] }> = {
  'full-home': { summary: 'A thorough clean for your living spaces, kitchen, bathrooms, windows, and floors.', preparation: ['Put away valuables and fragile items.', 'Empty cupboards if you want to discuss internal cleaning.', 'Arrange water, electricity, and access to each room.'] },
  kitchen: { summary: 'Lift everyday grease from counters, tiles, the sink, and cabinet exteriors.', preparation: ['Clear counters and put away food and utensils.', 'Empty cabinets if internal cleaning is part of your agreed scope.', 'Let hot appliances cool before the team arrives.'] },
  bathroom: { summary: 'A detailed clean for tiles, taps, toilets, mirrors, and shower areas.', preparation: ['Remove toiletries and personal items.', 'Tell us about loose tiles, damaged fittings, or previous chemical marks.', 'Keep water and electricity available.'] },
  'sofa-carpet': { summary: 'Freshen sofas, rugs, and mattresses with fabric-appropriate cleaning and extraction.', preparation: ['Clear the area around your furniture.', 'Tell us about delicate fabrics or existing stains.', 'Allow ventilation and drying time before using cleaned upholstery.'] },
  painting: { summary: 'Refresh your walls with preparation, careful painting, and a tidy finish.', preparation: ['Choose the rooms or outside areas you want painted.', 'Tell us about damp patches or peeling paint.', 'An inspection is needed to confirm measurements, materials, and the final quote.'] },
  'water-tank': { summary: 'Remove settled dirt and buildup from water tanks and sumps.', preparation: ['Plan the visit when the water level is low.', 'Arrange safe access to the tank or sump.', 'Tell us about capacity, access restrictions, and plumbing issues.'] },
  'express-addons': { summary: 'Choose individual fans, rooms, or fixtures that need extra attention.', preparation: ['Choose the fixtures you want cleaned.', 'Clear nearby objects and arrange safe access.', 'Check the minimum visit charge in your estimate.'] },
};
export const faqs: [string, string][] = [
  ['Do I need to provide cleaning supplies?', 'The team brings cleaning equipment and supplies for the agreed service. Please arrange water, electricity, and safe access.'],
  ['Will you move my furniture?', 'Please flag large or heavy furniture when requesting a visit. The team will confirm what can be moved safely; put away valuables and fragile items beforehand.'],
  ['What should I do if I have pets?', 'Mention your pets in the access notes and keep them in a comfortable, separate area during cleaning.'],
  ['Do you need water and electricity?', 'Yes. Please arrange working water and power supplies. Let us know about access restrictions before the visit.'],
  ['Can I cancel or reschedule?', 'Call or WhatsApp 95154 47834. The current policy allows cancellation or rescheduling without a fee with at least three hours’ notice; a mobilization fee may apply once the team has already set off.'],
  ['When do I pay?', 'No online advance is collected for a standard cleaning request. Inspect the completed work with the team, then pay by UPI or cash.'],
  ['Is my requested time confirmed immediately?', 'No. Submitting the form saves an enquiry. The team contacts you to confirm the scope, final price, and available appointment.'],
];

export const serviceFaqs: Record<string, [string, string][]> = {
  'full-home': [
    ['How long does a full home deep clean take?', 'Usually 4 to 7 hours, depending on the size of the home and how much cleaning it needs. The team confirms an estimate when they call you.'],
    ['Do you clean inside wardrobes and cupboards?', 'Only if they are completely emptied before the team arrives. Otherwise we clean the outside surfaces of wardrobes and cupboards.'],
    ['Can you clean after renovation or construction work?', 'Heavy cement and plaster residue needs our separate post-construction cleaning, which requires an inspection first. Tell us about recent work when you request a visit.'],
    ['What equipment do you bring?', 'A wet and dry vacuum, a single-disc floor scrubber, a steam wand, colour-coded microfiber cloths and pH-neutral cleaning products.'],
  ],
  kitchen: [
    ['How long does kitchen cleaning take?', 'Usually 2 to 3 hours.'],
    ['Will you clean inside my cabinets?', 'Yes, if you empty spices and utensils first. Otherwise we clean and polish the cabinet exteriors.'],
    ['Do you clean the chimney?', 'We clean the chimney exterior, oil collector and baffle filters. The Heavy Oil & Chimney Filter Wash package adds a filter soak and stove burner degreasing. We don’t dismantle the motor or internal wiring.'],
    ['Are the cleaning products food-safe?', 'We use food-safe alkaline degreasers for kitchen surfaces.'],
  ],
  bathroom: [
    ['Can you remove yellow hard-water stains?', 'Yes. We use acid-free descalers that remove hard-water scale from tiles, taps and fittings without damaging glazed tiles or chrome.'],
    ['Can old acid or chemical burn marks be removed?', 'No. Etching caused by earlier use of harsh chemicals is permanent damage to the surface and cannot be reversed by cleaning.'],
    ['How long does it take per bathroom?', 'Usually 1 to 2 hours per bathroom.'],
    ['Do you fix loose or broken tiles?', 'No. Regrouting and tile repairs are not part of the cleaning service.'],
  ],
  'sofa-carpet': [
    ['How long will my sofa take to dry?', 'We extract the water instead of soaking the cushion foam, so drying is much quicker than a wet wash. Keep the room ventilated and wait until the fabric feels dry before using it.'],
    ['How is the price calculated for a sofa?', 'Fabric sofas are priced per seat. For example, a 3-seater is 3 seats and a 5-seater is 5 seats. Recliners, rugs and mattresses have their own rates.'],
    ['Will all stains come out?', 'Most everyday stains such as tea, coffee and grease lift well. Permanent dye transfer, ink, bleach marks and sun fading cannot be reversed.'],
    ['Is it safe for delicate fabrics?', 'We use soft-bristled brushes and a biodegradable, pH-balanced shampoo. Please tell us about delicate fabrics when you book.'],
  ],
  painting: [
    ['Is the inspection free?', 'Yes. Every painting project starts with a free on-site inspection to measure the walls, check for damp and confirm the final quote.'],
    ['How long does painting take?', 'Usually 2 to 6 days, depending on the size of the property and the finish you choose.'],
    ['What is included in the price?', 'Masking floors and furniture, scraping, filling hairline cracks, sanding, one coat of primer and two coats of paint, followed by a clean-up.'],
    ['Do you fix damp walls or leaks?', 'We check wall dampness with a moisture meter before painting. Active seepage and major civil repairs need a separate waterproofing consultation.'],
  ],
  'water-tank': [
    ['When should I schedule tank cleaning?', 'Choose a time when the water level is already low, so very little water is wasted.'],
    ['Is the tank safe to use after cleaning?', 'Yes. The final disinfection uses a non-toxic, food-grade disinfectant that is safe for drinking-water storage.'],
    ['Do you clean underground sumps?', 'Yes. We clean overhead tanks and underground RCC sumps, including large sumps for gated communities.'],
    ['How long does it take?', 'Usually 1.5 to 3 hours per tank, depending on its size and condition.'],
  ],
  'express-addons': [
    ['Is there a minimum order?', 'Add-ons have a minimum visit charge of ₹499 on their own. Added to any main cleaning package, there is no extra minimum.'],
    ['Can I combine several add-ons?', 'Yes. Choose as many fans, exhaust fans, rooms or balconies as you need and the estimate updates instantly.'],
  ],
};
