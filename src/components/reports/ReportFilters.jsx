import React from "react";
import "./report-filters.scss";

export default function ReportFilters({ filters, lookups, onChange, showSearch = true }) {
  return <>
    <div className={`report-filters${showSearch ? "" : " report-filters--map"}`} role="search" aria-label="Filter reports">
      {showSearch && <label>Search
        <input type="search" placeholder="Pothole, street, bench..." value={filters.searchQuery}
          onChange={event => onChange("search", event.target.value)} />
      </label>}
      <label>Category
        <select value={filters.categoryId} disabled={lookups.loading} onChange={event => onChange("category", event.target.value)}>
          <option value="">All categories</option>
          {lookups.categories.map(category => <option key={category.id} value={category.id}>{category.name}</option>)}
        </select>
      </label>
      <label>Status
        <select value={filters.statusId} disabled={lookups.loading} onChange={event => onChange("status", event.target.value)}>
          <option value="">All statuses</option>
          {lookups.statuses.map(status => <option key={status.id} value={status.id}>{status.name}</option>)}
        </select>
      </label>
    </div>
    {lookups.error && <div className="civic-feedback civic-feedback--error" role="alert">
      {lookups.error}<button type="button" onClick={lookups.retry}>Retry filters</button>
    </div>}
  </>;
}
