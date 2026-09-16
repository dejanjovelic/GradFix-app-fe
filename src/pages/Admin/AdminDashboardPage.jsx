import React, { useEffect, useState } from "react";

import { getReports, getReportById } from "../../api/reportApi";
import { getCategories } from "../../api/categoryApi";
import { getReportStatuses } from "../../api/reportStatusApi";
import { getErrorMessage } from "../../utils/getErrorMessage";

import AdminReportListItem from "../../components/reports/AdminReportListItem";
import AdminReportDetail from "./components/AdminReportDetail";
import PageHeader from "../../components/shared/PageHeader";
import Pagination from "../../components/shared/Pagination";

import "./admin-dashboard-page.scss";

const DEFAULT_PAGE_SIZE = 6;

function AdminDashboardPage() {
  const [reports, setReports] = useState([]);
  const [categories, setCategories] = useState([]);
  const [statuses, setStatuses] = useState([]);

  const [selectedReport, setSelectedReport] = useState(null);

  const [categoryId, setCategoryId] = useState("");
  const [statusId, setStatusId] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const [page, setPage] = useState(1);
  const [pageSize] = useState(DEFAULT_PAGE_SIZE);

  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [isLoadingSelectedReport, setIsLoadingSelectedReport] = useState(false);

  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");

  useEffect(() => {
    async function loadLookups() {
      try {
        const [categoryData, statusData] = await Promise.all([
          getCategories(),
          getReportStatuses(),
        ]);

        setCategories(categoryData);
        setStatuses(statusData);
      } catch (error) {
        setError(
          getErrorMessage(error, {
            fallbackMessage: "Report filters could not be loaded.",
          }),
        );
      }
    }

    loadLookups();
  }, []);

  const loadReports = async () => {
    try {
      setIsLoading(true);
      setError("");

      const data = await getReports({
        page,
        pageSize,
        categoryId: categoryId || undefined,
        statusId: statusId || undefined,
        searchQuery: debouncedSearchQuery || undefined,
      });

      setReports(data.items ?? []);
      setTotalPages(data.totalPages ?? 1);
      setTotalCount(data.totalCount ?? 0);
    } catch (error) {
      setError(
        getErrorMessage(error, {
          fallbackMessage: "Reports could not be loaded.",
        }),
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, [page, categoryId, statusId, debouncedSearchQuery]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedSearchQuery(searchQuery.trim());

      setPage(1);
    }, 400);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [searchQuery]);

  const handleSelectReport = async (reportId) => {
    try {
      setIsLoadingSelectedReport(true);
      setError("");

      const report = await getReportById(reportId);

      setSelectedReport(report);
    } catch (error) {
      setError(
        getErrorMessage(error, {
          fallbackMessage: "The selected report could not be loaded.",
        }),
      );
    } finally {
      setIsLoadingSelectedReport(false);
    }
  };

  const handleReportUpdated = async (updatedReport) => {
    setSelectedReport(updatedReport);

    await loadReports();
  };

  const handleCategoryChange = (event) => {
    setCategoryId(event.target.value);
    setPage(1);
    setSelectedReport(null);
  };

  const handleStatusChange = (event) => {
    setStatusId(event.target.value);
    setPage(1);
    setSelectedReport(null);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setSelectedReport(null);
  };

  return (
    <section className="admin-dashboard">
      <PageHeader
        className="admin-dashboard__header"
        eyebrowClassName="admin-dashboard__eyebrow"
        eyebrow="Administration"
        title="Reports management"
        description="Review citizen reports and update their status."
      />

      <div className="admin-dashboard__layout">
        <aside className="admin-reports-panel">
          <div className="admin-reports-panel__filters">
            <div className="admin-reports-panel__search">
              <label htmlFor="admin-search">Search</label>

              <input
                id="admin-search"
                type="search"
                value={searchQuery}
                placeholder="By title, description or address..."
                onChange={handleSearchChange}
              />
            </div>

            <div className="admin-reports-panel__filter-row">
              <div>
                <label htmlFor="admin-category">Category</label>

                <select
                  id="admin-category"
                  value={categoryId}
                  onChange={handleCategoryChange}
                >
                  <option value="">All categories</option>

                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="admin-status">Status</label>

                <select
                  id="admin-status"
                  value={statusId}
                  onChange={handleStatusChange}
                >
                  <option value="">All statuses</option>

                  {statuses.map((status) => (
                    <option key={status.id} value={status.id}>
                      {status.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="admin-reports-panel__list">
            {isLoading ? (
              <p>Loading reports...</p>
            ) : error ? (
              <p className="admin-reports-panel__error" role="alert">
                {error}
              </p>
            ) : reports.length === 0 ? (
              <p>No reports found.</p>
            ) : (
              reports.map((report) => (
                <AdminReportListItem
                  key={report.id}
                  report={report}
                  isSelected={selectedReport?.id === report.id}
                  onSelect={handleSelectReport}
                />
              ))
            )}
          </div>

          {totalPages > 1 && (
            <Pagination
              className="admin-reports-panel__pagination"
              ariaLabel="Admin reports pagination"
              currentPage={page}
              totalPages={totalPages}
              onPrevious={() => setPage((current) => current - 1)}
              onNext={() => setPage((current) => current + 1)}
            />
          )}
        </aside>

        <AdminReportDetail
          report={selectedReport}
          statuses={statuses}
          isLoading={isLoadingSelectedReport}
          onReportUpdated={handleReportUpdated}
        />
      </div>
    </section>
  );
}

export default AdminDashboardPage;
