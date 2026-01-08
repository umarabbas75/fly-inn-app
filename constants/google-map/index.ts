export const GOOGLE_MAP_LIBRARIES = ["places"] as const;

export const MAP_THEME = [
  {
    featureType: "all",
    elementType: "labels.text.fill",
    stylers: [
      {
        saturation: 36,
      },
      {
        color: "#333333",
      },
      {
        lightness: 40,
      },
    ],
  },
  {
    featureType: "all",
    elementType: "labels.text.stroke",
    stylers: [
      {
        visibility: "on",
      },
      {
        color: "#ffffff",
      },
      {
        lightness: 16,
      },
    ],
  },
  {
    featureType: "all",
    elementType: "labels.icon",
    stylers: [
      {
        visibility: "off",
      },
    ],
  },
  {
    featureType: "administrative",
    elementType: "geometry.fill",
    stylers: [
      {
        color: "#fefefe",
      },
      {
        lightness: 20,
      },
    ],
  },
  {
    featureType: "administrative",
    elementType: "geometry.stroke",
    stylers: [
      {
        color: "#fefefe",
      },
      {
        lightness: 17,
      },
      {
        weight: 1.2,
      },
    ],
  },
  {
    featureType: "landscape",
    elementType: "geometry",
    stylers: [
      {
        color: "#edebe4",
      },
      {
        lightness: 20,
      },
    ],
  },
  {
    featureType: "poi",
    elementType: "geometry",
    stylers: [
      {
        color: "#f5f5f5",
      },
      {
        lightness: 21,
      },
    ],
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [
      {
        color: "#dedede",
      },
      {
        lightness: 21,
      },
    ],
  },
  {
    featureType: "poi.park",
    elementType: "geometry.fill",
    stylers: [
      {
        color: "#d1ecc7",
      },
    ],
  },
  {
    featureType: "road.highway",
    elementType: "geometry.fill",
    stylers: [
      {
        color: "#ffffff",
      },
      {
        lightness: 17,
      },
    ],
  },
  {
    featureType: "road.highway",
    elementType: "geometry.stroke",
    stylers: [
      {
        color: "#ffffff",
      },
      {
        lightness: 29,
      },
      {
        weight: 0.2,
      },
    ],
  },
  {
    featureType: "road.arterial",
    elementType: "geometry",
    stylers: [
      {
        color: "#ffffff",
      },
      {
        lightness: 18,
      },
    ],
  },
  {
    featureType: "road.local",
    elementType: "geometry",
    stylers: [
      {
        color: "#ffffff",
      },
      {
        lightness: 16,
      },
    ],
  },
  {
    featureType: "transit",
    elementType: "geometry",
    stylers: [
      {
        color: "#f2f2f2",
      },
      {
        lightness: 19,
      },
    ],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [
      {
        color: "#bddddd",
      },
      {
        lightness: 17,
      },
    ],
  },
];

export const stays = [
  {
    id: "stay-001",
    lat: 34.0522, // Latitude for Los Angeles, CA
    lng: -118.2437, // Longitude for Los Angeles, CA
    name: "Spacious Downtown Loft",
    pricePerNight: 180,
    rating: 4.7,
    numberOfReviews: 120,
    imageUrl:
      "https://via.placeholder.com/400x300/FF5733/FFFFFF?text=Downtown+Loft",
  },
  {
    id: "stay-002",
    lat: 34.0195, // Latitude for Santa Monica, CA (near LA)
    lng: -118.4912, // Longitude for Santa Monica, CA
    name: "Beachfront Bungalow",
    pricePerNight: 250,
    rating: 4.9,
    numberOfReviews: 85,
    imageUrl:
      "https://via.placeholder.com/400x300/3366FF/FFFFFF?text=Beach+Bungalow",
  },
  {
    id: "stay-003",
    lat: 33.7489, // Latitude for Atlanta, GA
    lng: -84.388, // Longitude for Atlanta, GA
    name: "Cozy Atlanta Studio",
    pricePerNight: 95,
    rating: 4.2,
    numberOfReviews: 210,
    imageUrl:
      "https://via.placeholder.com/400x300/33CCFF/FFFFFF?text=Atlanta+Studio",
  },
  {
    id: "stay-004",
    lat: 40.7128, // Latitude for New York, NY
    lng: -74.006, // Longitude for New York, NY
    name: "NYC Midtown Apartment",
    pricePerNight: 300,
    rating: 4.6,
    numberOfReviews: 300,
    imageUrl:
      "https://via.placeholder.com/400x300/FF33CC/FFFFFF?text=NYC+Midtown",
  },
  {
    id: "stay-005",
    lat: 40.7306, // Latitude for Greenwich Village, NY (near NYC)
    lng: -73.9975, // Longitude for Greenwich Village, NY
    name: "Charming Village Brownstone",
    pricePerNight: 280,
    rating: 4.8,
    numberOfReviews: 150,
    imageUrl:
      "https://via.placeholder.com/400x300/CC33FF/FFFFFF?text=Brownstone",
  },
  {
    id: "stay-006",
    lat: 25.7617, // Latitude for Miami, FL
    lng: -80.1918, // Longitude for Miami, FL
    name: "Miami Beach Condo",
    pricePerNight: 220,
    rating: 4.5,
    numberOfReviews: 180,
    imageUrl:
      "https://via.placeholder.com/400x300/33FF57/FFFFFF?text=Miami+Beach",
  },
  {
    id: "stay-007",
    lat: 41.8781, // Latitude for Chicago, IL
    lng: -87.6298, // Longitude for Chicago, IL
    name: "Chicago Downtown Loft",
    pricePerNight: 190,
    rating: 4.9,
    numberOfReviews: 90,
    imageUrl:
      "https://via.placeholder.com/400x300/FFCC33/FFFFFF?text=Chicago+Loft",
  },
  {
    id: "stay-008",
    lat: 29.7604, // Latitude for Houston, TX
    lng: -95.3698, // Longitude for Houston, TX
    name: "Houston Medical Center Apartment",
    pricePerNight: 160,
    rating: 4.6,
    numberOfReviews: 250,
    imageUrl:
      "https://via.placeholder.com/400x300/33FFFF/FFFFFF?text=Houston+Medical",
  },
  {
    id: "stay-009",
    lat: 39.7392, // Latitude for Denver, CO
    lng: -104.9903, // Longitude for Denver, CO
    name: "Denver Mountain View Unit",
    pricePerNight: 270,
    rating: 4.7,
    numberOfReviews: 110,
    imageUrl:
      "https://via.placeholder.com/400x300/8A2BE2/FFFFFF?text=Denver+Mountain",
  },
  {
    id: "stay-010",
    lat: 36.1699, // Latitude for Las Vegas, NV
    lng: -115.1398, // Longitude for Las Vegas, NV
    name: "Las Vegas Strip Condo",
    pricePerNight: 80,
    rating: 4.1,
    numberOfReviews: 60,
    imageUrl:
      "https://via.placeholder.com/400x300/FFD700/FFFFFF?text=Vegas+Strip",
  },
  // Additional stays in NYC area for clustering
  {
    id: "stay-011",
    lat: 40.7589, // Times Square area
    lng: -73.9851,
    name: "Times Square Studio",
    pricePerNight: 320,
    rating: 4.4,
    numberOfReviews: 180,
    imageUrl:
      "https://via.placeholder.com/400x300/FF5733/FFFFFF?text=Times+Square",
  },
  {
    id: "stay-012",
    lat: 40.7505, // Herald Square area
    lng: -73.9934,
    name: "Herald Square Loft",
    pricePerNight: 290,
    rating: 4.6,
    numberOfReviews: 95,
    imageUrl:
      "https://via.placeholder.com/400x300/3366FF/FFFFFF?text=Herald+Square",
  },
  {
    id: "stay-013",
    lat: 40.7484, // Empire State area
    lng: -73.9857,
    name: "Empire State View",
    pricePerNight: 350,
    rating: 4.8,
    numberOfReviews: 220,
    imageUrl:
      "https://via.placeholder.com/400x300/33CCFF/FFFFFF?text=Empire+State",
  },
  {
    id: "stay-014",
    lat: 40.7527, // Grand Central area
    lng: -73.9772,
    name: "Grand Central Apartment",
    pricePerNight: 280,
    rating: 4.5,
    numberOfReviews: 150,
    imageUrl:
      "https://via.placeholder.com/400x300/FF33CC/FFFFFF?text=Grand+Central",
  },
  {
    id: "stay-015",
    lat: 40.7569, // Bryant Park area
    lng: -73.9845,
    name: "Bryant Park Penthouse",
    pricePerNight: 450,
    rating: 4.9,
    numberOfReviews: 75,
    imageUrl:
      "https://via.placeholder.com/400x300/CC33FF/FFFFFF?text=Bryant+Park",
  },
  {
    id: "stay-016",
    lat: 40.7549, // 5th Avenue area
    lng: -73.984,
    name: "5th Avenue Luxury Suite",
    pricePerNight: 520,
    rating: 4.7,
    numberOfReviews: 120,
    imageUrl:
      "https://via.placeholder.com/400x300/33FF57/FFFFFF?text=5th+Avenue",
  },
  // Additional stays in LA area for clustering
  {
    id: "stay-017",
    lat: 34.0522, // Downtown LA
    lng: -118.2437,
    name: "LA Downtown Loft",
    pricePerNight: 200,
    rating: 4.3,
    numberOfReviews: 120,
    imageUrl:
      "https://via.placeholder.com/400x300/FFCC33/FFFFFF?text=LA+Downtown",
  },
  {
    id: "stay-018",
    lat: 34.0525, // Downtown LA (slightly different for clustering)
    lng: -118.244,
    name: "LA Arts District",
    pricePerNight: 180,
    rating: 4.7,
    numberOfReviews: 85,
    imageUrl: "https://via.placeholder.com/400x300/8A2BE2/FFFFFF?text=LA+Arts",
  },
  {
    id: "stay-019",
    lat: 34.0736, // West Hollywood area
    lng: -118.4004,
    name: "West Hollywood Villa",
    pricePerNight: 380,
    rating: 4.8,
    numberOfReviews: 95,
    imageUrl:
      "https://via.placeholder.com/400x300/FFD700/FFFFFF?text=West+Hollywood",
  },
  {
    id: "stay-020",
    lat: 34.0739, // West Hollywood (slightly different for clustering)
    lng: -118.4007,
    name: "Hollywood Hills Retreat",
    pricePerNight: 420,
    rating: 4.6,
    numberOfReviews: 110,
    imageUrl:
      "https://via.placeholder.com/400x300/FF5733/FFFFFF?text=Hollywood+Hills",
  },
  // Additional stays in Miami area for clustering
  {
    id: "stay-021",
    lat: 25.7617, // Central Miami
    lng: -80.1918,
    name: "South Beach Studio",
    pricePerNight: 280,
    rating: 4.5,
    numberOfReviews: 160,
    imageUrl:
      "https://via.placeholder.com/400x300/3366FF/FFFFFF?text=South+Beach",
  },
  {
    id: "stay-022",
    lat: 25.762, // Central Miami (slightly different for clustering)
    lng: -80.1921,
    name: "Brickell Financial District",
    pricePerNight: 320,
    rating: 4.7,
    numberOfReviews: 140,
    imageUrl:
      "https://via.placeholder.com/400x300/33CCFF/FFFFFF?text=Brickell+Financial",
  },
  {
    id: "stay-023",
    lat: 25.7614, // Central Miami (slightly different for clustering)
    lng: -80.1915,
    name: "Wynwood Arts District",
    pricePerNight: 180,
    rating: 4.9,
    numberOfReviews: 85,
    imageUrl:
      "https://via.placeholder.com/400x300/FF33CC/FFFFFF?text=Wynwood+Arts",
  },
  // Additional stays in Chicago area for clustering
  {
    id: "stay-024",
    lat: 41.8781, // Central Chicago
    lng: -87.6298,
    name: "Loop Business District",
    pricePerNight: 240,
    rating: 4.6,
    numberOfReviews: 95,
    imageUrl:
      "https://via.placeholder.com/400x300/CC33FF/FFFFFF?text=Loop+Business",
  },
  {
    id: "stay-025",
    lat: 41.8784, // Central Chicago (slightly different for clustering)
    lng: -87.6301,
    name: "Magnificent Mile View",
    pricePerNight: 390,
    rating: 4.8,
    numberOfReviews: 120,
    imageUrl:
      "https://via.placeholder.com/400x300/33FF57/FFFFFF?text=Magnificent+Mile",
  },
  // Additional stays in Houston area for clustering
  {
    id: "stay-026",
    lat: 29.7604, // Central Houston
    lng: -95.3698,
    name: "Galleria Area Apartment",
    pricePerNight: 220,
    rating: 4.5,
    numberOfReviews: 180,
    imageUrl:
      "https://via.placeholder.com/400x300/FFCC33/FFFFFF?text=Galleria+Area",
  },
  {
    id: "stay-027",
    lat: 29.7607, // Central Houston (slightly different for clustering)
    lng: -95.3701,
    name: "Museum District Loft",
    pricePerNight: 190,
    rating: 4.4,
    numberOfReviews: 95,
    imageUrl:
      "https://via.placeholder.com/400x300/8A2BE2/FFFFFF?text=Museum+District",
  },
  // Additional stays in Denver area for clustering
  {
    id: "stay-028",
    lat: 39.7392, // Central Denver
    lng: -104.9903,
    name: "LoDo Historic District",
    pricePerNight: 340,
    rating: 4.8,
    numberOfReviews: 130,
    imageUrl:
      "https://via.placeholder.com/400x300/FFD700/FFFFFF?text=LoDo+Historic",
  },
  {
    id: "stay-029",
    lat: 39.7395, // Central Denver (slightly different for clustering)
    lng: -104.9906,
    name: "Cherry Creek Luxury",
    pricePerNight: 480,
    rating: 4.9,
    numberOfReviews: 75,
    imageUrl:
      "https://via.placeholder.com/400x300/FF5733/FFFFFF?text=Cherry+Creek+Luxury",
  },
  // Additional stays in Atlanta area for clustering
  {
    id: "stay-030",
    lat: 33.7489, // Central Atlanta
    lng: -84.388,
    name: "Buckhead Luxury Condo",
    pricePerNight: 180,
    rating: 4.6,
    numberOfReviews: 95,
    imageUrl:
      "https://via.placeholder.com/400x300/3366FF/FFFFFF?text=Buckhead+Luxury",
  },
  {
    id: "stay-031",
    lat: 33.7492, // Central Atlanta (slightly different for clustering)
    lng: -84.3883,
    name: "Midtown Atlanta Loft",
    pricePerNight: 160,
    rating: 4.4,
    numberOfReviews: 120,
    imageUrl:
      "https://via.placeholder.com/400x300/33CCFF/FFFFFF?text=Midtown+Atlanta",
  },
  {
    id: "stay-032",
    lat: 33.7489, // Central Atlanta (slightly different for clustering)
    lng: -84.388,
    name: "Downtown Atlanta Studio",
    pricePerNight: 140,
    rating: 4.3,
    numberOfReviews: 85,
    imageUrl:
      "https://via.placeholder.com/400x300/FF33CC/FFFFFF?text=Downtown+Atlanta",
  },
];
