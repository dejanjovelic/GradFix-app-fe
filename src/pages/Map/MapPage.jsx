import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { getMapReports } from "../../api/reportApi";
import { useReportLookups } from "../../hooks/useReportLookups";
import { getErrorMessage } from "../../utils/getErrorMessage";
import {
  hasReportCoordinates,
  readReportFilters,
  updateReportFilter,
} from "../../utils/reportFilters";
import ReportFilters from "../../components/reports/ReportFilters";
import ReportsUnavailable from "../../components/reports/ReportsUnavailable";
import ReportsMap from "./ReportsMap";
import FeedbackMessage from "../../components/shared/FeedbackMessage";
import "./map-page.scss";

export default function MapPage() {
  const [params, setParams] = useSearchParams();
  const filters = readReportFilters(params);
  const { categoryId, statusId } = filters;
  const lookups = useReportLookups();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);
  const isPageUnavailable = Boolean(error && lookups.error);
  const retryPage = () => {
    lookups.retry();
    setAttempt((value) => value + 1);
  };
  useEffect(() => {
    document.title = "Map | GradFix";
  }, []);
  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    getMapReports({ categoryId, statusId })
      .then((data) => {
        if (active) setReports((data ?? []).filter(hasReportCoordinates));
      })
      .catch((failure) => {
        if (active) {
          setReports([]);
          setError(getErrorMessage(failure));
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [categoryId, statusId, attempt]);
  return (
    <section className="civic-container map-page" aria-labelledby="map-heading">
      <span className="civic-eyebrow">Live overview</span>
      <h1 className="civic-title" id="map-heading">
        Reports across the city
      </h1>
      <div className="map-page__intro">
        <p>Select a marker to open its public details.</p>
        <Link className="civic-link" to="/">
          <ArrowLeft size={16} aria-hidden="true" />
          Browse reports
        </Link>
      </div>
      {isPageUnavailable ? (
        <ReportsUnavailable onRetry={retryPage} />
      ) : (
        <>
          <ReportFilters
            showSearch={false}
            filters={filters}
            lookups={lookups}
            onChange={(key, value) =>
              setParams((current) => updateReportFilter(current, key, value), {
                replace: true,
              })
            }
          />
          {!error && (
            <p className="map-page__count" role="status">
              {loading
                ? "Loading report locations…"
                : `${reports.length} ${reports.length === 1 ? "report" : "reports"} on the map`}
            </p>
          )}
          {error ? (
            <FeedbackMessage
              variant="error"
              className="civic-feedback civic-feedback--error"
              action={
                <button
                  type="button"
                  onClick={() => setAttempt((value) => value + 1)}
                >
                  Try again
                </button>
              }
            >
              Map reports are temporarily unavailable.
            </FeedbackMessage>
          ) : (
            <>
              {!loading && !reports.length && (
                <FeedbackMessage className="civic-feedback">
                  No reported locations match these filters.
                </FeedbackMessage>
              )}
              <ReportsMap reports={loading ? [] : reports} />
            </>
          )}
        </>
      )}
    </section>
  );
}
