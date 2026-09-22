import React from "react";
import FeedbackMessage from "../shared/FeedbackMessage";

export default function ReportsUnavailable({ onRetry }) {
  return (
    <FeedbackMessage
      variant="error"
      className="civic-feedback civic-feedback--error reports-unavailable"
      title="Reports are temporarily unavailable"
      action={
        <button type="button" onClick={onRetry}>
          Try again
        </button>
      }
    >
      <p>Unable to connect. Please check your connection or try again later.</p>
    </FeedbackMessage>
  );
}
