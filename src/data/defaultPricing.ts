import type { PricingConfig } from '../types';

export const DEFAULT_PRICING: PricingConfig = {
  lastUpdated: new Date().toISOString(),
  updatedBy: 'CLEAN CORNERS Operations',
  minimumOrderThreshold: 499,
  emergencyFee: 300,
  inspectionPolicy: 'Free on-site inspection is conducted for Villas (>2500 sq ft), Post-Construction deep cleaning, and all Interior/Exterior Painting projects across Sainikpuri, Secunderabad, and Hyderabad.',
  services: [
    {
      id: 'full-home',
      title: 'Full Home Cleaning',
      tagline: 'Dusting, sweeping, mopping, and comprehensive mechanized sanitization.',
      category: 'deep-cleaning',
      badge: 'Most Popular',
      startingPrice: 2499,
      unitLabel: 'per complete home',
      summary: 'Complete sanitization of living areas, bedrooms, bathrooms, kitchen, balconies, windows, and floors using mechanized single-disc scrubbing and wet vacuuming.',
      image: '/images/service-full-home.jpg',
      durationEst: '4 to 7 hours',
      inspectionRequired: false,
      minOrderAmount: 2499,
      inclusions: [
        'Living & Bedrooms: High-reach cobweb removal, ceiling fan wiping, AC unit exterior wiping, switchboards, doors, wardrobes outer surface, mechanized floor scrubbing & buffing.',
        'Bathrooms: Deep tile descaling with specialized eco-friendly descalers, tap & chrome fitting descaling, WC & washbasin stain removal, mirror buffing, exhaust fan degreasing, drain cover sanitization.',
        'Kitchen: Countertop scrubbing, tile backsplash degreasing, exterior chimney and cabinet wipedown, sink descaling & drain flush, floor degreasing.',
        'Balconies & Utility: Floor scrubbing, dust removal, railing wipedown, drain unclogging rinse.',
        'Windows: Glass pane cleaning, mosquito mesh dust removal, and sliding track vacuuming.'
      ],
      exclusions: [
        'Internal wardrobe / cupboard cleaning is not included unless completely emptied prior to team arrival.',
        'Removal of heavy cement / plaster lumps from structural renovation (requires specialized post-construction package).',
        'Terrace waterproofing or roof gutter cleaning (available as separate quote).',
        'Repair of damaged plumbing, electrical wiring, or cracked tiles.'
      ],
      equipment: [
        'Heavy-duty industrial wet & dry vacuum cleaner',
        'Single-disc rotary floor scrubber with hard & soft pads',
        'High-pressure steam sanitization wand',
        'Color-coded microfiber towels (prevent cross-contamination)',
        'Government-approved non-hazardous surface descalers and pH-neutral floor cleaners'
      ],
      packages: [
        {
          id: '1bhk',
          name: '1 BHK Deep Cleaning',
          unit: 'Up to 650 sq ft',
          price: 2499,
          description: '1 Bedroom, 1 Hall, 1 Kitchen, 1 Bathroom, 1 Balcony',
          features: [
            '2-3 trained housekeeping specialists',
            'Full bathroom & kitchen descaling',
            'Floor scrubbing & dry buffing',
            'Windows, fans & switchboards included'
          ]
        },
        {
          id: '2bhk',
          name: '2 BHK Deep Cleaning',
          unit: 'Up to 1100 sq ft',
          price: 3499,
          popular: true,
          description: '2 Bedrooms, 1 Hall, 1 Kitchen, 2 Bathrooms, Balconies',
          features: [
            '3-4 trained housekeeping specialists',
            'Both bathrooms complete descaling',
            'Kitchen degreasing & sink sanitization',
            'Balcony floor scrubbing included',
            'All window tracks & glass wiped'
          ]
        },
        {
          id: '3bhk',
          name: '3 BHK Deep Cleaning',
          unit: 'Up to 1650 sq ft',
          price: 4699,
          description: '3 Bedrooms, Hall & Dining, Kitchen, 3 Bathrooms, Balconies',
          features: [
            '4-5 trained housekeeping specialists',
            'Up to 3 bathrooms deep sanitization',
            'Complete living & dining floor scrubbing',
            'Full kitchen cabinets exterior wipedown',
            'Sliding doors & balcony deep wash'
          ]
        },
        {
          id: '4bhk-villa',
          name: '4 BHK / Independent Villa',
          unit: 'Up to 2400 sq ft',
          price: 6299,
          requiresInspection: true,
          description: 'Large apartments, duplexes & independent houses in Sainikpuri/Secunderabad',
          features: [
            '5-6 dedicated cleaning specialists',
            'All bathrooms & kitchen deep sanitization',
            'Staircase, banisters & foyer scrubbed',
            'Multiple balconies & utility wash areas',
            'Free on-site evaluation for larger properties'
          ]
        }
      ]
    },
    {
      id: 'kitchen',
      title: 'Kitchen Cleaning',
      tagline: 'Deep cleaning of counters, sinks, cabinets, and appliances.',
      category: 'deep-cleaning',
      badge: 'Degrease Specialist',
      startingPrice: 1199,
      unitLabel: 'per complete kitchen',
      summary: 'High-power alkaline degreasing of tile backsplashes, exterior chimney filters, countertop scrubbing, cabinet exterior buffing, and stainless steel sink descaling.',
      image: '/images/service-kitchen.jpg',
      durationEst: '2 to 3 hours',
      inspectionRequired: false,
      minOrderAmount: 1199,
      inclusions: [
        'Countertop deep scrubbing & granite edge conditioning.',
        'Tile backsplash grease extraction and grout line scrubbing.',
        'Exterior chimney surface wipedown, oil collector wash & baffle filter degreasing.',
        'Cabinet exterior degreasing and microfiber polish.',
        'Stainless steel sink descaling and drain pipe antibacterial rinse.',
        'Mechanized kitchen floor degreasing and wet vacuuming.'
      ],
      exclusions: [
        'Internal cabinet wiping requires customer to empty spices and utensils prior to service.',
        'Dismantling of motor or internal electrical wiring inside chimney.'
      ],
      equipment: [
        'Heavy-duty food-safe alkaline degreasers',
        'Detail grout scrubbing brushes',
        'Stainless steel chrome shiners & lime descalers',
        'Color-coded grease microfiber towels'
      ],
      packages: [
        {
          id: 'kitchen-standard',
          name: 'Standard Kitchen Deep Clean',
          unit: 'Up to 100 sq ft',
          price: 1199,
          popular: true,
          description: 'Countertops, sink, tiles, chimney exterior & floor degrease',
          features: [
            '2 trained kitchen specialists',
            'Full tile backsplash degreasing',
            'Exterior cabinet wipedown',
            'Sink descaling & drain flush'
          ]
        },
        {
          id: 'kitchen-heavy',
          name: 'Heavy Oil & Chimney Filter Wash',
          unit: 'Full Kitchen + Deep Chimney',
          price: 1599,
          description: 'Includes baffle filter soak, stove burner degreasing & wall scrub',
          features: [
            'Chimney baffle filter chemical bath',
            'Gas stove burner cleaning',
            'Exhaust fan complete degreasing',
            'Intense oil deposit removal'
          ]
        }
      ]
    },
    {
      id: 'bathroom',
      title: 'Bathroom Cleaning',
      tagline: 'Sanitization of toilets, showers, tiles, and mirrors.',
      category: 'deep-cleaning',
      badge: 'Descaling Hero',
      startingPrice: 599,
      unitLabel: 'per bathroom',
      summary: 'Acid-free tile descaling removing hard-water yellow calcium scale, chrome tap shining, sanitary ceramic scrub, glass partition descaling, and exhaust fan wipe.',
      image: '/images/service-bathroom.jpg',
      durationEst: '1 to 2 hours per bathroom',
      inspectionRequired: false,
      minOrderAmount: 599,
      inclusions: [
        'Intense wall and floor tile descaling using acid-free non-hazardous descalers.',
        'Hard water calcium removal on chrome faucets, showerheads, and geyser piping.',
        'Commode/WC bowl descaling, stain removal, and antibacterial sanitation.',
        'Mirror buffer shine and glass shower partition water stain removal.',
        'Exhaust fan blade degreasing and drain trap hair/sludge clearance.'
      ],
      exclusions: [
        'Pre-existing etching or acid burn marks caused by previous harsh domestic chemicals cannot be reversed.',
        'Regrouting of falling or damaged tiles.'
      ],
      equipment: [
        'Acid-free glazed-tile safe calcium descaler',
        'Chrome shiner and non-scratch scrubbing wands',
        'Antibacterial sanitizing rinse',
        'Detail crevice brushes'
      ],
      packages: [
        {
          id: 'bath-single',
          name: 'Single Bathroom Deep Descaling',
          unit: '1 Bathroom',
          price: 599,
          popular: true,
          description: 'Complete top-to-bottom tile, tap, commode, and mirror descaling',
          features: [
            '1 dedicated cleaning technician',
            'Wall tile & floor tile scrub',
            'Chrome tap shining',
            'Exhaust fan wipedown'
          ]
        },
        {
          id: 'bath-dual',
          name: '2 Bathrooms Combo Pack',
          unit: '2 Bathrooms',
          price: 1099,
          description: 'Deep sanitization and descaling for both master and guest bathrooms',
          features: [
            'Full descaling on both bathrooms',
            'Shower glass partitions buffed',
            'Drain covers sanitized',
            'Savings on combined booking'
          ]
        },
        {
          id: 'bath-triple',
          name: '3 Bathrooms Villa Pack',
          unit: '3 Bathrooms',
          price: 1599,
          description: 'Complete descaling for all 3 bathrooms in large flats and villas',
          features: [
            'All 3 bathrooms completed in 3 hours',
            'Shower enclosure scale removal',
            'Washbasins and vanity counters scrubbed',
            'Fresh lemon-pine scent finish'
          ]
        }
      ]
    },
    {
      id: 'sofa-carpet',
      title: 'Sofa & Carpet Cleaning',
      tagline: 'Injection-extraction shampooing and fabric stain removal.',
      category: 'deep-cleaning',
      badge: 'Deep Extraction',
      startingPrice: 249,
      unitLabel: 'per sofa seat / per unit',
      summary: 'Mechanized foam injection and high-suction extraction that pulls out deep-seated grime, dust mites, sweat, and stains without soaking through cushion foam.',
      image: '/images/service-sofa.jpg',
      durationEst: '1.5 to 3 hours',
      inspectionRequired: false,
      minOrderAmount: 749,
      inclusions: [
        'High-efficiency dry vacuuming to lift surface dust, pet hair, and crumbs.',
        'Pre-spotting and stain treatment using fabric-safe stain lifters.',
        'Rotary brush agitation to loosen trapped dirt in upholstery fibers.',
        'High-suction water-extraction rinse pulling out dissolved grime and detergents.',
        'Surface deodorization with fresh pleasant scent.'
      ],
      exclusions: [
        'Permanent dye transfer, ink burns, chemical bleaches, or sun-faded fabric cannot be reversed.',
        'Severe mold rot inside wooden internal frame.'
      ],
      equipment: [
        'Professional upholstery injection-extraction machine (dual-stage vacuum motor)',
        'Soft-bristled agitation brushes for delicate fabrics',
        'Biodegradable pH-balanced upholstery foam shampoo',
        'Specialized stain lifter for coffee, tea, and grease spots'
      ],
      packages: [
        {
          id: 'sofa-seat',
          name: 'Fabric Sofa Shampooing',
          unit: 'Per seat',
          price: 249,
          popular: true,
          description: 'Individual seat shampooing (e.g., 3-seater = ₹747, 5-seater = ₹1,245)',
          features: [
            'Seat, backrest & armrests included',
            'Dust mite & allergen extraction',
            'Dries naturally within 3-5 hours under ceiling fan'
          ]
        },
        {
          id: 'recliner',
          name: 'Recliner / Leatherette Chair',
          unit: 'Per chair',
          price: 399,
          description: 'Single leatherette or heavy recliner chair conditioning & deep clean',
          features: [
            'Deep seam crevice vacuuming',
            'Gentle agitation & leatherette conditioner',
            'Odor neutralizing treatment'
          ]
        },
        {
          id: 'carpet-rug',
          name: 'Living Room Carpet / Rug Cleaning',
          unit: 'Up to 25 sq ft',
          price: 499,
          description: 'Area rugs and center carpets up to 5x5 ft (larger at ₹18/sq ft)',
          features: [
            'High-power dual vacuuming',
            'Foam shampoo scrub and extraction',
            'Pile lifting and fiber refresh'
          ]
        },
        {
          id: 'mattress',
          name: 'Queen / King Mattress Sanitization',
          unit: 'Per mattress',
          price: 899,
          description: 'Double-sided dry vacuuming, stain spot treatment & sanitization',
          features: [
            'Dead skin & dust mite extraction',
            'Antibacterial disinfectant mist',
            'Stain removal on top surface'
          ]
        }
      ]
    },
    {
      id: 'painting',
      title: 'Interior & Exterior Painting',
      tagline: 'Wall preparation, primer, crack filling, and finished coating.',
      category: 'restoration',
      badge: 'Free On-Site Quote',
      startingPrice: 12,
      unitLabel: 'per sq ft (subject to wall condition)',
      summary: 'Dust-free sanding, acrylic putty crack repair, anti-fungal primer coat, and precision application of washable emulsion or exterior weather-shield paints.',
      image: '/images/service-painting.jpg',
      durationEst: '2 to 6 days depending on property size',
      inspectionRequired: true,
      minOrderAmount: 4999,
      inclusions: [
        'Complete floor & furniture masking with protective polythene sheets and masking tape.',
        'Wall scraping to remove loose paint flakes and efflorescence.',
        'Filling hairline cracks and dents using exterior/interior acrylic wall putty.',
        'Sanding for an ultra-smooth level base.',
        'Application of 1 coat sealer/primer + 2 coats premium emulsion paint.',
        'Post-painting site clean-up and masking sheet removal.'
      ],
      exclusions: [
        'Major structural civil repairs or active roof seepage rectifications (waterproofing consultation available separately).',
        'Scaffolding for buildings above 2 floors is calculated based on site requirement.'
      ],
      equipment: [
        'Airless paint spray equipment and precision microfiber rollers',
        'Dust-free electric drywall sander with vacuum collection',
        'Floor and furniture protective drop sheets',
        'Moisture meter for testing wall dampness levels before paint application'
      ],
      packages: [
        {
          id: 'paint-interior-touchup',
          name: 'Interior Repainting (Standard Emulsion)',
          unit: '₹12 - ₹15 / sq ft',
          price: 12,
          popular: true,
          requiresInspection: true,
          description: 'Fresh coat of washable interior emulsion over existing sound walls',
          features: [
            'Furniture and floor masking included',
            'Minor crack filling & spot putty repair',
            '1 coat primer + 2 coats quality emulsion',
            'Full clean-up post work'
          ]
        },
        {
          id: 'paint-interior-premium',
          name: 'Interior Luxury / Royale Finish',
          unit: '₹16 - ₹22 / sq ft',
          price: 16,
          requiresInspection: true,
          description: 'Full 2-coat putty skim coat, ultra-fine sanding & luxury sheen emulsion',
          features: [
            'Complete wall surface leveling',
            'Zero brush marks with roller finish',
            'High stain resistance & durability',
            'Free color consultation'
          ]
        },
        {
          id: 'paint-exterior',
          name: 'Exterior Weatherproof Protection',
          unit: '₹14 - ₹20 / sq ft',
          price: 14,
          requiresInspection: true,
          description: 'Anti-algal, UV-resistant exterior acrylic paint for villas & buildings',
          features: [
            'Pressure wash preparation to strip fungal spores',
            'Crack-bridging exterior primer',
            '2 coats heavy weather-defense coat',
            'Protects against monsoon moisture'
          ]
        }
      ]
    },
    {
      id: 'water-tank',
      title: 'Water Tank Cleaning',
      tagline: '6-Stage scientific disinfection for overhead tanks and sumps.',
      category: 'housekeeping',
      badge: 'Essential Health',
      startingPrice: 699,
      unitLabel: 'per tank (from 1,000L)',
      summary: 'Scientific 6-stage mechanized cleaning process using submersible dewatering pumps, high-pressure jet washers, industrial sludge vacuums, and safe anti-bacterial disinfection.',
      image: '/images/service-water-tank.jpg',
      durationEst: '1.5 to 3 hours per tank',
      inspectionRequired: false,
      minOrderAmount: 699,
      inclusions: [
        'Stage 1: Dewatering remaining dirty water using submersible pump.',
        'Stage 2: Heavy sludge and sediment extraction using wet slurry vacuum.',
        'Stage 3: High-pressure rotary water jet washing to strip algae and wall bio-films.',
        'Stage 4: Manual scrubbing of corners and joints using food-grade cleaning compounds.',
        'Stage 5: Final vacuuming of loosened debris and residue.',
        'Stage 6: UV antibacterial spray / non-toxic disinfection for clean drinking-safe storage.'
      ],
      exclusions: [
        'Plumbing pipe leak repairs, float valve replacement, or structural concrete crack grouting (quoted separately if required).',
        'Customer must arrange convenient time when tank water level is already low to prevent water waste.'
      ],
      equipment: [
        '0.5 HP Submersible dirty water drainage pump',
        '140-bar high pressure jet wash machine',
        'Heavy sludge extraction slurry vacuum',
        'Non-toxic, food-grade disinfectant certified safe for potable water reservoirs'
      ],
      packages: [
        {
          id: 'tank-1000',
          name: 'Overhead PVC/Sintex Tank (Up to 1,000L)',
          unit: '1 Tank (up to 1,000 Litres)',
          price: 699,
          popular: true,
          description: 'Standard rooftop water storage tank for independent houses and flats',
          features: [
            'Complete 6-stage mechanized process',
            'Algae & biofilm removal',
            'UV / food-safe antibacterial treatment',
            'Finished within 90 minutes'
          ]
        },
        {
          id: 'tank-2000',
          name: 'Overhead Tank (1,500L – 2,000L)',
          unit: '1 Tank (up to 2,000 Litres)',
          price: 999,
          description: 'Large rooftop tank for large families or commercial villas',
          features: [
            'Heavy sludge extraction',
            'High-pressure rotary jet spray',
            'Inside wall & floor descaling',
            'Safe for immediate refill'
          ]
        },
        {
          id: 'sump-5000',
          name: 'Underground RCC Sump (Up to 5,000L)',
          unit: '1 Sump (up to 5,000 Litres)',
          price: 1899,
          description: 'Underground concrete water reservoir for villas and standalone buildings',
          features: [
            'Submersible pump dewatering',
            'Confined space trained staff with safety gear',
            'Complete wall & base scrub down',
            'Odor and slime neutralization'
          ]
        },
        {
          id: 'sump-society',
          name: 'Gated Community / Large Capacity Sump',
          unit: 'Above 5,000 Litres',
          price: 2999,
          requiresInspection: true,
          description: 'Multi-apartment complexes, schools, and commercial properties',
          features: [
            'Free on-site capacity assessment',
            'Multi-pump parallel dewatering',
            'Industrial disinfection protocol',
            'Detailed water purity checklist'
          ]
        }
      ]
    },
    {
      id: 'express-addons',
      title: 'Targeted Room & Appliance Add-Ons',
      tagline: 'Transparent individual unit services designed for specific problem corners and fixtures.',
      category: 'add-on',
      badge: 'From ₹199/-',
      startingPrice: 199,
      unitLabel: 'per fixture / room unit',
      summary: 'Pick individual room sanitizations or appliance degreasing tasks. Minimum doorstep order of ₹499 applies, or add to any primary package with zero minimum fee.',
      image: '/images/service-bathroom.jpg',
      durationEst: '45 mins to 2 hours',
      inspectionRequired: false,
      minOrderAmount: 499,
      inclusions: [
        'Dedicated cleaning of targeted fixture or room unit with professional chemicals.',
        'Sanitization of immediate surrounding area and waste disposal.'
      ],
      exclusions: [
        'Does not include cleaning of adjacent unselected rooms or areas.'
      ],
      equipment: [
        'Targeted descaling agents, degreasers, microfibers, and detail brushes'
      ],
      packages: [
        {
          id: 'addon-fan',
          name: 'Ceiling Fan Deep Cleaning & Blade Degrease',
          unit: 'Per fan',
          price: 199,
          popular: true,
          description: 'Starting from ₹199/- entry service: Blade degreasing, motor casing wipedown & buff',
          features: [
            'Removes stubborn oily dust layers',
            'Motor casing wipe without water damage',
            'Min doorstep order ₹499 or add to any package'
          ]
        },
        {
          id: 'addon-exhaust',
          name: 'Kitchen / Bathroom Exhaust Fan Degreasing',
          unit: 'Per exhaust fan',
          price: 249,
          description: 'Complete removal of thick grease, oil grime, and dust deposits',
          features: [
            'Safe electrical isolation and blade cleaning',
            'High-power alkaline degreaser',
            'Grill and duct casing sanitization'
          ]
        },
        {
          id: 'addon-bathroom-single',
          name: 'Single Bathroom Complete Descaling',
          unit: 'Per bathroom',
          price: 599,
          popular: true,
          description: 'Intense descaling of tiles, hard-water stains on taps, commode, and mirror',
          features: [
            'Acid-free chemical descaler safe for glazed tiles',
            'Chrome tap and shower head shining',
            'Exhaust fan wipedown and floor scrub'
          ]
        },
        {
          id: 'addon-kitchen-single',
          name: 'Kitchen Deep Degreasing & Sink Sanitization',
          unit: 'Per kitchen',
          price: 1199,
          description: 'Tile backsplash degreasing, exterior chimney wipe, countertop scrub, sink descaling',
          features: [
            'Removes stubborn cooking grease films',
            'Granite / tile surface conditioning',
            'Drain deodorization'
          ]
        },
        {
          id: 'addon-balcony-single',
          name: 'Balcony Floor Wash & Railing Scrub',
          unit: 'Per balcony',
          price: 399,
          description: 'Floor tile scrub, dust removal, and glass / iron railing wipedown',
          features: [
            'Pigeon mess removal and disinfection',
            'Drain outlet clearing',
            'High-pressure wet mop'
          ]
        }
      ]
    }
  ]
};
