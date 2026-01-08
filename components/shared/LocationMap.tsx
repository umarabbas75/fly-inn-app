"use client";

import React, { useCallback, useMemo, useState } from "react";
import {
  GoogleMap,
  InfoWindow,
  Marker,
  MarkerClusterer,
} from "@react-google-maps/api";
import { useGoogleMaps } from "@/providers/GoogleMapsProvider";
import { Spin } from "antd";

interface LocationMapProps {
  stays: any[];
  containerStyle: {
    width: string;
    height: string;
  };
  zoom?: number;
  onMarkerClick?: (marker: any, index: number) => void;
  onMapClick?: (e: google.maps.MapMouseEvent) => void;
  onMapLoad?: (map: google.maps.Map) => void;
}

const LocationMap: React.FC<LocationMapProps> = ({
  stays,
  containerStyle,
  zoom = 10,
  onMarkerClick,
  onMapClick,
  onMapLoad,
}) => {
  const { isLoaded, loadError } = useGoogleMaps();
  const [selectedStay, setSelectedStay] = useState<any>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);

  // Default center (US center)
  const center = useMemo(() => ({ lat: 39.8283, lng: -98.5795 }), []);

  // Map options
  const mapOptions = useMemo(
    () => ({
      disableDefaultUI: false,
      zoomControl: true,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: true,
      scrollwheel: true,
    }),
    []
  );

  // Convert stays to markers
  const markers = useMemo(() => {
    return stays
      .map((stay, index) => {
        const lat = parseFloat(stay.latitude?.toString() || "0");
        const lng = parseFloat(stay.longitude?.toString() || "0");

        if (isNaN(lat) || isNaN(lng)) {
          return null;
        }

        return {
          position: { lat, lng },
          title: stay.title || stay.name || `Stay ${index + 1}`,
          stayId: stay.id,
          stay,
        };
      })
      .filter(Boolean);
  }, [stays]);

  // Handle map load
  const handleMapLoad = useCallback(
    (mapInstance: google.maps.Map) => {
      setMap(mapInstance);
      if (onMapLoad) {
        onMapLoad(mapInstance);
      }
    },
    [onMapLoad]
  );

  // Handle marker click
  const handleMarkerClick = useCallback(
    (marker: any, index: number) => {
      setSelectedStay(marker.stay);
      if (onMarkerClick) {
        onMarkerClick(marker, index);
      }
    },
    [onMarkerClick]
  );

  // Handle map click
  const handleMapClick = useCallback(
    (e: google.maps.MapMouseEvent) => {
      setSelectedStay(null);
      if (onMapClick) {
        onMapClick(e);
      }
    },
    [onMapClick]
  );

  if (loadError) {
    return (
      <div className="flex items-center justify-center" style={containerStyle}>
        <div className="text-red-600">Error loading maps</div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center" style={containerStyle}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={zoom}
      options={mapOptions}
      onLoad={handleMapLoad}
      onClick={handleMapClick}
    >
      <MarkerClusterer>
        {(clusterer) => (
          <>
            {markers.map((marker: any, index) => (
              <Marker
                key={`marker-${marker.stayId}-${index}`}
                position={marker.position}
                title={marker.title}
                clusterer={clusterer}
                onClick={() => handleMarkerClick(marker, index)}
              />
            ))}
          </>
        )}
      </MarkerClusterer>

      {selectedStay && (
        <InfoWindow
          position={{
            lat: parseFloat(selectedStay.latitude),
            lng: parseFloat(selectedStay.longitude),
          }}
          onCloseClick={() => setSelectedStay(null)}
        >
          <div className="p-2 max-w-xs">
            <h3 className="font-semibold text-sm mb-1">
              {selectedStay.title || selectedStay.name}
            </h3>
            {selectedStay.pricing?.nightly_price && (
              <p className="text-xs text-gray-600">
                ${selectedStay.pricing.nightly_price}/night
              </p>
            )}
            {selectedStay.address && (
              <p className="text-xs text-gray-500 mt-1">
                {selectedStay.address.city}, {selectedStay.address.state}
              </p>
            )}
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  );
};

export default LocationMap;
