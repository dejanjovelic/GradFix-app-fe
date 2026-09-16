import React, { useEffect } from "react";
import { Icon } from "leaflet";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import { Link } from "react-router-dom";
import markerUrl from "leaflet/dist/images/marker-icon.png";
import markerRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";
import "leaflet/dist/leaflet.css";

const DEFAULT_CENTER = [45.2671, 19.8335];
const markerIcon = new Icon({
  iconUrl: markerUrl,
  iconRetinaUrl: markerRetinaUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

function MapViewport({ reports }) {
  const map = useMap();

  useEffect(() => {
    if (!reports.length) {
      map.setView(DEFAULT_CENTER, 12);
      return;
    }

    map.fitBounds(
      reports.map((report) => [report.latitude, report.longitude]),
      { padding: [40, 40], maxZoom: 14 },
    );
  }, [map, reports]);

  useEffect(() => {
    const resize = () => map.invalidateSize({ animate: false, pan: false });

    if (!window.ResizeObserver) {
      window.addEventListener("resize", resize);
      return () => window.removeEventListener("resize", resize);
    }

    const observer = new ResizeObserver(resize);
    observer.observe(map.getContainer());
    return () => observer.disconnect();
  }, [map]);

  return null;
}

export default function PublicReportsMap({ reports }) {
  return (
    <div className="reports-map" role="region" aria-label="Map of reported problems">
      <MapContainer
        className="reports-map__leaflet"
        center={DEFAULT_CENTER}
        zoom={12}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapViewport reports={reports} />
        {reports.map((report) => (
          <Marker
            key={report.id}
            position={[report.latitude, report.longitude]}
            icon={markerIcon}
            alt={report.title || `Report #${report.id}`}
            title={report.title || `Report #${report.id}`}
          >
            <Popup>
              <div className="reports-map__popup">
                <strong>{report.title || `Report #${report.id}`}</strong>
                <span>{report.categoryName}</span>
                <span>{report.statusName}</span>
                <Link to={`/reports/${report.id}`}>View report</Link>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
