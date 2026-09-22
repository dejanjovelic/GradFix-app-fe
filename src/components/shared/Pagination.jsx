import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({
  currentPage,
  totalPages,
  onPrevious,
  onNext,
  disabled = false,
  className = "pagination",
  ariaLabel = "Pagination",
  showIcons = false,
}) {
  const safeTotalPages = Math.max(totalPages, 1);
  const classes = ["pagination", className]
    .filter(Boolean)
    .filter((value, index, values) => values.indexOf(value) === index)
    .join(" ");

  return (
    <nav className={classes} aria-label={ariaLabel}>
      <button
        type="button"
        disabled={disabled || currentPage <= 1}
        onClick={onPrevious}
      >
        {showIcons && <ChevronLeft size={17} aria-hidden="true" />}
        Previous
      </button>
      <span>Page {currentPage} of {safeTotalPages}</span>
      <button
        type="button"
        disabled={disabled || totalPages === 0 || currentPage >= safeTotalPages}
        onClick={onNext}
      >
        Next
        {showIcons && <ChevronRight size={17} aria-hidden="true" />}
      </button>
    </nav>
  );
}
