import React from "react";
import { ImageOff } from "lucide-react";

import { getImageUrl } from "../../../utils/getImageUrl";
import { formatDate } from "../../../utils/formatDate";


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