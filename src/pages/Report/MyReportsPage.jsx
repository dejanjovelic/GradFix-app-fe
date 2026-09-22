import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getMyReports } from "../../api/reportApi";
import { getErrorMessage } from "../../utils/getErrorMessage";
import FeedbackMessage from "../../components/shared/FeedbackMessage";
import PageHeader from "../../components/shared/PageHeader";
import Pagination from "../../components/shared/Pagination";
import MyReportListItem from "../../components/reports/MyReportListItem";
import { useReportLookups } from "../../hooks/useReportLookups";

import "./my-reports-page.scss";

const DEFAULT_PAGE_SIZE = 6;

function MyReportsPage() {
  const navigate = useNavigate();

  const [reports, setReports] = useState([]);

  const lookups = useReportLookups();

  const [categoryId, setCategoryId] = useState("");
  const [statusId, setStatusId] = useState("");

  const [page, setPage] = useState(1);
  const [pageSize] = useState(DEFAULT_PAGE_SIZE);

  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isCancelled = false;

    async function loadReports() {
      setIsLoading(true);
      setError("");

      try {
        const data = await getMyReports({
          page,
          pageSize,
          categoryId,
          statusId,
        });

        if (isCancelled) {
          return;
        }

        setReports(data.items ?? []);
        setTotalCount(data.totalCount ?? 0);
        setTotalPages(data.totalPages ?? 0);

        if (
          data.totalPages > 0 &&
          page > data.totalPages
        ) {
          setPage(data.totalPages);
        }
      } catch (error) {
        if (isCancelled) {
          return;
        }

        setReports([]);
        setTotalCount(0);
        setTotalPages(0);

        setError(
          getErrorMessage(error, {
            fallbackMessage:
              "Your reports could not be loaded.",
            unauthorizedMessage:
              "Please log in again to view your reports.",
            forbiddenMessage:
              "You do not have permission to view these reports.",
          }),
        );
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }

    loadReports();

    return () => {
      isCancelled = true;
    };
  }, [
    page,
    pageSize,
    categoryId,
    statusId,
  ]);

  function handleCategoryChange(event) {
    setCategoryId(event.target.value);
    setPage(1);
  }

  function handleStatusChange(event) {
    setStatusId(event.target.value);
    setPage(1);
  }

  function handleReportClick(reportId) {
    navigate(`/reports/${reportId}`);
  }

  return (
    <section className="my-reports-page">
      <PageHeader
        className="my-reports-page__header"
        eyebrowClassName="my-reports-page__eyebrow"
        eyebrow="Citizen area"
        title="My reports"
        description="Track the problems you have reported and follow their current status."
      />

      {lookups.error && (
        <FeedbackMessage variant="warning" className="my-reports-page__message my-reports-page__message--warning">
          {lookups.error}
        </FeedbackMessage>
      )}

      <div className="my-reports-page__toolbar">
        <div className="my-reports-page__filter">
          <label htmlFor="my-reports-category">
            Category
          </label>

          <select
            id="my-reports-category"
            value={categoryId}
            disabled={lookups.loading}
            onChange={handleCategoryChange}
          >
            <option value="">All categories</option>

            {lookups.categories.map((category) => (
              <option
                key={category.id}
                value={category.id}
              >
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="my-reports-page__filter">
          <label htmlFor="my-reports-status">
            Status
          </label>

          <select
            id="my-reports-status"
            value={statusId}
            disabled={lookups.loading}
            onChange={handleStatusChange}
          >
            <option value="">All statuses</option>

            {lookups.statuses.map((status) => (
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

      <div className="my-reports-page__summary">
        {totalCount === 1
          ? "1 report"
          : `${totalCount} reports`}
      </div>

      <div className="my-reports-page__content">
        {isLoading && (
          <div className="my-reports-page__state">
            Loading your reports...
          </div>
        )}

        {!isLoading && error && (
          <div
            className="my-reports-page__state my-reports-page__state--error"
            role="alert"
          >
            {error}
          </div>
        )}

        {!isLoading &&
          !error &&
          reports.length === 0 && (
            <div className="my-reports-page__state">
              <h2>No reports found</h2>

              <p>
                You do not have any reports matching
                the selected filters.
              </p>
            </div>
          )}

        {!isLoading &&
          !error &&
          reports.length > 0 && (
            <div className="my-reports-list">
              {reports.map((report) => (
                <MyReportListItem
                  key={report.id}
                  report={report}
                  onSelect={handleReportClick}
                />
              ))}
            </div>
          )}
      </div>

      {!isLoading && !error && (
        <Pagination
          className="my-reports-page__pagination"
          ariaLabel="My reports pagination"
          currentPage={page}
          totalPages={totalPages}
          onPrevious={() => setPage((currentPage) => currentPage - 1)}
          onNext={() => setPage((currentPage) => currentPage + 1)}
          showIcons
        />
      )}
    </section>
  );
}

export default MyReportsPage;
