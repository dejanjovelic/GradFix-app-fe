import React, { useEffect, useState } from "react";
import { ArrowRight, Crosshair } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { getReports } from "../../api/reportApi";
import { getErrorMessage } from "../../utils/getErrorMessage";
import {
  readReportFilters,
  updateReportFilter,
} from "../../utils/reportFilters";
import { useReportLookups } from "../../hooks/useReportLookups";
import ReportFilters from "../../components/reports/ReportFilters";
import ReportCard from "../../components/reports/ReportCard";
import ReportsUnavailable from "../../components/reports/ReportsUnavailable";
import "./reports-page.scss";

export default function ReportsPage() {
  const [params, setParams] = useSearchParams();
  const filters = readReportFilters(params);
  const { categoryId, statusId, searchQuery, page } = filters;
  const lookups = useReportLookups();
  const [result, setResult] = useState({
    items: [],
    totalCount: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);
  const isPageUnavailable = Boolean(error && lookups.error);
  const changeFilter = (key, value) =>
    setParams((current) => updateReportFilter(current, key, value), {
      replace: key !== "page",
    });
  const retryPage = () => {
    lookups.retry();
    setAttempt((value) => value + 1);
  };

  useEffect(() => {
    document.title = "Reports | GradFix";
  }, []);
  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    const timer = window.setTimeout(async () => {
      try {
        const data = await getReports({
          page,
          pageSize: 6,
          categoryId,
          statusId,
          searchQuery: searchQuery.trim(),
        });
        if (!active) return;
        setResult({
          items: data.items ?? [],
          totalCount: data.totalCount ?? 0,
          totalPages: data.totalPages ?? 0,
        });
        if (page > Math.max(1, data.totalPages ?? 0)) {
          setParams(
            (current) =>
              updateReportFilter(
                current,
                "page",
                Math.max(1, data.totalPages ?? 0),
              ),
            { replace: true },
          );
        }
      } catch (failure) {
        if (active)
          setError(
            getErrorMessage(failure, {
              fallbackMessage: "Reports could not be loaded.",
            }),
          );
      } finally {
        if (active) setLoading(false);
      }
    }, 300);
    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [page, categoryId, statusId, searchQuery, attempt, setParams]);

  return (
    <>
      <section className="reports-hero" aria-labelledby="reports-intro">
        <div className="civic-container reports-hero__inner">
          <div>
            <span className="civic-eyebrow">Your city. Your voice.</span>
            <h1 id="reports-intro">
              See it. Snap it.
              <br />
              <em>Help fix it.</em>
            </h1>
            <p>
              Report damage to public spaces and follow the city&apos;s
              progress.
            </p>
            <Link to="/report/new" className="reports-hero__action">
              Report an issue
            </Link>
          </div>
          <Crosshair
            className="reports-hero__decoration"
            aria-hidden="true"
            strokeWidth={1}
          />
        </div>
      </section>
      <section
        className="civic-container reports-list"
        aria-labelledby="reports-heading"
      >
        <div className="reports-list__heading">
          <div>
            <span className="civic-eyebrow">Community reports</span>
            <h2 className="civic-title" id="reports-heading">
              What needs attention
            </h2>
          </div>
          <Link className="civic-link" to="/map">
            Explore the map <ArrowRight size={17} aria-hidden="true" />
          </Link>
        </div>
        {isPageUnavailable ? (
          <ReportsUnavailable onRetry={retryPage} />
        ) : (
          <>
            <ReportFilters
              filters={filters}
              lookups={lookups}
              onChange={changeFilter}
            />
            <div className="reports-list__summary" role="status">
              {loading
                ? "Loading reports…"
                : error
                  ? "Reports unavailable"
                  : `${result.totalCount} ${result.totalCount === 1 ? "report" : "reports"} found`}
            </div>
            {error ? (
              <div
                role="alert"
                className="civic-feedback civic-feedback--error"
              >
                {error}
                <button
                  type="button"
                  onClick={() => setAttempt((value) => value + 1)}
                >
                  Try again
                </button>
              </div>
            ) : loading ? (
              <div className="reports-grid" aria-hidden="true">
                {[1, 2, 3].map((id) => (
                  <div key={id} className="report-card-skeleton" />
                ))}
              </div>
            ) : result.items.length ? (
              <div className="reports-grid">
                {result.items.map((report) => (
                  <ReportCard key={report.id} report={report} />
                ))}
              </div>
            ) : (
              <div className="civic-feedback">
                No reports match your filters. Try another search or category.
              </div>
            )}
          </>
        )}
        {!isPageUnavailable && !error && result.totalPages > 1 && (
          <nav className="reports-pagination" aria-label="Reports pagination">
            <button
              type="button"
              disabled={loading || page <= 1}
              onClick={() => changeFilter("page", page - 1)}
            >
              Previous
            </button>
            <span>
              Page {page} of {result.totalPages}
            </span>
            <button
              type="button"
              disabled={loading || page >= result.totalPages}
              onClick={() => changeFilter("page", page + 1)}
            >
              Next
            </button>
          </nav>
        )}
      </section>
    </>
  );
}
