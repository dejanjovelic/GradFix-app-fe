import React from "react";
import {
  ArrowLeft,
  CalendarDays,
  ImageOff,
  MapPin,
} from "lucide-react";
import { Link } from "react-router-dom";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

function getImageUrl(path) {
  if (!path) {
    return null;
  }

  if (
    path.startsWith("http://") ||
    path.startsWith("https://")
  ) {
    return path;
  }

  return `${backendUrl}${path}`;
}

function formatDate(date) {
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
  }).format(new Date(date));
}

function SelectedReportPanel({
  selectedReport,
  isLoading,
  error,
  onBack,
}) {
  return (
    <section className="selected-report-panel">
      <button
        type="button"
        onClick={onBack}
        className="selected-report-panel__back"
      >
        <ArrowLeft size={18} />
        Back to all reports
      </button>

      {isLoading && (
        <p className="selected-report-panel__state">
          Loading report details...
        </p>
      )}

      {!isLoading && error && (
        <p
          className="selected-report-panel__error"
          role="alert"
        >
          {error}
        </p>
      )}

      {!isLoading && !error && selectedReport && (
        <>
          <div className="selected-report-panel__image">
            {selectedReport.images?.[0]?.filePath ? (
              <img
                src={getImageUrl(
                  selectedReport.images[0].filePath
                )}
                alt={
                  selectedReport.title ||
                  `Report ${selectedReport.id}`
                }
              />
            ) : (
              <ImageOff size={32} />
            )}
          </div>

          <div className="selected-report-panel__labels">
            <span>
              {selectedReport.category?.name ??
                "Uncategorized"}
            </span>

            <span>
              {selectedReport.status?.name ??
                "Unknown status"}
            </span>
          </div>

          <h2>
            {selectedReport.title ||
              `Report #${selectedReport.id}`}
          </h2>

          <p className="selected-report-panel__description">
            {selectedReport.description}
          </p>

          <div className="selected-report-panel__metadata">
            <span>
              <CalendarDays size={16} />
              {formatDate(selectedReport.createdAt)}
            </span>

            <span>
              <MapPin size={16} />
              {selectedReport.addressFallback ||
                "GPS location provided"}
            </span>
          </div>

          <Link
            to={`/reports/${selectedReport.id}`}
            className="selected-report-panel__full-link"
          >
            View full report
          </Link>
        </>
      )}
    </section>
  );
}

export default SelectedReportPanel;