import React, { useEffect } from "react";
import {
  MapContainer,
  Marker,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";

import "./location-picker-map.scss";

const DEFAULT_CENTER = [45.2671, 19.8335];
const DEFAULT_ZOOM = 13;
const SELECTED_LOCATION_ZOOM = 16;

function MapClickHandler({ onLocationSelect }) {
  useMapEvents({
    click(event) {
      onLocationSelect(
        event.latlng.lat,
        event.latlng.lng
      );
    },
  });

  return null;
}

function MapPositionController({
  latitude,
  longitude,
}) {
  const map = useMap();

  useEffect(() => {
    if (
      latitude == null ||
      longitude == null
    ) {
      return;
    }

    map.setView(
      [latitude, longitude],
      SELECTED_LOCATION_ZOOM,
      {
        animate: true,
      }
    );
  }, [latitude, longitude, map]);

  return null;
}

function LocationPickerMap({
  latitude,
  longitude,
  onLocationSelect,
}) {
  const hasLocation =
    latitude != null &&
    longitude != null &&
    Number.isFinite(latitude) &&
    Number.isFinite(longitude);

  const initialCenter = hasLocation
    ? [latitude, longitude]
    : DEFAULT_CENTER;

  return (
    <div className="location-picker-map">
      <MapContainer
        className="location-picker-map__map"
        center={initialCenter}
        zoom={
          hasLocation
            ? SELECTED_LOCATION_ZOOM
            : DEFAULT_ZOOM
        }
        scrollWheelZoom
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapClickHandler
          onLocationSelect={onLocationSelect}
        />

        <MapPositionController
          latitude={latitude}
          longitude={longitude}
        />

        {hasLocation && (
          <Marker
            position={[latitude, longitude]}
          />
        )}
      </MapContainer>

      <p className="location-picker-map__hint">
        Click anywhere on the map to place or move
        the report pin.
      </p>
    </div>
  );
}

export default LocationPickerMap;