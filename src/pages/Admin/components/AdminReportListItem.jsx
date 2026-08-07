import React from "react";
import { getImageUrl } from "../../../utils/getImageUrl";
import { ImageOff } from "lucide-react";

function AdminReportListItem({ report, isSelected, onSelect }) {
  const imageUrl = getImageUrl(report.primaryImagePath);
  return (
    <button
      type="button"
      className={`admin-report-item ${
        isSelected ? "admin-report-item--selected" : ""
      }`}
      onClick={() => onSelect(report.id)}
    >
      <div className="admin-report-item__content">
        <strong className="admin-report-item__title">
          {report.title || "Untitled report"}
        </strong>

        <span className="admin-report-item__category">
          {report.categoryName || "Uncategorized"}
        </span>

        <span className="admin-report-item__status">
          {report.statusName || "Unknown status"}
        </span>

        <div className="admin-report-item__image">
          {imageUrl ? <img src={imageUrl} alt="" /> : <ImageOff size={22} />}
        </div>

        <time className="admin-report-item__date">
          {new Date(report.createdAt).toLocaleDateString()}
        </time>
      </div>
    </button>
  );
}

export default AdminReportListItem;
