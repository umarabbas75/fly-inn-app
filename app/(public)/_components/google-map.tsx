"use client";

import { useCallback, useMemo, useState, useEffect } from "react";
import { GoogleMap, InfoWindow, Marker } from "@react-google-maps/api";
import Loading from "@/src/components/Loading";
import { MAP_THEME, stays } from "@/constants/google-map";
import { useGoogleMaps } from "@/providers/GoogleMapsProvider";

const center = { lat: 39.8283, lng: -98.5795 }; // Center of USA

export default function GoogleMapComponent({
  height,
  mapClasses,
}: {
  height: string;
  mapClasses?: any;
}) {
  const { isLoaded, loadError, googleMaps } = useGoogleMaps();
  const [selectedStay, setSelectedStay] = useState<any>(null);
  const [clusterer, setClusterer] = useState<any>(null);
  const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null);

  // Add some test stays in closer proximity to demonstrate clustering
  const testStays = useMemo(
    () => [
      // Original stays
      ...stays,
      // Additional test stays in NYC area for clustering demo
      {
        id: "test-001",
        lat: 40.7589,
        lng: -73.9851,
        name: "Times Square Studio",
        pricePerNight: 320,
        rating: 4.4,
        numberOfReviews: 180,
        imageUrl:
          "https://via.placeholder.com/400x300/FF5733/FFFFFF?text=Times+Square",
      },
      {
        id: "test-002",
        lat: 40.7505,
        lng: -73.9934,
        name: "Herald Square Loft",
        pricePerNight: 290,
        rating: 4.6,
        numberOfReviews: 95,
        imageUrl:
          "https://via.placeholder.com/400x300/3366FF/FFFFFF?text=Herald+Square",
      },
      {
        id: "test-003",
        lat: 40.7484,
        lng: -73.9857,
        name: "Empire State View",
        pricePerNight: 350,
        rating: 4.8,
        numberOfReviews: 220,
        imageUrl:
          "https://via.placeholder.com/400x300/33CCFF/FFFFFF?text=Empire+State",
      },
      {
        id: "test-004",
        lat: 40.7527,
        lng: -73.9772,
        name: "Grand Central Apartment",
        pricePerNight: 280,
        rating: 4.5,
        numberOfReviews: 150,
        imageUrl:
          "https://via.placeholder.com/400x300/FF33CC/FFFFFF?text=Grand+Central",
      },
      // LA area test stays
      {
        id: "test-005",
        lat: 34.0522,
        lng: -118.2437,
        name: "LA Downtown Loft",
        pricePerNight: 200,
        rating: 4.3,
        numberOfReviews: 120,
        imageUrl:
          "https://via.placeholder.com/400x300/CC33FF/FFFFFF?text=LA+Downtown",
      },
      {
        id: "test-006",
        lat: 34.0522,
        lng: -118.2437,
        name: "LA Arts District",
        pricePerNight: 180,
        rating: 4.7,
        numberOfReviews: 85,
        imageUrl:
          "https://via.placeholder.com/400x300/33FF57/FFFFFF?text=LA+Arts",
      },
    ],
    []
  );

  // Basic map options
  const mapOptions = useMemo(
    () => ({
      disableDefaultUI: false,
      gestureHandling: "cooperative",
      zoomControl: true,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: true,
      scrollwheel: true,
      styles: MAP_THEME,
    }),
    []
  );

  // Initialize clustering when map loads
  useEffect(() => {
    if (isLoaded && googleMaps && !clusterer && mapInstance) {
      // Create a simple clustering implementation
      const markers: google.maps.Marker[] = [];

      testStays.forEach((stay) => {
        const marker = new google.maps.Marker({
          position: { lat: stay.lat, lng: stay.lng },
          title: stay.name,
          icon: {
            url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="16" cy="16" r="16" fill="#af2322" opacity="0.9"/>
                <text x="16" y="22" text-anchor="middle" fill="white" font-size="12" font-weight="bold">$$</text>
              </svg>
            `)}`,
            scaledSize: new google.maps.Size(32, 32),
            anchor: new google.maps.Point(16, 16),
          },
        });

        marker.addListener("click", () => {
          setSelectedStay(stay);
        });

        markers.push(marker);
      });

      // Simple clustering logic
      const clusterMarkers = () => {
        const zoom = mapInstance?.getZoom() || 10;
        const bounds = mapInstance?.getBounds();

        if (!bounds) return;

        // Group markers by proximity
        const clusters: google.maps.Marker[][] = [];
        const processed = new Set<google.maps.Marker>();

        markers.forEach((marker) => {
          if (processed.has(marker)) return;

          const cluster = [marker];
          processed.add(marker);

          markers.forEach((otherMarker) => {
            if (processed.has(otherMarker)) return;

            const distance =
              google.maps.geometry.spherical.computeDistanceBetween(
                marker.getPosition()!,
                otherMarker.getPosition()!
              );

            // Cluster if markers are close (adjust this value)
            if (distance < (zoom < 10 ? 50000 : 10000)) {
              // 50km at low zoom, 10km at high zoom
              cluster.push(otherMarker);
              processed.add(otherMarker);
            }
          });

          if (cluster.length > 1) {
            clusters.push(cluster);
          }
        });

        // Hide individual markers in clusters, show cluster markers
        clusters.forEach((cluster) => {
          if (cluster.length > 1) {
            cluster.forEach((marker) => marker.setMap(null));

            // Create cluster marker
            const clusterMarker = new google.maps.Marker({
              position: cluster[0].getPosition(),
              icon: {
                url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
                  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="20" cy="20" r="20" fill="#e53e3e" opacity="0.9"/>
                    <text x="20" y="26" text-anchor="middle" fill="white" font-size="14" font-weight="bold">${cluster.length}</text>
                  </svg>
                `)}`,
                scaledSize: new google.maps.Size(40, 40),
                anchor: new google.maps.Point(20, 20),
              },
            });

            clusterMarker.addListener("click", () => {
              // Zoom in to break cluster
              mapInstance?.setZoom(Math.min(zoom + 2, 15));
              mapInstance?.panTo(cluster[0].getPosition()!);
            });

            clusterMarker.setMap(mapInstance);
          }
        });
      };

      setClusterer({ markers, clusterMarkers });
    }
  }, [isLoaded, googleMaps, clusterer, testStays, mapInstance]);

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
    <div className={`w-full ${height} relative bg-gray-50`}>
      <GoogleMap
        zoom={5}
        center={center}
        mapContainerClassName={`w-full h-full cursor-grab active:cursor-grabbing ${mapClasses}`}
        options={mapOptions}
        onLoad={(map) => {
          setMapInstance(map);
          // Store map reference and run clustering
          if (clusterer) {
            clusterer.clusterMarkers();
          }
        }}
        onZoomChanged={() => {
          // Re-cluster when zoom changes
          if (clusterer) {
            clusterer.clusterMarkers();
          }
        }}
      >
        {/* Show individual markers when no clustering */}
        {testStays.map((stay) => (
          <Marker
            key={stay.id}
            position={{ lat: stay.lat, lng: stay.lng }}
            title={stay.name}
            onClick={() => setSelectedStay(stay)}
            icon={{
              url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="16" cy="16" r="16" fill="#af2322" opacity="0.9"/>
                  <text x="16" y="22" text-anchor="middle" fill="white" font-size="12" font-weight="bold">$$</text>
                </svg>
              `)}`,
              scaledSize: new google.maps.Size(32, 32),
              anchor: new google.maps.Point(16, 16),
            }}
          />
        ))}

        {/* Info Window for selected stay */}
        {selectedStay && (
          <InfoWindow
            key={selectedStay.id}
            position={{
              lat: selectedStay.lat,
              lng: selectedStay.lng,
            }}
            onCloseClick={() => setSelectedStay(null)}
          >
            <div className="p-3 max-w-xs">
              {selectedStay.imageUrl && (
                <img
                  src={selectedStay.imageUrl}
                  alt={selectedStay.name}
                  className="w-full h-20 object-cover rounded mb-2"
                />
              )}
              <h3 className="font-semibold text-gray-900 text-sm mb-1">
                {selectedStay.name}
              </h3>

              {selectedStay.pricePerNight && (
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-900">
                    ${selectedStay.pricePerNight}
                  </span>
                  <span className="text-xs text-gray-500">per night</span>
                </div>
              )}

              {selectedStay.rating && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-yellow-500 text-xs">★</span>
                    <span className="text-xs text-gray-600 ml-1">
                      {selectedStay.rating}
                    </span>
                  </div>
                  {selectedStay.numberOfReviews && (
                    <span className="text-xs text-gray-500">
                      ({selectedStay.numberOfReviews} reviews)
                    </span>
                  )}
                </div>
              )}
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
}
