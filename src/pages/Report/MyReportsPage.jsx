import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getMyReports } from "../../api/reportApi";
import { getCategories } from "../../api/categoryApi";
import { getReportStatuses } from "../../api/reportStatusApi";
import { getErrorMessage } from "../../utils/getErrorMessage";
import FeedbackMessage from "../../components/shared/FeedbackMessage";
import PageHeader from "../../components/shared/PageHeader";
import Pagination from "../../components/shared/Pagination";
import MyReportListItem from "../../components/reports/MyReportListItem";

import "./my-reports-page.scss";

const DEFAULT_PAGE_SIZE = 6;

function MyReportsPage() {
  const navigate = useNavigate();

  const [reports, setReports] = useState([]);

  const [categories, setCategories] = useState([]);
  const [statuses, setStatuses] = useState([]);

  const [categoryId, setCategoryId] = useState("");
  const [statusId, setStatusId] = useState("");

  const [page, setPage] = useState(1);
  const [pageSize] = useState(DEFAULT_PAGE_SIZE);

  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [filtersError, setFiltersError] = useState("");

  useEffect(() => {
    async function loadFilters() {
      setFiltersError("");

      const [categoriesResult, statusesResult] =
        await Promise.allSettled([
          getCategories(),
          getReportStatuses(),
        ]);

      if (categoriesResult.status === "fulfilled") {
        setCategories(categoriesResult.value ?? []);
      }

      if (statusesResult.status === "fulfilled") {
        setStatuses(statusesResult.value ?? []);
      }

      if (
        categoriesResult.status === "rejected" ||
        statusesResult.status === "rejected"
      ) {
        setFiltersError(
          "Some filter options could not be loaded.",
        );
      }
    }

    loadFilters();
  }, []);

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

      {filtersError && (
        <FeedbackMessage variant="warning" className="my-reports-page__message my-reports-page__message--warning">
          {filtersError}
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
            onChange={handleCategoryChange}
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

        <div className="my-reports-page__filter">
          <label htmlFor="my-reports-status">
            Status
          </label>

          <select
            id="my-reports-status"
            value={statusId}
            onChange={handleStatusChange}
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
