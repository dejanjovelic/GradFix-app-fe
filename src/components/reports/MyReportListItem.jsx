import React from "react";
import { formatDate } from "../../utils/formatDate";
import StatusBadge from "../shared/StatusBadge";
import ReportThumbnail from "./ReportThumbnail";

export default function MyReportListItem({ report, onSelect }) {
  return (
    <button
      type="button"
      className="my-report-item"
      onClick={() => onSelect(report.id)}
    >
      <ReportThumbnail
        imagePath={report.primaryImagePath}
        className="my-report-item__image"
        placeholderClassName="my-report-item__image-placeholder"
      />

      <div className="my-report-item__content">
        <div className="my-report-item__top">
          <strong className="my-report-item__title">
            {report.title || `Report #${report.id}`}
          </strong>
          <StatusBadge
            status={report.statusName}
            className="my-report-item__status"
          />
        </div>
        <span className="my-report-item__category">
          {report.categoryName || "Uncategorized"}
        </span>
        <p className="my-report-item__description">{report.description}</p>
        <time className="my-report-item__date" dateTime={report.createdAt}>
          {formatDate(report.createdAt)}
        </time>
      </div>
    </button>
  );
}
