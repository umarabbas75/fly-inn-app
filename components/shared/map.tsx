"use client";

import { useCallback, useMemo, useState, useRef, useEffect } from "react";
import {
  GoogleMap,
  InfoWindow,
  Marker,
  MarkerClusterer,
} from "@react-google-maps/api";
import Loading from "@/src/components/Loading";
import { MAP_THEME } from "@/constants/google-map";
import { useGoogleMaps } from "@/providers/GoogleMapsProvider";
import {
  FaTimes,
  FaPlaneDeparture,
  FaMapMarkerAlt,
  FaUsers,
  FaBed,
  FaBath,
  FaBolt,
  FaEye,
  FaArrowRight,
  FaChevronLeft,
  FaChevronRight,
  FaGlobe,
} from "react-icons/fa";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { getBusinessSubTypeLabel } from "@/constants/business";
import { useIsMobile } from "@/hooks/use-mobile";

// Default center of the map - USA geographic center
const center = { lat: 39.8283, lng: -98.5795 };

// Create circular marker icon for businesses
const createBusinessMarkerIcon = (googleMaps: any) => {
  const size = 20; // Circular icon size

  const svg = `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
      <!-- White circular background -->
      <circle
        cx="${size / 2}"
        cy="${size / 2}"
        r="${size / 2}"
        fill="#FFFFFF"
      />

      <!-- Business icon dot (larger) -->
      <circle
        cx="${size / 2}"
        cy="${size / 2}"
        r="7"
        fill="#AF2322"
      />
    </svg>
  `;

  return {
    url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`,
    scaledSize: new googleMaps.Size(size, size),
    anchor: new googleMaps.Point(size / 2, size / 2),
  };
};

// Create white pill-shaped marker icon with price
const createPriceMarkerIcon = (price: number, googleMaps: any) => {
  const priceText = `$${price}`;

  // Approx character width in px for this font-size
  const charWidth = 7;

  // Horizontal padding (left + right)
  const horizontalPadding = 16;

  // Calculate natural width from text
  const naturalWidth = priceText.length * charWidth + horizontalPadding;

  // Clamp width: look good for $9 up to $123
  const minWidth = 34; // for $9
  const maxWidth = 56; // for $123 (or slightly longer)
  const width = Math.max(minWidth, Math.min(maxWidth, naturalWidth));

  const height = 28;

  const svg = `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <!-- Soft shadow -->
        <filter id="markerShadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#000000" flood-opacity="0.16" />
        </filter>
      </defs>

      <!-- White pill with shadow, no border -->
      <rect
        x="0"
        y="0"
        rx="${height / 2}"
        ry="${height / 2}"
        width="${width}"
        height="${height}"
        fill="#FFFFFF"
        filter="url(#markerShadow)"
      />

      <!-- Price text -->
      <text
        x="${width / 2}"
        y="${height / 2 + 4}"
            text-anchor="middle" 
        fill="#111827"
            font-size="12" 
            font-weight="600" 
        font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
      >
        ${priceText}
      </text>
    </svg>
  `;

  return {
    url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`,
    scaledSize: new googleMaps.Size(width, height),
    anchor: new googleMaps.Point(width / 2, height / 2),
  };
};

type FilterType = "stays" | "business";

export default function GoogleMapComponent({
  height,
  mapClasses,
  filter = "stays",
  stays = [],
  businesses = [],
}: {
  height: string;
  mapClasses?: any;
  filter?: FilterType;
  stays?: any[];
  businesses?: any[];
}) {
  const { isLoaded, loadError, googleMaps } = useGoogleMaps();
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [map, setMap] = useState<any>(null);
  const swiperRef = useRef<any>(null);
  const isMobile = useIsMobile();

  console.log({
    filter,
    staysCount: stays.length,
    businessesCount: businesses.length,
    businesses: businesses.map((b: any) => ({
      id: b.business_id,
      name: b.name,
      lat: b.latitude,
      lng: b.longitude,
      hasCoords: !!(b.latitude && b.longitude),
    })),
  });

  // Map options - Enable all controls for pilots
  const mapOptions = useMemo(
    () => ({
      disableDefaultUI: false, // Enable default UI
      gestureHandling: "cooperative",
      // Zoom controls (+ and -)
      zoomControl: true,
      zoomControlOptions: {
        position: googleMaps?.ControlPosition?.RIGHT_CENTER,
      },
      // Map type control (Map / Terrain / Satellite)
      mapTypeControl: true,
      mapTypeControlOptions: {
        style: googleMaps?.MapTypeControlStyle?.HORIZONTAL_BAR,
        position: googleMaps?.ControlPosition?.TOP_RIGHT,
        mapTypeIds: ["roadmap", "satellite", "terrain", "hybrid"],
      },
      // Street view (walking man with directional arrows)
      streetViewControl: true,
      streetViewControlOptions: {
        position: googleMaps?.ControlPosition?.RIGHT_CENTER,
      },
      // Fullscreen toggle
      fullscreenControl: true,
      fullscreenControlOptions: {
        position: googleMaps?.ControlPosition?.TOP_RIGHT,
      },
      // Other options
      scrollwheel: true,
      keyboardShortcuts: true, // Enable keyboard navigation for accessibility
      scaleControl: true, // Show scale bar
      rotateControl: true, // Allow rotation on supported devices
      styles: MAP_THEME,
    }),
    [googleMaps]
  );

  // Cluster options
  const clusterOptions = useMemo(
    () => ({
      gridSize: 50,
      minimumClusterSize: 2,
      maxZoom: 15,
      styles: [
        {
          url: "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m3.png",
          height: 50,
          width: 50,
          textColor: "#ffffff",
          textSize: 12,
          anchor: [25, 0],
        },
        {
          url: "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m3.png",
          height: 56,
          width: 56,
          textColor: "#ffffff",
          textSize: 14,
          anchor: [28, 0],
        },
        {
          url: "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m3.png",
          height: 66,
          width: 66,
          textColor: "#ffffff",
          textSize: 16,
          anchor: [33, 0],
        },
      ],
    }),
    []
  );

  // Function to get marker icon for a specific stay or business
  const getMarkerIcon = useCallback(
    (item: any) => {
      if (!isLoaded || !googleMaps) return undefined;
      if (filter === "stays") {
        const price = item.nightly_price || item.price || 0;
        return createPriceMarkerIcon(price, googleMaps);
      }
      // For businesses, use the same white pill style marker
      if (filter === "business") {
        return createBusinessMarkerIcon(googleMaps);
      }
      return undefined;
    },
    [isLoaded, googleMaps, filter]
  );

  // Fit map bounds to show all markers, or default to USA center
  const onMapLoad = useCallback(
    (map: any) => {
      if (!googleMaps) return;

      setMap(map);

      map.setCenter(center);
      map.setZoom(isMobile ? 3 : 4);
    },
    [googleMaps, stays, businesses, isMobile]
  );

  // Handle map click to close InfoWindow
  const handleMapClick = useCallback(() => {
    setSelectedItem(null);
  }, []);

  if (loadError)
    return (
      <div
        className={`w-full ${height} flex items-center justify-center text-red-600`}
      >
        Error loading maps
      </div>
    );

  if (!isLoaded)
    return (
      <div className={`w-full ${height} flex items-center justify-center`}>
        <Loading size="medium" />
      </div>
    );
  console.log({ selectedItem, filter });
  return (
    <div className={`w-full ${height} h-[500px] relative bg-gray-50`}>
      <GoogleMap
        zoom={4}
        center={center}
        mapContainerClassName={`w-full h-full cursor-grab active:cursor-grabbing ${mapClasses}`}
        options={mapOptions}
        onLoad={onMapLoad}
        onClick={handleMapClick}
      >
        <MarkerClusterer options={clusterOptions}>
          {(clusterer) => (
            <>
              {filter === "stays" &&
                stays.map((stay) => {
                  if (!stay.fake_latitude || !stay.fake_longitude) return null;
                  return (
                    <Marker
                      key={stay.id}
                      position={{
                        lat: parseFloat(stay.fake_latitude),
                        lng: parseFloat(stay.fake_longitude),
                      }}
                      title={stay.title || stay.name}
                      onClick={() =>
                        setSelectedItem({ ...stay, itemType: "stay" })
                      }
                      icon={getMarkerIcon(stay)}
                      clusterer={clusterer}
                    />
                  );
                })}

              {filter === "business" &&
                businesses.map((business, index) => {
                  // Skip businesses without coordinates
                  const lat = business.latitude;
                  const lng = business.longitude;

                  if (
                    !lat ||
                    !lng ||
                    lat === null ||
                    lng === null ||
                    lat === "" ||
                    lng === ""
                  ) {
                    console.warn(
                      `Business ${business.business_id} (${business.name}) missing coordinates`,
                      { latitude: lat, longitude: lng }
                    );
                    return null;
                  }

                  const latNum =
                    typeof lat === "string" ? parseFloat(lat) : lat;
                  const lngNum =
                    typeof lng === "string" ? parseFloat(lng) : lng;

                  if (isNaN(latNum) || isNaN(lngNum)) {
                    console.warn(
                      `Business ${business.business_id} (${business.name}) has invalid coordinates`,
                      { latitude: lat, longitude: lng }
                    );
                    return null;
                  }

                  // Add small offset for overlapping markers (spread them in a circle pattern)
                  // Offset in degrees (approximately 0.0001 degrees ≈ 11 meters)
                  const offsetRadius = 0.00015; // ~16 meters
                  const angle = (index * (2 * Math.PI)) / businesses.length;
                  const offsetLat = latNum + offsetRadius * Math.cos(angle);
                  const offsetLng = lngNum + offsetRadius * Math.sin(angle);

                  return (
                    <Marker
                      key={business.business_id}
                      position={{
                        lat: offsetLat,
                        lng: offsetLng,
                      }}
                      title={business.name}
                      onClick={() =>
                        setSelectedItem({ ...business, itemType: "business" })
                      }
                      icon={getMarkerIcon(business)}
                      clusterer={clusterer}
                    />
                  );
                })}
            </>
          )}
        </MarkerClusterer>

        {/* InfoWindow for selected marker */}
        {selectedItem && (
          <InfoWindow
            position={{
              lat:
                selectedItem.itemType === "stay"
                  ? parseFloat(selectedItem.fake_latitude)
                  : selectedItem.latitude
                  ? typeof selectedItem.latitude === "string"
                    ? parseFloat(selectedItem.latitude)
                    : selectedItem.latitude
                  : 0,
              lng:
                selectedItem.itemType === "stay"
                  ? parseFloat(selectedItem.fake_longitude)
                  : selectedItem.longitude
                  ? typeof selectedItem.longitude === "string"
                    ? parseFloat(selectedItem.longitude)
                    : selectedItem.longitude
                  : 0,
            }}
            options={{
              pixelOffset: googleMaps ? new googleMaps.Size(0, -40) : undefined,
            }}
            onCloseClick={() => setSelectedItem(null)}
          >
            <div className="relative w-[280px] bg-white rounded-xl shadow-xl overflow-hidden">
              {/* Close Button */}
              <button
                className="absolute top-2 right-2 z-20 w-7 h-7 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-md hover:bg-white transition-all border-none"
                onClick={(e) => {
                  e.preventDefault();
                  setSelectedItem(null);
                }}
              >
                <FaTimes className="text-gray-600 text-xs" />
              </button>

              {selectedItem.itemType === "stay" ? (
                <>
                  {/* Image Carousel Header */}
                  <div className="relative w-full h-32 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                    {selectedItem?.images && selectedItem.images.length > 0 ? (
                      <div className="relative w-full h-full">
                        <Swiper
                          ref={swiperRef}
                          modules={[Navigation, Pagination]}
                          spaceBetween={0}
                          slidesPerView={1}
                          navigation={true}
                          pagination={{
                            clickable: true,
                            dynamicBullets: false,
                          }}
                          className="w-full h-full map-swiper"
                        >
                          {selectedItem.images.map(
                            (image: any, index: number) => (
                              <SwiperSlide key={image.id || index}>
                                <div className="relative w-full h-full">
                                  <Image
                                    src={image.url || "/placeholder.jpg"}
                                    alt={
                                      image.description ||
                                      `${
                                        selectedItem.title || "Stay"
                                      } - Image ${index + 1}`
                                    }
                                    fill
                                    className="object-cover"
                                    sizes="280px"
                                    unoptimized={image.url?.startsWith("http")}
                                  />
                                </div>
                              </SwiperSlide>
                            )
                          )}
                        </Swiper>
                      </div>
                    ) : (
                      <div className="relative w-full h-full">
                        <Image
                          src="/placeholder.jpg"
                          alt={selectedItem.title || "Stay"}
                          fill
                          className="object-cover"
                          sizes="280px"
                        />
                      </div>
                    )}

                    <div className="absolute inset-0 bg-black/20 pointer-events-none"></div>

                    {/* Price Badge - Top Left */}
                    {selectedItem.nightly_price && (
                      <div className="absolute top-2 left-2 px-2 py-1 bg-white/95 backdrop-blur-sm rounded-lg shadow z-10">
                        <span className="text-[#AF2322] font-bold text-sm">
                          ${selectedItem.nightly_price}
                        </span>
                        <span className="text-gray-600 text-xs">/nt</span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-2.5" style={{ paddingBottom: "14px" }}>
                    {/* Title */}
                    <h3 className="text-sm font-bold text-gray-900 mb-1.5 line-clamp-1">
                      {selectedItem.title || selectedItem.name}
                    </h3>

                    {/* Airport - MOST IMPORTANT for pilots */}
                    {selectedItem.airports?.[0] && (
                      <div className="border-2 border-[#AF2322] bg-[#AF2322]/5 rounded-lg p-2 mb-1.5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="bg-[#AF2322] rounded-full p-1.5 flex items-center justify-center">
                              <FaPlaneDeparture className="text-white text-xs" />
                            </div>
                            <div className="flex flex-col">
                              <span className="font-bold text-sm text-gray-900 line-clamp-1">
                                {selectedItem.airports[0].identifier}
                              </span>
                              <span className="text-xs text-gray-500">
                                Nearest Airport
                              </span>
                            </div>
                          </div>
                          <div className="flex flex-col items-end">
                            <span className="text-xs font-semibold text-[#AF2322] bg-[#AF2322]/10 px-2 py-1 rounded-full">
                              {selectedItem.airports[0].distance_from_runway} mi
                            </span>
                            <span className="text-[10px] text-gray-500 mt-0.5">
                              from airport
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Location */}
                    <div className="flex items-center gap-1.5 mb-1.5 text-xs text-gray-600">
                      <FaMapMarkerAlt className="text-gray-400" />
                      <span className="line-clamp-1">
                        {selectedItem.city && selectedItem.state
                          ? `${selectedItem.city}, ${selectedItem.state}`
                          : selectedItem.address}
                      </span>
                    </div>

                    {/* Quick Stats - Pilot Essentials */}
                    <div className="flex items-center gap-3 mb-2 text-xs text-gray-600">
                      <span className="flex items-center gap-1">
                        <FaUsers className="text-gray-400" />
                        {selectedItem.no_of_guest}
                      </span>
                      <span className="flex items-center gap-1">
                        <FaBed className="text-gray-400" />
                        {selectedItem.no_of_bedrooms}
                      </span>
                      <span className="flex items-center gap-1">
                        <FaBath className="text-gray-400" />
                        {parseFloat(selectedItem.no_of_bathrooms || 0).toFixed(
                          0
                        )}
                      </span>
                      {selectedItem.instant_booking && (
                        <span className="flex items-center gap-1 text-green-600">
                          <FaBolt />
                          Instant
                        </span>
                      )}
                    </div>

                    {/* Action Button - Compact */}
                    <a
                      href={`/public/stays/${selectedItem.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full bg-gradient-to-r from-[#AF2322] to-[#8A1C1C] hover:from-[#9e1f1a] hover:to-[#7A1715] text-white text-center py-2 px-3 rounded-lg font-semibold text-sm transition-all duration-200 shadow-md hover:shadow-lg mb-1.5"
                    >
                      <span className="flex items-center justify-center gap-2">
                        <FaEye className="text-xs" />
                        View Details
                        <FaArrowRight className="text-xs" />
                      </span>
                    </a>
                  </div>
                </>
              ) : (
                <>
                  {/* Business InfoWindow */}
                  <div className="relative w-full h-32 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                    {selectedItem?.images && selectedItem.images.length > 0 ? (
                      <div className="relative w-full h-full">
                        <Image
                          src={selectedItem.images[0].url || "/placeholder.jpg"}
                          alt={selectedItem.name}
                          fill
                          className="object-cover"
                          sizes="280px"
                          unoptimized={selectedItem.images[0].url?.startsWith(
                            "http"
                          )}
                        />
                      </div>
                    ) : (
                      <div className="relative w-full h-full">
                        <Image
                          src="/placeholder.jpg"
                          alt={selectedItem.name}
                          fill
                          className="object-cover"
                          sizes="280px"
                        />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/20 pointer-events-none"></div>

                    {/* Business Logo - Left Side */}
                    {selectedItem.business_logo && (
                      <div className="absolute left-2 bottom-2 z-10">
                        <div className="w-12 h-12 bg-white rounded-lg shadow-lg p-1.5 flex items-center justify-center">
                          <Image
                            src={selectedItem.business_logo}
                            alt={`${selectedItem.name} logo`}
                            width={40}
                            height={40}
                            className="object-contain rounded"
                            unoptimized={selectedItem.business_logo?.startsWith(
                              "http"
                            )}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-2.5" style={{ paddingBottom: "14px" }}>
                    {/* Title */}
                    <h3 className="text-sm font-bold text-gray-900 mb-1.5 line-clamp-1">
                      {selectedItem.name}
                    </h3>

                    {/* Business Type */}
                    {selectedItem.type && (
                      <div className="mb-1.5">
                        <span className="text-xs text-[#AF2322] bg-[#AF2322]/10 px-2 py-1 rounded-full font-medium">
                          {getBusinessSubTypeLabel(selectedItem.type)}
                        </span>
                      </div>
                    )}

                    {/* Airport */}
                    {selectedItem.airport && (
                      <div className="border-2 border-[#AF2322] bg-[#AF2322]/5 rounded-lg p-2 mb-1.5">
                        <div className="flex items-center gap-2">
                          <div className="bg-[#AF2322] rounded-full p-1.5 flex items-center justify-center">
                            <FaPlaneDeparture className="text-white text-xs" />
                          </div>
                          <div className="flex flex-col">
                            <span className="font-bold text-sm text-gray-900">
                              {selectedItem.airport}
                            </span>
                            {selectedItem.distance_from_runway && (
                              <span className="text-xs text-gray-500">
                                {selectedItem.distance_from_runway} from runway
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Location */}
                    <div className="flex items-center gap-1.5 mb-1.5 text-xs text-gray-600">
                      <FaMapMarkerAlt className="text-gray-400" />
                      <span className="line-clamp-1">
                        {selectedItem.city && selectedItem.state
                          ? `${selectedItem.city}, ${selectedItem.state}`
                          : selectedItem.address || "Location not available"}
                      </span>
                    </div>

                    {/* Action Button */}
                    <a
                      href={`/public/business/${selectedItem.type}/${selectedItem.business_id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full bg-gradient-to-r from-[#AF2322] to-[#8A1C1C] hover:from-[#9e1f1a] hover:to-[#7A1715] text-white text-center py-2 px-3 rounded-lg font-semibold text-sm transition-all duration-200 shadow-md hover:shadow-lg mb-1.5"
                    >
                      <span className="flex items-center justify-center gap-2">
                        <FaEye className="text-xs" />
                        View Details
                        <FaArrowRight className="text-xs" />
                      </span>
                    </a>
                  </div>
                </>
              )}
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
}
