import React from "react";
import { ImageOff } from "lucide-react";

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

function PublicReportListItem({
  report,
  isSelected = false,
  onSelect,
}) {
  const imageUrl = getImageUrl(
    report.primaryImagePath
  );

  return (
    <button
      className={`public-report-item ${
        isSelected
          ? "public-report-item--selected"
          : ""
      }`}
      type="button"
      onClick={() => onSelect(report.id)}
    >
      <div className="public-report-item__content">
        <strong className="public-report-item__title">
          {report.title || `Report #${report.id}`}
        </strong>

        <span className="public-report-item__category">
          {report.categoryName ?? "Uncategorized"}
        </span>

        <div className="public-report-item__metadata">
          <span className="public-report-item__status">
            {report.statusName ?? "Unknown"}
          </span>

          <time dateTime={report.createdAt}>
            {formatDate(report.createdAt)}
          </time>
        </div>
      </div>

      <div className="public-report-item__image">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt=""
          />
        ) : (
          <ImageOff size={22} />
        )}
      </div>
    </button>
  );
}

export default PublicReportListItem;