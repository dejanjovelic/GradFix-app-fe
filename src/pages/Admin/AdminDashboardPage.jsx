import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  CalendarDays,
  ImageOff,
  MapPin,
  Plus,
} from "lucide-react";

import { getCategories } from "../../api/categoryApi";
import { getReports } from "../../api/reportApi";
import { getReportStatuses } from "../../api/reportStatusApi";
import { getErrorMessage } from "../../utils/getErrorMessage";

import "./admin-dashboard-page.scss";

const backendUrl =
  import.meta.env.VITE_BACKEND_URL;

function getImageUrl(path) {
  if (!path) {
    return null;
  }

  if (
    path.startsWith("http://") ||
    path.startsWith("https://")
  ) {
    return path;
  }

  return `${backendUrl}${path}`;
}

function HomePage() {
  const [reports, setReports] = useState([]);
  const [categories, setCategories] = useState([]);
  const [statuses, setStatuses] = useState([]);

  const [categoryId, setCategoryId] = useState("");
  const [statusId, setStatusId] = useState("");

  const [page, setPage] = useState(1);
  const [pageSize] = useState(6);

  const [totalPages, setTotalPages] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadFilters() {
      try {
        const [categoryData, statusData] =
          await Promise.all([
            getCategories(),
            getReportStatuses(),
          ]);

        setCategories(categoryData);
        setStatuses(statusData);
      } catch (requestError) {
        setError(
          getErrorMessage(requestError, {
            fallbackMessage:
              "Filters could not be loaded.",
          })
        );
      }
    }

    loadFilters();
  }, []);

  useEffect(() => {
    async function loadReports() {
      setIsLoading(true);
      setError("");

      try {
        const data = await getReports({
          categoryId,
          statusId,
          page,
          pageSize,
        });

        setReports(data.items);
        setTotalPages(data.totalPages);
        setTotalCount(data.totalCount);
      } catch (requestError) {
        setError(
          getErrorMessage(requestError, {
            fallbackMessage:
              "Reports could not be loaded.",
          })
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadReports();
  }, [
    categoryId,
    statusId,
    page,
    pageSize,
  ]);

  const handleCategoryChange = (event) => {
    setCategoryId(event.target.value);
    setPage(1);
  };

  const handleStatusChange = (event) => {
    setStatusId(event.target.value);
    setPage(1);
  };

  return (
    <section className="home-page">
      <header className="home-page__hero">
        <div>
          <span>Improve your city</span>

          <h1>Report local problems</h1>

          <p>
            Browse reported issues or submit a new
            report.
          </p>
        </div>

        <Link
          className="home-page__report-button"
          to="/report/new"
        >
          <Plus size={20} />
          New report
        </Link>
      </header>

      <div className="home-page__filters">
        <label>
          <span>Category</span>

          <select
            value={categoryId}
            onChange={handleCategoryChange}
          >
            <option value="">
              All categories
            </option>

            {categories.map((category) => (
              <option
                key={category.id}
                value={category.id}
              >
                {category.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          <span>Status</span>

          <select
            value={statusId}
            onChange={handleStatusChange}
          >
            <option value="">
              All statuses
            </option>

            {statuses.map((status) => (
              <option
                key={status.id}
                value={status.id}
              >
                {status.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      {!isLoading && !error && (
        <p className="home-page__count">
          {totalCount} reports found
        </p>
      )}

      {error && (
        <div
          className="home-page__error"
          role="alert"
        >
          {error}
        </div>
      )}

      {isLoading && (
        <p className="home-page__state">
          Loading reports...
        </p>
      )}

      {!isLoading &&
        !error &&
        reports.length === 0 && (
          <div className="home-page__state">
            <h2>No reports found</h2>

            <p>
              Try changing the filters or submit
              the first report.
            </p>
          </div>
        )}

      {!isLoading && reports.length > 0 && (
        <div className="report-list">
          {reports.map((report) => {
            const imageUrl = getImageUrl(
              report.primaryImage?.filePath
            );

            return (
              <article
                className="report-card"
                key={report.id}
              >
                <Link
                  className="report-card__image"
                  to={`/reports/${report.id}`}
                >
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={
                        report.title ||
                        `Report ${report.id}`
                      }
                    />
                  ) : (
                    <ImageOff size={32} />
                  )}
                </Link>

                <div className="report-card__content">
                  <div className="report-card__labels">
                    <span>
                      {report.category?.name}
                    </span>

                    <span className="report-card__status">
                      {report.status?.name}
                    </span>
                  </div>

                  <h2>
                    <Link
                      to={`/reports/${report.id}`}
                    >
                      {report.title ||
                        `Report #${report.id}`}
                    </Link>
                  </h2>

                  <p>
                    {report.description.length > 130
                      ? `${report.description.slice(
                          0,
                          130
                        )}…`
                      : report.description}
                  </p>

                  <div className="report-card__metadata">
                    <span>
                      <MapPin size={16} />

                      {report.addressFallback ||
                        "GPS location"}
                    </span>

                    <span>
                      <CalendarDays size={16} />

                      {new Date(
                        report.createdAt
                      ).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {!isLoading && totalPages > 1 && (
        <nav
          className="pagination"
          aria-label="Reports pagination"
        >
          <button
            type="button"
            disabled={page === 1}
            onClick={() =>
              setPage(
                (currentPage) =>
                  currentPage - 1
              )
            }
          >
            Previous
          </button>

          <span>
            Page {page} of {totalPages}
          </span>

          <button
            type="button"
            disabled={page === totalPages}
            onClick={() =>
              setPage(
                (currentPage) =>
                  currentPage + 1
              )
            }
          >
            Next
          </button>
        </nav>
      )}
    </section>
  );
}

export default HomePage;