import React from "react";
import { Link } from "react-router-dom";
import { formatDateTime } from "../../utils/formatDateTime";
import { hasReportCoordinates } from "../../utils/reportFilters";
import StatusBadge from "../shared/StatusBadge";
import ReportThumbnail from "./ReportThumbnail";

export default function ReportCard({ report }) {
  const title = report.title || report.description || `Report #${report.id}`;
  const location =
    report.addressFallback ||
    (hasReportCoordinates(report)
      ? `${report.latitude.toFixed(4)}, ${report.longitude.toFixed(4)}`
      : "Location not provided");
  return (
    <article className="report-card">
      <Link to={`/reports/${report.id}`} className="report-card__link">
        <ReportThumbnail
          imagePath={report.primaryImagePath}
          alt={title}
          className="report-card__image"
          placeholderClassName="report-card__placeholder"
          placeholderText="No photo available"
          iconSize={30}
        />
        <div className="report-card__body">
          <div className="report-card__labels">
            <span>{report.categoryName}</span>
            <StatusBadge status={report.statusName} className="report-card__status" />
          </div>
          <h3>{title}</h3>
          <p>{location}</p>
          {report.createdAt && (
            <time dateTime={report.createdAt}>
              {formatDateTime(report.createdAt)}
            </time>
          )}
        </div>
      </Link>
    </article>
  );
}
