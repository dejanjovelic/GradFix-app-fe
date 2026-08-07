import React from "react";
import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import PublicReportListItem from "./PublicReportListItem";

function PublicReportsSidebar({
  reports,
  categories,
  statuses,
  categoryId,
  statusId,
  page,
  totalPages,
  totalCount,
  selectedReportId,
  isLoading,
  error,
  onCategoryChange,
  onStatusChange,
  onPageChange,
  onReportSelect,
}) {
  const safeTotalPages = Math.max(totalPages, 1);

  return (
    <div className="public-reports-sidebar">
      <div className="public-reports-sidebar__filters">
        <div className="public-reports-sidebar__field">
          <label htmlFor="public-category-filter">
            Category
          </label>

          <select
            id="public-category-filter"
            value={categoryId}
            onChange={(event) =>
              onCategoryChange(event.target.value)
            }
          >
            <option value="">All categories</option>

            {categories.map((category) => (
              <option
                key={category.id}
                value={category.id}
              >
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="public-reports-sidebar__field">
          <label htmlFor="public-status-filter">
            Status
          </label>

          <select
            id="public-status-filter"
            value={statusId}
            onChange={(event) =>
              onStatusChange(event.target.value)
            }
          >
            <option value="">All statuses</option>

            {statuses.map((status) => (
              <option
                key={status.id}
                value={status.id}
              >
                {status.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="public-reports-sidebar__summary">
        {totalCount}{" "}
        {totalCount === 1
          ? "report found"
          : "reports found"}
      </div>

      <div className="public-reports-sidebar__list">
        {isLoading && (
          <p className="public-reports-sidebar__state">
            Loading reports...
          </p>
        )}

        {!isLoading && error && (
          <p
            className="public-reports-sidebar__error"
            role="alert"
          >
            {error}
          </p>
        )}

        {!isLoading &&
          !error &&
          reports.length === 0 && (
            <p className="public-reports-sidebar__state">
              No reports match the selected filters.
            </p>
          )}

        {!isLoading &&
          !error &&
          reports.map((report) => (
            <PublicReportListItem
              key={report.id}
              report={report}
              isSelected={
                report.id === selectedReportId
              }
              onSelect={onReportSelect}
            />
          ))}
      </div>

      <nav
        className="public-reports-sidebar__pagination"
        aria-label="Reports pagination"
      >
        <button
          type="button"
          disabled={page <= 1 || isLoading}
          onClick={() =>
            onPageChange(page - 1)
          }
        >
          <ChevronLeft size={17} />
          Previous
        </button>

        <span>
          Page {page} of {safeTotalPages}
        </span>

        <button
          type="button"
          disabled={
            page >= safeTotalPages || isLoading
          }
          onClick={() =>
            onPageChange(page + 1)
          }
        >
          Next
          <ChevronRight size={17} />
        </button>
      </nav>
    </div>
  );
}

export default PublicReportsSidebar;