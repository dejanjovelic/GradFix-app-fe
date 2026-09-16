import React from "react";
import { LoaderCircle } from "lucide-react";

export default function ReportSubmitActions({ isSubmitting, disabled }) {
  return (
    <div className="report-form__actions">
      <button className="report-form__submit" type="submit" disabled={disabled}>
        {isSubmitting ? (
          <>
            <LoaderCircle
              className="report-form__spinner"
              size={20}
              aria-hidden="true"
            />
            Submitting report...
          </>
        ) : (
          "Submit report"
        )}
      </button>
    </div>
  );
}
