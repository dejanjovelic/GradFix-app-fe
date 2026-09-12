import React from "react";

export default function ReportsUnavailable({ onRetry }) {
  return (
    <div role="alert" className="civic-feedback civic-feedback--error reports-unavailable">
      <div>
        <strong>Reports are temporarily unavailable</strong>
        <p>Unable to connect. Please check your connection or try again later.</p>
      </div>
      <button type="button" onClick={onRetry}>Try again</button>
    </div>
  );
}
