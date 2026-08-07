import React, { useEffect, useMemo, useRef } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import { Link } from "react-router-dom";

const DEFAULT_CENTER = [45.2671, 19.8335];
const DEFAULT_ZOOM = 12;
const SELECTED_ZOOM = 16;

function MapResizeController() {
  const map = useMap();

  useEffect(() => {
    const invalidateMapSize = () => {
      map.invalidateSize({
        animate: false,
        pan: false,
      });
    };

    const timeoutId = window.setTimeout(
      invalidateMapSize,
      100,
    );

    if (!window.ResizeObserver) {
      window.addEventListener(
        "resize",
        invalidateMapSize,
      );

      return () => {
        window.clearTimeout(timeoutId);

        window.removeEventListener(
          "resize",
          invalidateMapSize,
        );
      };
    }

    const container = map.getContainer();

    const resizeObserver = new ResizeObserver(
      invalidateMapSize,
    );

    resizeObserver.observe(container);

    return () => {
      window.clearTimeout(timeoutId);
      resizeObserver.disconnect();
    };
  }, [map]);

  return null;
}

function MapViewportController({ reports, selectedReportId }) {
  const map = useMap();

  const selectedReport = useMemo(
    () => reports.find((report) => report.id === selectedReportId),
    [reports, selectedReportId],
  );

  useEffect(() => {
    if (selectedReport) {
      map.setView(
        [selectedReport.latitude, selectedReport.longitude],
        SELECTED_ZOOM,
        {
          animate: true,
        },
      );

      return;
    }

    if (reports.length === 0) {
      map.setView(DEFAULT_CENTER, DEFAULT_ZOOM);

      return;
    }

    if (reports.length === 1) {
      map.setView([reports[0].latitude, reports[0].longitude], SELECTED_ZOOM);

      return;
    }

    const bounds = reports.map((report) => [report.latitude, report.longitude]);

    map.fitBounds(bounds, {
      padding: [40, 40],
      maxZoom: SELECTED_ZOOM,
    });
  }, [map, reports, selectedReport]);

  return null;
}

function ReportMarker({ report, isSelected, onSelect }) {
  const markerRef = useRef(null);

  useEffect(() => {
    if (isSelected) {
      markerRef.current?.openPopup();
    } else {
      markerRef.current?.closePopup();
    }
  }, [isSelected]);

  return (
    <Marker
      ref={markerRef}
      position={[report.latitude, report.longitude]}
      eventHandlers={{
        click() {
          onSelect(report.id);
        },
      }}
    >
      <Popup>
        <div className="reports-map__popup">
          <strong>{report.title || `Report #${report.id}`}</strong>

          <span>{report.categoryName}</span>

          <span>Status: {report.statusName}</span>

          <Link to={`/reports/${report.id}`}>View full report</Link>
        </div>
      </Popup>
    </Marker>
  );
}

function ReportsMap({
  reports,
  selectedReportId,
  isLoading,
  error,
  onReportSelect,
}) {
  return (
    <div className="reports-map">
      {isLoading && (
        <div className="reports-map__overlay">Loading report locations...</div>
      )}

      {!isLoading && error && (
        <div
          className="reports-map__overlay reports-map__overlay--error"
          role="alert"
        >
          {error}
        </div>
      )}

      <MapContainer
        className="reports-map__leaflet"
        center={DEFAULT_CENTER}
        zoom={DEFAULT_ZOOM}
        scrollWheelZoom
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapResizeController />

        <MapViewportController
          reports={reports}
          selectedReportId={selectedReportId}
        />

        {reports.map((report) => (
          <ReportMarker
            key={report.id}
            report={report}
            isSelected={report.id === selectedReportId}
            onSelect={onReportSelect}
          />
        ))}
      </MapContainer>
    </div>
  );
}

export default ReportsMap;
