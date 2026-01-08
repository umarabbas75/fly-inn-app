"use client";

import { useCallback, useMemo, useState } from "react";
import {
  GoogleMap,
  InfoWindow,
  Marker,
  MarkerClusterer,
} from "@react-google-maps/api";
import Loading from "@/src/components/Loading";
import { MAP_THEME, stays } from "@/constants/google-map";
import { useGoogleMaps } from "@/providers/GoogleMapsProvider";

// Default center of the map
const center = { lat: 39.8283, lng: -98.5795 };

export default function GoogleMapComponent({
  height,
  mapClasses,
}: {
  height: string;
  mapClasses?: any;
}) {
  const { isLoaded, loadError, googleMaps } = useGoogleMaps();
  const [selectedStay, setSelectedStay] = useState<any>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);

  // Map options
  const mapOptions = useMemo(
    () => ({
      disableDefaultUI: true,
      gestureHandling: "cooperative",
      zoomControl: false,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
      scrollwheel: true,
      keyboardShortcuts: false,
      styles: MAP_THEME,
    }),
    []
  );

  // Cluster options
  const clusterOptions = useMemo(
    () => ({
      gridSize: 50,
      minimumClusterSize: 2,
      maxZoom: 15,
      styles: [
        {
          url: "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m1.png",
          height: 50,
          width: 50,
          textColor: "#ffffff",
          textSize: 12,
          anchor: [25, 0],
        },
        {
          url: "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m2.png",
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

  // Custom marker icon
  const markerIcon = useMemo(() => {
    return {
      url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="16" cy="16" r="16" fill="#af2322" opacity="0.9"/>
          <text x="16" y="22" text-anchor="middle" fill="white" font-size="12" font-weight="bold">$$</text>
        </svg>
      `)}`,
      scaledSize: new google.maps.Size(32, 32),
      anchor: new google.maps.Point(16, 16),
    };
  }, []);

  // Fit map bounds to show all markers
  const onMapLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
    const bounds = new google.maps.LatLngBounds();
    stays.forEach((stay) => bounds.extend({ lat: stay.lat, lng: stay.lng }));
    map.fitBounds(bounds);
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

  return (
    <div className={`w-full ${height} h-[500px] relative bg-gray-50`}>
      <GoogleMap
        zoom={3}
        center={center}
        mapContainerClassName={`w-full h-full cursor-grab active:cursor-grabbing ${mapClasses}`}
        options={mapOptions}
        onLoad={onMapLoad}
      >
        <MarkerClusterer options={clusterOptions}>
          {(clusterer) => (
            <>
              {stays.map((stay) => (
                <Marker
                  key={stay.id}
                  position={{ lat: stay.lat, lng: stay.lng }}
                  title={stay.name}
                  onClick={() => setSelectedStay({ ...stay })}
                  icon={markerIcon}
                  clusterer={clusterer}
                />
              ))}
            </>
          )}
        </MarkerClusterer>

        {/* InfoWindow for selected marker */}
        {selectedStay && (
          <InfoWindow
            position={{
              lat: selectedStay.lat,
              lng: selectedStay.lng,
            }}
            options={{
              pixelOffset: new google.maps.Size(0, -30),
            }}
            onCloseClick={() => setSelectedStay(null)}
          >
            <div className="relative w-80 overflow-hidden bg-white rounded-xl shadow-xl border border-gray-100 h-[270px]">
              {/* Header with image */}
              <div className="relative w-full h-40 overflow-hidden">
                <img
                  src="https://s3.amazonaws.com/flyinn-app-bucket/business_images/1751304310_ivan-stern-LOLSbkU-unsplash.jpg"
                  alt="Business"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-80"></div>
                <div className="absolute bottom-0 left-0 right-0 p-4 flex items-end">
                  {selectedStay?.business_logo ? (
                    <img
                      src={`https://s3.amazonaws.com/flyinn-app-bucket/${selectedStay.business_logo}`}
                      alt="Logo"
                      className="w-12 h-12 rounded-full border-2 border-white shadow-lg object-cover mr-2"
                    />
                  ) : (
                    <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-100 text-gray-400 border-2 border-dashed border-white shadow-inner mr-2">
                      <i className="fas fa-store text-xl" />
                    </div>
                  )}
                  <h3 className="text-xl font-bold text-white">
                    {selectedStay.name}
                  </h3>
                </div>
              </div>

              {/* Content */}
              <div className="p-2">
                <div className="flex items-start mb-2">
                  <i className="fas fa-map-marker-alt text-blue-500 mt-1 mr-2"></i>
                  <p className="text-gray-700 font-medium text-sm !mb-0 !p-0">
                    {selectedStay.address}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-2">
                  <div className="bg-gray-50 p-2 rounded">
                    <p className="text-[11px] text-gray-500 m-0 p-0">
                      Distance to Runway
                    </p>
                    <p className="text-sm font-medium m-0 p-0">
                      {selectedStay.distance_from_runway} miles
                    </p>
                  </div>
                  <div className="bg-gray-50 p-2 rounded">
                    <p className="text-[11px] text-gray-500 m-0 p-0">Airport</p>
                    <p className="text-sm font-medium m-0 p-0">
                      {selectedStay.airport}
                    </p>
                  </div>
                </div>

                <a
                  href={`/stays/${selectedStay.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className=" w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white text-center py-2 px-4 rounded-lg font-medium transition-all duration-300 shadow-md"
                >
                  <i className="fas fa-external-link-alt text-white mr-2"></i>
                  View Stays Details
                </a>
              </div>

              {/* Close Button */}
              <button
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-lg hover:bg-gray-100 transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  setSelectedStay(null);
                }}
              >
                <i className="fas fa-times text-gray-600"></i>
              </button>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
}
