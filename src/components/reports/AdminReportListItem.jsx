import React from "react";
import StatusBadge from "../shared/StatusBadge";
import ReportThumbnail from "./ReportThumbnail";

export default function AdminReportListItem({ report, isSelected, onSelect }) {
  return (
    <button
      type="button"
      className={`admin-report-item ${isSelected ? "admin-report-item--selected" : ""}`}
      onClick={() => onSelect(report.id)}
    >
      <div className="admin-report-item__content">
        <strong className="admin-report-item__title">
          {report.title || "Untitled report"}
        </strong>
        <span className="admin-report-item__category">
          {report.categoryName || "Uncategorized"}
        </span>
        <StatusBadge
          status={report.statusName}
          className="admin-report-item__status"
        />
        <ReportThumbnail
          imagePath={report.primaryImagePath}
          className="admin-report-item__image"
          placeholderText=""
          iconSize={22}
        />
        <time className="admin-report-item__date" dateTime={report.createdAt}>
          {new Date(report.createdAt).toLocaleDateString()}
        </time>
      </div>
    </button>
  );
}
