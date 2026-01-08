export const BUSINESS_TYPES = [
  { type: "restaurants", icon: "fa fa-utensils", label: "Restaurants" },
  { type: "events", icon: "fa fa-calendar", label: "Events" },
  { type: "shopping", icon: "fa fa-shopping-cart", label: "Shopping" },
  { type: "adventures", icon: "fa fa-hiking", label: "Adventures" },
  { type: "hotels", icon: "fa fa-hotel", label: "Hotels" },
  { type: "flight_schools", icon: "fa fa-plane", label: "Flight Schools" },
  { type: "cfis", icon: "fa fa-plane", label: "CFIs" },
  {
    type: "aircraft_sales_rentals",
    icon: "fa fa-plane-departure",
    label: "Aircraft Sales / Rentals",
  },
  {
    type: "aircraft_services_parts",
    icon: "fa fa-cogs",
    label: "Aircraft Services / Parts",
  },
  {
    type: "medical_examiners",
    icon: "fa fa-user-md",
    label: "Medical Examiners",
  },
  { type: "insurance", icon: "fa fa-shield-alt", label: "Insurance" }, // Added Insurance
];

export const BUSINESS_SUBTYPES = [
  {
    category: "Aircraft Brokers & Dealers",
    subcategories: [
      {
        type: "aircraft_sales_new",
        label: "Aircraft Sales - New",
        icon: "fa fa-plane",
        description:
          "Factory-direct or authorized dealers offering the latest models across categories.",
      },
      {
        type: "aircraft_sales_pre_owned",
        label: "Aircraft Sales - Pre-Owned",
        icon: "fa fa-plane",
        description:
          "Experts who connect buyers and sellers of used aircraft, from singles to jets.",
      },
      {
        type: "leasing_fractional_ownership",
        label: "Leasing & Fractional Ownership",
        icon: "fa fa-plane",
        description:
          "Flexible ownership models including dry leases, wet leases, and shared access.",
      },
      {
        type: "commercial_aircraft_brokers_dealers",
        label: "Commerical Aircraft Brokers & Dealers",
        icon: "fa fa-plane",
        description:
          "Firms handling large passenger, cargo, or utility aircraft transactions for airlines or fleets.",
      },
      {
        type: "corporate_jet_brokers_dealers",
        label: "Corporate Jet Brokers & Dealers",
        icon: "fa fa-plane",
        description:
          "Specialists in sourcing, listing, or managing sales of midsize to heavy business jets.",
      },
      {
        type: "helicopter_brokers_dealers",
        label: "Helicopter Brokers & Dealers",
        icon: "fa fa-helicopter",
        description:
          "Sales professionals and dealerships dedicated to rotorcraft — new, used, or mission-equipped.",
      },
      {
        type: "piston_aircraft_brokers_dealers",
        label: "Piston Aircraft Brokers & Dealers",
        icon: "fa fa-plane-up",
        description:
          "Experts in the buying, selling, or trading of single- and twin-engine piston aircraft.",
      },
      {
        type: "private_jet_brokers_dealers",
        label: "Private Jet Brokers & Dealers",
        icon: "fa fa-plane-departure",
        description:
          "Boutique brokers focused on light and ultra-light private jet transactions and acquisitions.",
      },
    ],
  },
  {
    category: "Aircraft Charter Companies",
    subcategories: [
      {
        type: "on_demand_air_taxi_flights",
        label: "Air Taxi & On-Demand Flights",
        icon: "fa fa-taxi",
        description:
          "Flexible point-to-point air service for short hops and regional travel.",
      },
      {
        type: "aircraft_charter_companies",
        label: "Aircraft Charter Companies",
        icon: "fa fa-plane-circle-check",
        description:
          "On-demand air travel providers for private, corporate, or cargo flights.",
      },
      {
        type: "air_ambulance_services",
        label: "Air Ambulance Services",
        icon: "fa fa-truck-medical",
        description:
          "Aircraft equipped and staffed for emergency medical transport, medevac, and critical care in flight.",
      },
      {
        type: "aircraft_cargo_companies",
        label: "Aircraft Cargo Companies",
        icon: "fa fa-box-open",
        description:
          "Operators specializing in air freight, parcel logistics, and time-sensitive cargo delivery.",
      },
      {
        type: "aircraft_charter_brokers",
        label: "Aircraft Charter Brokers",
        icon: "fa fa-handshake",
        description:
          "Agencies that source aircraft and coordinate private or group charters through third-party operators.",
      },
      {
        type: "fractional_aircraft_ownership",
        label: "Fractional Aircraft Ownership",
        icon: "fa fa-share-nodes",
        description:
          "Programs offering shared ownership or guaranteed hours on private aircraft with lower upfront cost.",
      },
      {
        type: "international_aircraft_charter",
        label: "International Aircraft Charter",
        icon: "fa fa-earth-americas",
        description:
          "Providers specializing in cross-border or intercontinental private flight planning and execution.",
      },
      {
        type: "private_aircraft_charter_companies",
        label: "Private Aircraft Charter Companies",
        icon: "fa fa-plane-lock",
        description:
          "Charter operators focused exclusively on luxury or business-class private aircraft for individuals and small groups.",
      },
    ],
  },
  {
    category: "Aircraft Financing",
    subcategories: [
      {
        type: "appraisal_services",
        label: "Appraisal Services",
        icon: "fa fa-magnifying-glass-dollar",
        description:
          "Certified professionals who assess aircraft market value for financing, resale, or insurance purposes.",
      },
      {
        type: "aviation_banking_lending",
        label: "Aviation Banking & Lending",
        icon: "fa fa-money-bill-transfer",
        description:
          "Companies that offer aircraft loans, leases, and fractional financing options.",
      },
      {
        type: "escrow_services",
        label: "Escrow Services",
        icon: "fa fa-file-invoice-dollar",
        description:
          "Secure third-party services that manage funds, documents, and titles during aircraft transactions to protect both buyer and seller.",
      },
    ],
  },
  {
    category: "Aircraft Maintenance & Inspection",
    subcategories: [
      {
        type: "aog_aircraft_on_ground_support",
        label: "AOG (Aircraft on Ground) Support",
        icon: "fa fa-wrench",
        description:
          "Emergency repair teams ready to get you flying again, fast.",
      },
      {
        type: "airframe",
        label: "Airframe",
        icon: "fa fa-screwdriver-wrench",
        description:
          "Structural inspections, repairs, and modifications to fuselage, wings, and landing gear.",
      },
      {
        type: "commercial",
        label: "Commercial",
        icon: "fa fa-industry",
        description:
          "Maintenance services tailored to commercial aircraft operations and airline requirements.",
      },
      {
        type: "corporate",
        label: "Corporate",
        icon: "fa fa-briefcase",
        description:
          "Specialized upkeep for business jets, ensuring minimal downtime and high reliability.",
      },
      {
        type: "detailing_cleaning",
        label: "Detailing & Cleaning",
        icon: "fa fa-spray-can",
        description:
          "Professional interior and exterior cleaning, polishing, brightwork, and sanitation.",
      },
      {
        type: "engine_overhaul_repair",
        label: "Engine Overhaul & Repair",
        icon: "fa fa-gears",
        description:
          "Full teardown, inspection, and rebuild services for piston and turbine engines to manufacturer specs.",
      },
      {
        type: "equipment",
        label: "Equipment",
        icon: "fa fa-cogs",
        description:
          "Maintenance and calibration of onboard aircraft systems, tools, and specialty equipment.",
      },
      {
        type: "helicopters",
        label: "Helicopters",
        icon: "fa fa-helicopter",
        description:
          "Rotary-wing aircraft maintenance, including rotor systems, gearboxes, and avionics.",
      },
      {
        type: "jet_aircraft",
        label: "Jet Aircraft",
        icon: "fa fa-jet-fighter",
        description:
          "Scheduled and unscheduled maintenance for light, midsize, and heavy jets.",
      },
      {
        type: "light_sport_aircraft",
        label: "Light Sport Aircraft",
        icon: "fa fa-plane-up",
        description:
          "Services for LSA-class aircraft, including Rotax engine support and composite repairs.",
      },
      {
        type: "maintenance_programs",
        label: "Maintenance Programs",
        icon: "fa fa-clipboard-list",
        description:
          "Flat-rate or subscription-based service plans covering regular maintenance, inspections, and compliance.",
      },
      {
        type: "maintenance_repair_and_overhaul",
        label: "Maintenance, Repair and Overhaul",
        icon: "fa fa-screwdriver-wrench",
        description:
          "Routine and unscheduled inspections, repairs, part replacements, overhaul work, and airworthiness compliance.",
      },
      {
        type: "pre_purchase_inspections",
        label: "Pre-Purchase Inspections",
        icon: "fa fa-file-contract",
        description:
          "Thorough aircraft pre-buy inspections to verify condition, logbook accuracy, and airworthiness and ensure safety, compliance, and value.",
      },
      {
        type: "piston_aircraft",
        label: "Piston Aircraft",
        icon: "fa fa-engine",
        description:
          "Maintenance focused on single and twin-engine piston aircraft used in GA and training.",
      },
      {
        type: "tools",
        label: "Tools",
        icon: "fa fa-toolbox",
        description:
          "Specialized tooling, calibration services, and sales for aircraft maintenance operations.",
      },
    ],
  },
  {
    category: "Aircraft Manufacturers",
    subcategories: [
      {
        type: "aircraft_manufacturers",
        label: "Aircraft Manufacturers",
        icon: "fa fa-industry",
        description:
          "Full-service OEMs producing certified aircraft for personal, commercial, or government use.",
      },
      {
        type: "commercial_manufacturers",
        label: "Commercial",
        icon: "fa fa-building",
        description:
          "Manufacturers of passenger and cargo aircraft for airlines and fleet operators.",
      },
      {
        type: "corporate_manufacturers",
        label: "Corporate",
        icon: "fa fa-city",
        description:
          "Builders of business-class aircraft tailored to executive and VIP travel.",
      },
      {
        type: "engines",
        label: "Engines",
        icon: "fa fa-fan",
        description:
          "Companies specializing in the design and manufacturing of aircraft engines (piston, turbine, jet).",
      },
      {
        type: "helicopter",
        label: "Helicopter",
        icon: "fa fa-helicopter",
        description:
          "OEMs producing rotary-wing aircraft for civilian, military, or utility applications.",
      },
      {
        type: "jet_aircraft",
        label: "Jet Aircraft",
        icon: "fa fa-jet-fighter-up",
        description:
          "Manufacturers of light, midsize, and heavy jets for private, commercial, or specialized use.",
      },
      {
        type: "light_sport_aircraft",
        label: "Light Sport Aircraft",
        icon: "fa fa-plane-up",
        description:
          "Builders of lightweight, recreational aircraft under LSA certification standards.",
      },
      {
        type: "military",
        label: "Military",
        icon: "fa fa-shield-halved",
        description:
          "Defense contractors and OEMs producing aircraft for military operations and national defense.",
      },
      {
        type: "piston_aircraft",
        label: "Piston Aircraft",
        icon: "fa fa-engine",
        description:
          "Manufacturers of general aviation aircraft powered by piston engines — ideal for training and personal use.",
      },
    ],
  },
  {
    category: "Aircraft Upgrades & Customization",
    subcategories: [
      {
        type: "avionics_upgrades",
        label: "Avionics Upgrades",
        icon: "fa fa-microchip",
        description:
          "Installation of advanced navigation, communication, and flight management systems.",
      },
      {
        type: "cabin_entertainment_connectivity",
        label: "Cabin Entertainment & Connectivity",
        icon: "fa fa-wifi",
        description:
          "In-flight Wi-Fi, audio/video systems, and passenger control technology installations.",
      },
      {
        type: "completion_refurbishment_centers",
        label: "Completion & Refurbishment Centers",
        icon: "fa fa-paint-roller",
        description:
          "Full-service providers for interior outfitting, luxury cabin upgrades, and final delivery customizations — especially for new or “green” aircraft.",
      },
      {
        type: "paint_interior",
        label: "Paint & Interior",
        icon: "fa fa-brush",
        description:
          "Full exterior paint jobs, custom designs, and touch-ups. Seats, cabinetry, lighting, and upholstery upgrades or repairs.",
      },
      {
        type: "stc_modifications",
        label: "STC Modifications",
        icon: "fa fa-certificate",
        description:
          "FAA-approved structural or performance upgrades under Supplemental Type Certificates.",
      },
    ],
  },
  {
    category: "Aircraft Parts & Component Suppliers",
    subcategories: [
      {
        type: "airplane_parts_manufacturers",
        label: "Airplane Parts Manufacturers",
        icon: "fa fa-gears",
        description:
          "Authorized DistributorsLicensed resellers of parts from major OEMs and aviation brands.",
      },
      {
        type: "fuel_cell_tank_specialists",
        label: "Fuel Cell & Tank Specialits",
        icon: "fa fa-gas-pump",
        description:
          "Vendors and technicians focused on aircraft fuel systems and cell replacements.",
      },
      {
        type: "oem_aftermarket_parts_suppliers",
        label: "OEM & Aftermarket Parts Suppliers",
        icon: "fa fa-warehouse",
        description:
          "Manufacturers and vendors offering new, certified original or third-party parts.",
      },
      {
        type: "overhauler_exchange_services",
        label: "Overhauler & Exchange Services",
        icon: "fa fa-sync-alt",
        description:
          "Providers who refurbish, certify, and offer replacement parts on an exchange basis.",
      },
      {
        type: "parts_locators",
        label: "Parts Locators",
        icon: "fa fa-search",
        description:
          "Specialists in sourcing hard-to-find, discontinued, or legacy aircraft components.",
      },
      {
        type: "salvage",
        label: "Salvage",
        icon: "fa fa-recycle",
        description:
          "Recycled parts and airworthy components pulled from decommissioned aircraft.",
      },
    ],
  },
  {
    category: "Airport FBOs & Ground Services",
    subcategories: [
      {
        type: "fbos",
        label: "FBOs",
        icon: "fa fa-building-columns",
        description:
          "Full-service aviation hubs offering fuel, crew lounges, concierge, hangar space, ground handling, and more.",
      },
      {
        type: "fuel_cards",
        label: "Fuel Cards",
        icon: "fa fa-credit-card",
        description:
          "Membership or discount programs for pilots and operators to access fuel at preferred rates across partner FBOs.",
      },
      {
        type: "fueling_services_jet_a_avg",
        label: "Fueling Services (Jet A, Avgas)",
        icon: "fa fa-gas-pump",
        description:
          "On-site fueling providers for both turbine and piston aircraft, including self-serve and full-serve options.",
      },
      {
        type: "ground_handlers",
        label: "Ground Handlers",
        icon: "fa fa-people-carry-box",
        description:
          "Staff and companies providing aircraft marshaling, baggage handling, towing, lav service, and GPU hookups.",
      },
      {
        type: "international",
        label: "International",
        icon: "fa fa-globe",
        description:
          "FBOs and service providers specializing in customs clearance, international handling, and cross-border flight support.",
      },
    ],
  },
  {
    category: "Airports, Airfields & Heliports",
    subcategories: [
      {
        type: "airports_usa",
        label: "Airports - USA",
        icon: "fa fa-flag-usa",
        description:
          "Public and private-use airports located across the United States, including GA fields and towered facilities.",
      },
      {
        type: "airports_international",
        label: "Airports - International",
        icon: "fa fa-earth-europe",
        description:
          "Airports outside the U.S., serving general aviation, commercial, and cargo operations worldwide.",
      },
      {
        type: "airport_consulting",
        label: "Airport Consulting",
        icon: "fa fa-handshake-angle",
        description:
          "Professionals who offer planning, design, operations, and compliance services for airport development and management.",
      },
      {
        type: "ground_equipment",
        label: "Ground Equipment",
        icon: "fa fa-truck-ramp-box",
        description:
          "Suppliers of airport support gear such as tugs, GPUs, fuel trucks, de-icing units, and safety equipment.",
      },
      {
        type: "ground_transportation_providers",
        label: "Ground Transportation Providers",
        icon: "fa fa-car",
        description:
          "Car rentals, shuttles, crew cars, and pre-arranged transport for pilots and passengers.",
      },
      {
        type: "hangar_rentals",
        label: "Hangar Rentals",
        icon: "fa fa-warehouse",
        description:
          "Short- and long-term storage options for aircraft of all sizes.",
      },
      {
        type: "tie_down_ramp_services",
        label: "Tie-Down & Ramp Services",
        icon: "fa fa-anchor",
        description:
          "Outdoor parking, aircraft securing, and ramp-side support.",
      },
    ],
  },
  {
    category: "Aviation Publications",
    subcategories: [
      {
        type: "aviation_media_companies",
        label: "Aviation Media Companies",
        icon: "fa fa-film",
        description:
          "Full-service publishers and media networks producing aviation content across digital, print, and video platforms.",
      },
      {
        type: "blogs",
        label: "Blogs",
        icon: "fa fa-blog",
        description:
          "Independent writers and industry professionals sharing personal experiences, insights, and aviation know-how.",
      },
      {
        type: "books",
        label: "Books",
        icon: "fa fa-book",
        description:
          "Published works covering aviation history, flight training, technical manuals, biographies, and more.",
      },
      {
        type: "creators_influencers",
        label: "Creators & Influencers",
        icon: "fa fa-users",
        description:
          "Aviation-focused content creators on YouTube, Instagram, TikTok, and beyond — inspiring the next generation of pilots and enthusiasts.",
      },
      {
        type: "magazines",
        label: "Magazines",
        icon: "fa fa-newspaper",
        description:
          "Print and digital periodicals featuring aircraft reviews, flight tips, industry trends, and pilot lifestyle.",
      },
      {
        type: "news",
        label: "News",
        icon: "fa fa-globe",
        description:
          "Real-time aviation news sources covering regulations, airspace changes, accidents, and aviation developments.",
      },
      {
        type: "social_networks",
        label: "Social Networks",
        icon: "fa fa-share-alt",
        description:
          "Online communities and platforms where aviators connect, share content, and discuss all things aviation.",
      },
    ],
  },
  {
    category: "Aviation Education & Training",
    subcategories: [
      {
        type: "aircraft_dispatcher_schools",
        label: "Aircraft Dispatcher Schools",
        icon: "fa fa-user-tie",
        description:
          "FAA-approved programs that train and certify dispatchers to plan and monitor flight operations.",
      },
      {
        type: "aircraft_maintenance_training",
        label: "Aircraft Maintenance Training",
        icon: "fa fa-tools",
        description:
          "Schools and programs focused on preparing students for A&P certification and aircraft systems maintenance careers.",
      },
      {
        type: "aviation_colleges_universities",
        label: "Aviation Colleges & Universities",
        icon: "fa fa-graduation-cap",
        description:
          "Accredited institutions offering degree programs in flight, maintenance, aerospace engineering, and aviation business.",
      },
      {
        type: "aviation_scholarships",
        label: "Aviation Scholarships",
        icon: "fa fa-dollar-sign",
        description:
          "Financial aid opportunities for students pursuing aviation careers in flight, maintenance, or operations.",
      },
      {
        type: "certified_flight_instructors",
        label: "Certified Flight Instructors",
        icon: "fa fa-chalkboard-teacher",
        description:
          "Advertise your expertise and connect with students seeking personalized flight instruction. Licensed instructors offering one-on-one or structured flight training for all pilot certificate levels.",
      },
      {
        type: "flying_clubs",
        label: "Flying Clubs",
        icon: "fa fa-users-rays",
        description:
          "Reach out to individuals with a dream to fly and showcase your training programs to future pilots. Member-based organizations providing affordable access to aircraft, instruction, and a supportive flying community.",
      },
      {
        type: "flight_schools_recurrent_aircraft_training",
        label: "Flight Schools & Recurrent Aircraft Training",
        icon: "fa fa-plane-departure",
        description:
          "Certified flight schools and instructors for private, instrument, commercial, multi-engine ratings, and more.",
      },
      {
        type: "flight_simulator_training",
        label: "Flight Simulator Training",
        icon: "fa fa-gamepad",
        description:
          "Hands-on training using full-motion or desktop simulators for safer, cost-effective learning and proficiency.",
      },
      {
        type: "ground_schools",
        label: "Ground Schools",
        icon: "fa fa-school",
        description:
          "Classroom or online programs covering the theoretical knowledge required for FAA written exams.",
      },
      {
        type: "helicopter_training",
        label: "Helicopter Training",
        icon: "fa fa-helicopter",
        description:
          "Specialized instruction for rotary-wing aircraft, from private to commercial pilot certifications.",
      },
      {
        type: "training_materials",
        label: "Training Materials",
        icon: "fa fa-book-reader",
        description:
          "Educational content such as textbooks, online courses, and exam prep tools for pilots and mechanics.",
      },
      {
        type: "drone_training_courses",
        label: "Drone Training Courses",
        icon: "fa fa-drone",
        description:
          "Connect with aspiring drone pilots seeking qualified instruction to launch their careers. Structured programs for aspiring drone pilots covering FAA Part 107 certification, flight safety, and career preparation.",
      },
    ],
  },
  {
    category: "Avionics",
    subcategories: [
      {
        type: "avionics",
        label: "Avionics",
        icon: "fa fa-satellite-dish",
        description:
          "General category for all avionics services, including sales, installation, and upgrades.",
      },
      {
        type: "avionics_resources",
        label: "Avionics Resources",
        icon: "fa fa-book",
        description:
          "Educational, technical, and regulatory resources related to avionics systems and maintenance.",
      },
      {
        type: "distributors",
        label: "Distributors",
        icon: "fa fa-truck",
        description:
          "Authorized resellers of avionics equipment from major manufacturers, including GPS, ADS-B, and communication systems.",
      },
      {
        type: "manufacturers",
        label: "Manufacturers",
        icon: "fa fa-industry",
        description:
          "Companies that design and produce avionics systems for navigation, communication, autopilot, and flight displays.",
      },
      {
        type: "repair",
        label: "Repair",
        icon: "fa fa-wrench",
        description:
          "Diagnostics, testing, and repair services for flight instruments, radios, and other electronic components.",
      },
      {
        type: "satellite_communications_systems",
        label: "Satellite Communications Systems",
        icon: "fa fa-satellite",
        description:
          "Providers and installers of SATCOM systems for in-flight internet, voice, weather, and global connectivity.",
      },
    ],
  },
  {
    category: "Entertainment & Experiences",
    subcategories: [
      {
        type: "adventures",
        label: "Adventures",
        icon: "fa fa-mountain",
        description:
          "Unique aviation-related activities such as formation flying, bush flying, aerobatics, skydiving, and backcountry excursions.",
      },
      {
        type: "airshows_fly_ins",
        label: "Airshows & Fly-Ins",
        icon: "fa fa-flag-checkered",
        description:
          "Events that celebrate aviation culture — from grassroots fly-ins to international showcases featuring aerial performances and static displays.",
      },
      {
        type: "aviation_museums",
        label: "Aviation Museums",
        icon: "fa fa-building-columns",
        description:
          "Institutions preserving and showcasing aviation history, aircraft, innovation, and educational exhibits.",
      },
      {
        type: "flight_flying_experiences",
        label: "Flight & Flying Experiences",
        icon: "fa fa-plane-up",
        description:
          "Hands-on discovery flights, introductory lessons, and thrill rides for aspiring pilots and aviation enthusiasts.",
      },
      {
        type: "sightseeing_scenic_tours",
        label: "Sightseeing & Scenic Tours",
        icon: "fa fa-binoculars",
        description:
          "Aerial experiences and scenic flights over iconic destinations, landmarks, and natural wonders.",
      },
    ],
  },
  {
    category: "Insurance Companies",
    subcategories: [
      {
        type: "aviation_related_insurance_companies",
        label: "Aviation-Related Insurance Companies",
        icon: "fa fa-hand-holding-dollar",
        description:
          "Firms that specialize in underwriting aircraft, airport, hangar, and aviation business policies.",
      },
      {
        type: "aircraft_insurance_coverage",
        label: "Aircraft Insurance Coverage",
        icon: "fa fa-car-crash",
        description:
          "Policies covering hull damage, liability, in-flight incidents, ground risk, and comprehensive protection for aircraft owners.",
      },
      {
        type: "pilot_insurance",
        label: "Pilot Insurance",
        icon: "fa fa-user-shield",
        description:
          "Coverage tailored to individual pilots, including life, loss of license, medical, and liability protection.",
      },
    ],
  },
  {
    category: "Lodging & Hospitality",
    subcategories: [
      {
        type: "fly_in_friendly_lodging",
        label: "Fly-In Friendly Lodging",
        icon: "fa fa-bed",
        description:
          "Hotels, cabins, and inns located near airparks, runways, or private strips — with easy aircraft access.",
      },
      {
        type: "pilot_lodging_packages",
        label: "Pilot Lodging Packages",
        icon: "fa fa-hotel",
        description:
          "Accommodations offering exclusive discounts, transportation, or perks for aviators.",
      },
      {
        type: "airport_restaurants_cafes",
        label: "Airport Restaurants & Cafes",
        icon: "fa fa-utensils",
        description:
          "Dining spots located on or near airfields — perfect for $100 hamburgers and crew meals.",
      },
      {
        type: "aviation_themed_destinations",
        label: "Aviation-Themed Destinations",
        icon: "fa fa-map-marker-alt",
        description:
          "Unique overnight spots and resorts designed for aviation lovers and adventure seekers.",
      },
    ],
  },
  {
    category: "Media Services",
    subcategories: [
      {
        type: "aviation_photographers",
        label: "Aviation Photographers",
        icon: "fa fa-camera",
        description:
          "Specialists in capturing high-resolution stills of aircraft in flight, on the ramp, at events, or for promotional use.",
      },
      {
        type: "aviation_videographers",
        label: "Aviation Videographers",
        icon: "fa fa-video",
        description:
          "Professionals producing cinematic, documentary, or commercial video content for aviation brands, events, or aircraft sales.",
      },
      {
        type: "drone_pilots",
        label: "Drone Pilots",
        icon: "fa fa-drone",
        description:
          "Certified UAV operators offering aerial imagery, inspections, and creative footage for aviation marketing or operational needs.",
      },
    ],
  },
  {
    category: "Other Services",
    subcategories: [
      {
        type: "accounting_tax_services",
        label: "Accounting / Tax Services",
        icon: "fa fa-calculator",
        description:
          "Specialists in aircraft depreciation, tax strategies, cost recovery, and business use optimization.",
      },
      {
        type: "agricultural_utility_flying",
        label: "Agricultural / Utility Flying",
        icon: "fa fa-leaf",
        description:
          "Crop-dusting, pipeline patrol, aerial photography, firefighting, aerial survey, wildlife management, and other specialized ops.",
      },
      {
        type: "air_display_companies",
        label: "Air Show Performers",
        icon: "fa fa-plane-alt",
        description:
          "Teams and pilots offering aerobatic displays and formation flying for airshows and special events.",
      },
      {
        type: "air_shows_trade_shows",
        label: "Air Shows & Trade Shows",
        icon: "fa fa-exclamation",
        description:
          "Organizations and companies that organize or participate in aviation expos, exhibitions, and fly-ins.",
      },
      {
        type: "aircraft_hangar_construction_companies",
        label: "Aircraft Hangar Construction Companies",
        icon: "fa fa-hard-hat",
        description:
          "Builders specializing in custom aircraft hangars, T-hangars, and aviation facility infrastructure.",
      },
      {
        type: "aircraft_management_companies",
        label: "Aircraft Management Companies",
        icon: "fa fa-tasks",
        description:
          "Turnkey services handling everything from maintenance and compliance to staffing and scheduling for aircraft owners.",
      },
      {
        type: "aircraft_valeting_companies",
        label: "Aircraft Valeting Companies",
        icon: "fa fa-car-wash",
        description:
          "Providers of premium aircraft interior and exterior cleaning, detailing, and presentation services.",
      },
      {
        type: "aviation_consultants",
        label: "Aviation Consultants",
        icon: "fa fa-user-tie",
        description:
          "Experts offering advisory services in regulatory compliance, operational efficiency, airport planning, and aircraft acquisition.",
      },
      {
        type: "aviation_law_firms",
        label: "Aviation Law Firms",
        icon: "fa fa-gavel",
        description:
          "Legal professionals focused on aircraft transactions, FAA enforcement, aviation litigation, and regulatory law.",
      },
      {
        type: "aviation_marketing_companies",
        label: "Aviation Marketing Companies",
        icon: "fa fa-bullhorn",
        description:
          "Agencies specializing in branding, content, digital ads, and social media for aviation businesses.",
      },
      {
        type: "charities_aviation_charities",
        label: "Charities Aviation Charities",
        icon: "fa fa-hand-holding-heart",
        description:
          "Nonprofits that provide flights for humanitarian causes, veteran support, youth aviation programs, and disaster response.",
      },
      {
        type: "cleaning_solutions_polishes",
        label: "Cleaning Solutions-Polishes",
        icon: "fa fa-soap",
        description:
          "Manufacturers and suppliers of aviation-grade cleaning products for aircraft exteriors, interiors, and brightwork.",
      },
      {
        type: "collectibles",
        label: "Collectibles",
        icon: "fa fa-box",
        description:
          "Aviation-themed merchandise including model aircraft, patches, vintage instruments, art, and memorabilia.",
      },
      {
        type: "ferry_service_aircraft_ferrying_companies",
        label: "Ferry Service Aircraft Ferrying Companies",
        icon: "fa fa-plane-slash",
        description:
          "Professional pilots and services that relocate aircraft across states or internationally for delivery or repositioning.",
      },
      {
        type: "flight_simulator_experience_companies",
        label: "Flight Simulator Experience Companies",
        icon: "fa fa-gamepad",
        description:
          "Businesses offering immersive flight sim experiences to the public or for pilot training enhancement.",
      },
      {
        type: "flight_support",
        label: "Flight Support",
        icon: "fa fa-life-ring",
        description:
          "Concierge services assisting with permits, ground handling, fuel, and international ops planning.",
      },
      {
        type: "freelance_pilots",
        label: "Freelance Pilots",
        icon: "fa fa-user-pilot",
        description:
          "Independent, contract-based pilots available for ferry flights, instruction, part-time operations, or crew augmentation.",
      },
      {
        type: "gliding_clubs",
        label: "Gliding Clubs",
        icon: "fa fa-wind",
        description:
          "Member-based organizations focused on non-powered flight and sailplane training, events, and recreation.",
      },
      {
        type: "hangars_for_sale_lease_hangarage",
        label: "Hangars for Sale/Lease Hangarage",
        icon: "fa fa-warehouse",
        description:
          "Listings and brokers for buying, selling, or leasing aircraft hangars across airports and private strips.",
      },
      {
        type: "inflight_catering",
        label: "InFlight Catering",
        icon: "fa fa-bread-slice",
        description:
          "Providers of high-quality meals, snacks, and beverages tailored for corporate and private jet flights.",
      },
      {
        type: "legal_compliance_consultants",
        label: "Legal & Compliance Consultants",
        icon: "fa fa-balance-scale",
        description:
          "Experts in FAA/ICAO regulations, aircraft registration, import/export, and ownership structures.",
      },
      {
        type: "limousine_transportation_services",
        label: "Limousine Transportation Services",
        icon: "fa fa-car-side",
        description:
          "Luxury ground transport providers offering pickup/drop-off to airports, FBOs, and aviation events.",
      },
      {
        type: "other_services",
        label: "Other Services",
        icon: "fa fa-ellipsis-h",
        description:
          "A general-purpose category for Aviation-related businesses that offer value to pilots, owners, or operators.",
      },
      {
        type: "oxygen_systems",
        label: "Oxygen Systems",
        icon: "fa fa-lungs",
        description:
          "Suppliers and technicians specializing in aviation oxygen tanks, masks, servicing, and delivery systems.",
      },
      {
        type: "pilot_merchandise_gifts",
        label: "Pilot Merchandise & Gifts",
        icon: "fa fa-gift",
        description:
          "Apparel, gear, décor, and curated gifts for pilots and aviation lovers.",
      },
      {
        type: "real_estate_agents",
        label: "Real Estate Agents",
        icon: "fa fa-house-chimney",
        description:
          "Aviation properties including airpark homes, hangar homes, and runway-access real estate listings.",
      },
      {
        type: "safety_quality_and_risk_management",
        label: "Safety Quality and Risk Management",
        icon: "fa fa-check-circle",
        description:
          "Services focused on SMS (Safety Management Systems), audits, incident prevention, and regulatory alignment.",
      },
      {
        type: "security",
        label: "Security",
        icon: "fa fa-lock",
        description:
          "Providers of airport and aircraft security systems, access control, surveillance, and threat mitigation.",
      },
      {
        type: "skydiving",
        label: "Skydiving",
        icon: "fa fa-parachute-box",
        description:
          "Skydiving centers, instructors, and tandem operations offering thrilling jumps and aviation experiences.",
      },
    ],
  },
  {
    category: "Pilot Services",
    subcategories: [
      {
        type: "associations",
        label: "Associations",
        icon: "fa fa-users",
        description:
          "Professional pilot organizations offering advocacy, networking, certification support, and career development.",
      },
      {
        type: "employment",
        label: "Employment",
        icon: "fa fa-briefcase",
        description:
          "Job boards, recruiting services, and contract pilot agencies for full-time, part-time, or freelance flying opportunities.",
      },
      {
        type: "management_software",
        label: "Management Software",
        icon: "fa fa-laptop-code",
        description:
          "Digital tools to help pilots track flight hours, currencies, schedules, endorsements, and aircraft access.",
      },
      {
        type: "medical_services",
        label: "Medical Services",
        icon: "fa fa-user-md",
        description:
          "FAA-approved aviation medical examiners (AMEs) and services related to pilot health, certification, and renewals.",
      },
      {
        type: "pilot_operations_software",
        label: "Pilot Operations Software",
        icon: "fa fa-chart-line",
        description:
          "Flight planning, logbook, checklist, and documentation tools designed for daily pilot operations.",
      },
      {
        type: "pilot_resources",
        label: "Pilot Resources",
        icon: "fa fa-book-reader",
        description:
          "Online tools, guides, and communities supporting training, currency, aircraft systems knowledge, and continuing education.",
      },
      {
        type: "pilot_supplies",
        label: "Pilot Supplies",
        icon: "fa fa-shopping-bag",
        description:
          "Flight bags, headsets, charts, kneeboards, and other cockpit essentials for student and professional pilots.",
      },
    ],
  },
  {
    category: "Technology & Software",
    subcategories: [
      {
        type: "aircraft_scheduling_software",
        label: "Aircraft Scheduling Software",
        icon: "fa fa-calendar-alt",
        description:
          "Tools for managing aircraft availability, booking, and crew assignments.",
      },
      {
        type: "airport_management_systems",
        label: "Airport Management Systems",
        icon: "fa fa-desktop",
        description:
          "Solutions for FBOs, airparks, and airports to manage services, billing, and operations.",
      },
      {
        type: "flight_planning_tools",
        label: "Flight Planning Tools",
        icon: "fa fa-map",
        description:
          "Apps and software for weather routing, fuel calculations, NOTAMs, and preflight prep.",
      },
      {
        type: "logbook_maintenance_tracking",
        label: "Logbook & Maintenance Tracking",
        icon: "fa fa-clipboard",
        description:
          "Digital platforms and services to manage logbooks, track inspections, airworthiness directives, hours, and service records.",
      },
      {
        type: "tech_support",
        label: "Tech. Support",
        icon: "fa fa-headset",
        description:
          "IT services and support providers specializing in aviation systems, software implementation, troubleshooting, and ongoing tech infrastructure needs.",
      },
    ],
  },
];

export const DEFAULT_TYPE_ICONS = {
  restaurants: "fa-utensils", // FontAwesome class
  events: "fa-calendar-alt",
  shopping: "fa-shopping-bag",
  adventures: "fa-hiking",
  hotels: "fa-hotel",
  flight_schools: "fa-plane-departure",
  cfis: "fa-plane",
  aircraft_sales_rentals: "fa-plane",
  aircraft_services_parts: "fa-cogs",
  medical_examiners: "fa-user-md",
  insurance: "fa-shield-alt",
  aircraft_sales_new: "fa-plane",
  aircraft_sales_pre_owned: "fa-plane",
  leasing_fractional_ownership: "fa-plane",
  commercial_aircraft_brokers_dealers: "fa-plane",
  corporate_jet_brokers_dealers: "fa-plane",
  helicopter_brokers_dealers: "fa-helicopter",
  piston_aircraft_brokers_dealers: "fa-plane-up",
  private_jet_brokers_dealers: "fa-plane-departure",
  stays: "fa-home", // Add for the 'stays' type
  default: "fa-building", // A general fallback icon
};

export const getBusinessSubTypeLabel = (type: any) => {
  for (const category of BUSINESS_SUBTYPES) {
    for (const subcategory of category.subcategories) {
      if (subcategory.type === type) {
        return subcategory.label;
      }
    }
  }
  return undefined;
};

export const formatBusinessType = (type: string): string => {
  if (type.includes("_") && type.split("_").length > 2) {
    return type
      .replace(/_(?=[^_]*$)/, " /")
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  }
  return type.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
};
