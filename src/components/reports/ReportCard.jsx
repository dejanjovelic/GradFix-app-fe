import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ImageOff } from "lucide-react";
import { getImageUrl } from "../../utils/getImageUrl";
import { formatDateTime } from "../../utils/formatDateTime";
import { hasReportCoordinates } from "../../utils/reportFilters";

export default function ReportCard({ report }) {
  const imageUrl = getImageUrl(report.primaryImagePath);
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [imageUrl]);
  const title = report.title || report.description || `Report #${report.id}`;
  const location = report.addressFallback || (hasReportCoordinates(report)
    ? `${report.latitude.toFixed(4)}, ${report.longitude.toFixed(4)}` : "Location not provided");
  const statusClass = ["new", "accepted", "in-progress", "resolved", "closed"].includes(report.statusName?.toLowerCase().replaceAll(" ", "-"))
    ? report.statusName.toLowerCase().replaceAll(" ", "-") : "unknown";
  return <article className="report-card">
    <Link to={`/reports/${report.id}`} className="report-card__link">
      <div className="report-card__image">
        {imageUrl && !failed ? <img src={imageUrl} alt={title} loading="lazy" onError={() => setFailed(true)} />
          : <div className="report-card__placeholder"><ImageOff size={30} aria-hidden="true" /><span>No photo available</span></div>}
      </div>
      <div className="report-card__body">
        <div className="report-card__labels"><span>{report.categoryName}</span>
          <span className={`report-card__status report-card__status--${statusClass}`}>{report.statusName}</span>
        </div>
        <h3>{title}</h3><p>{location}</p>
        {report.createdAt && <time dateTime={report.createdAt}>{formatDateTime(report.createdAt)}</time>}
      </div>
    </Link>
  </article>;
}
