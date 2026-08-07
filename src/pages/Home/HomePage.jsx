import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  List,
  Map as MapIcon,
  Plus,
} from "lucide-react";

import { getCategories } from "../../api/categoryApi";
import {
  getMapReports,
  getReportById,
  getReports,
} from "../../api/reportApi";
import { getReportStatuses } from "../../api/reportStatusApi";

import { getErrorMessage } from "../../utils/getErrorMessage";

import PublicReportsSidebar from "./components/PublicReportsSidebar";
import ReportsMap from "./components/ReportsMap";
import SelectedReportPanel from "./components/SelectedReportPanel";

import "./home-page.scss";

const DEFAULT_PAGE_SIZE = 6;

function HomePage() {
 
  const [categories, setCategories] = useState([]);
  const [statuses, setStatuses] = useState([]);

  const [categoryId, setCategoryId] = useState("");
  const [statusId, setStatusId] = useState("");

  const [filtersError, setFiltersError] = useState("");

  const [reports, setReports] = useState([]);

  const [page, setPage] = useState(1);
  const [pageSize] = useState(DEFAULT_PAGE_SIZE);

  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [isListLoading, setIsListLoading] =
    useState(true);

  const [listError, setListError] = useState("");

  const [mapReports, setMapReports] = useState([]);

  const [isMapLoading, setIsMapLoading] =
    useState(true);

  const [mapError, setMapError] = useState("");


  const [selectedReportId, setSelectedReportId] =
    useState(null);

  const [selectedReport, setSelectedReport] =
    useState(null);

  const [
    isSelectedReportLoading,
    setIsSelectedReportLoading,
  ] = useState(false);

  const [
    selectedReportError,
    setSelectedReportError,
  ] = useState("");

  /*
   * Mobile view:
   * - "list" shows sidebar/details
   * - "map" shows Leaflet map
   */
  const [mobileView, setMobileView] =
    useState("list");

  /*
   * Load categories and report statuses once.
   *
   * Promise.allSettled allows categories to load
   * even if statuses fail, and vice versa.
   */
  useEffect(() => {
    async function loadFilterOptions() {
      setFiltersError("");

      const [categoriesResult, statusesResult] =
        await Promise.allSettled([
          getCategories(),
          getReportStatuses(),
        ]);

      if (categoriesResult.status === "fulfilled") {
        setCategories(categoriesResult.value ?? []);
      } else {
        console.error(
          "Could not load categories:",
          categoriesResult.reason,
        );
      }

      if (statusesResult.status === "fulfilled") {
        setStatuses(statusesResult.value ?? []);
      } else {
        console.error(
          "Could not load report statuses:",
          statusesResult.reason,
        );
      }

      if (
        categoriesResult.status === "rejected" &&
        statusesResult.status === "rejected"
      ) {
        setFiltersError(
          "Report filters could not be loaded.",
        );
      }
    }

    loadFilterOptions();
  }, []);

  /*
   * Load the current page of reports for the sidebar.
   *
   * Page changes reload only the sidebar list.
   * Filter changes also reload the sidebar list.
   */
  useEffect(() => {
    let isCancelled = false;

    async function loadReportsList() {
      setIsListLoading(true);
      setListError("");

      try {
        const data = await getReports({
          page,
          pageSize,
          categoryId: categoryId || undefined,
          statusId: statusId || undefined,
          searchQuery: searchQuery.trim() || undefined,
        });

        if (isCancelled) {
          return;
        }

        const loadedReports = data?.items ?? [];
        const loadedTotalCount =
          data?.totalCount ?? 0;
        const loadedTotalPages =
          data?.totalPages ?? 0;

        setReports(loadedReports);
        setTotalCount(loadedTotalCount);
        setTotalPages(loadedTotalPages);

        /*
         * A report might disappear from the current
         * page after filtering or deleting data.
         *
         * If the requested page is now outside the
         * available range, return to the last page.
         */
        if (
          loadedTotalPages > 0 &&
          page > loadedTotalPages
        ) {
          setPage(loadedTotalPages);
        }
      } catch (error) {
        if (isCancelled) {
          return;
        }

        setReports([]);
        setTotalCount(0);
        setTotalPages(0);

        setListError(
          getErrorMessage(error, {
            fallbackMessage:
              "Reports could not be loaded.",
          }),
        );
      } finally {
        if (!isCancelled) {
          setIsListLoading(false);
        }
      }
    }

    loadReportsList();

    return () => {
      isCancelled = true;
    };
  }, [
    categoryId,
    statusId,
    page,
    pageSize,
  ]);

  /*
   * Load all filtered report locations for the map.
   *
   * Pagination is intentionally not included here.
   * The map should show all reports that match the
   * selected filters, not only the current page.
   */
  useEffect(() => {
    let isCancelled = false;

    async function loadReportMarkers() {
      setIsMapLoading(true);
      setMapError("");

      try {
        const data = await getMapReports({
          categoryId: categoryId || undefined,
          statusId: statusId || undefined,
        });
        
        if (!isCancelled) {
          setMapReports(data ?? []);
        }
      } catch (error) {
        if (isCancelled) {
          return;
        }

        setMapReports([]);

        setMapError(
          getErrorMessage(error, {
            fallbackMessage:
              "Report locations could not be loaded.",
          }),
        );
      } finally {
        if (!isCancelled) {
          setIsMapLoading(false);
        }
      }
    }

    loadReportMarkers();

    return () => {
      isCancelled = true;
    };
  }, [categoryId, statusId]);

  function clearSelectedReport() {
    setSelectedReportId(null);
    setSelectedReport(null);
    setSelectedReportError("");
    setIsSelectedReportLoading(false);
  }

  function handleCategoryChange(value) {
    setCategoryId(value);
    setPage(1);
    clearSelectedReport();
  }

  function handleStatusChange(value) {
    setStatusId(value);
    setPage(1);
    clearSelectedReport();
  }

  function handlePageChange(nextPage) {
    if (
      nextPage < 1 ||
      (totalPages > 0 && nextPage > totalPages)
    ) {
      return;
    }

    setPage(nextPage);
  }

  /*
   * Used by both:
   * - report item click
   * - map marker click
   */
  async function handleReportSelect(reportId) {
    if (
      selectedReportId === reportId &&
      selectedReport
    ) {
      setMobileView("list");
      return;
    }

    setSelectedReportId(reportId);
    setSelectedReport(null);
    setSelectedReportError("");
    setIsSelectedReportLoading(true);

    /*
     * On mobile, selecting a marker opens the report
     * details in the list/details view.
     */
    setMobileView("list");

    try {
      const data = await getReportById(reportId);

      setSelectedReport(data);
    } catch (error) {
      setSelectedReportError(
        getErrorMessage(error, {
          notFoundMessage:
            "This report no longer exists.",
          fallbackMessage:
            "The report details could not be loaded.",
        }),
      );
    } finally {
      setIsSelectedReportLoading(false);
    }
  }

  function handleBackToReports() {
    clearSelectedReport();
  }

  const showSelectedReportPanel =
    selectedReportId !== null;

  return (
    <section className="public-reports-page">
      <header className="public-reports-page__header">
        <div>
          <span className="public-reports-page__eyebrow">
            Improve your city
          </span>

          <h1>Report local problems</h1>

          <p>
            Browse reported issues on the map or
            submit a new problem in your area.
          </p>
        </div>

        <Link
          className="public-reports-page__new-report"
          to="/report/new"
        >
          <Plus size={20} />
          New report
        </Link>
      </header>

      {filtersError && (
        <div
          className="public-reports-page__error"
          role="alert"
        >
          {filtersError}
        </div>
      )}

      <div
        className="public-reports-page__mobile-switch"
        aria-label="Choose reports view"
      >
        <button
          type="button"
          className={
            mobileView === "list"
              ? "public-reports-page__mobile-switch-button public-reports-page__mobile-switch-button--active"
              : "public-reports-page__mobile-switch-button"
          }
          onClick={() => setMobileView("list")}
        >
          <List size={18} />
          List
        </button>

        <button
          type="button"
          className={
            mobileView === "map"
              ? "public-reports-page__mobile-switch-button public-reports-page__mobile-switch-button--active"
              : "public-reports-page__mobile-switch-button"
          }
          onClick={() => setMobileView("map")}
        >
          <MapIcon size={18} />
          Map
        </button>
      </div>

      <div className="public-reports-workspace">
        <aside
          className={`public-reports-workspace__sidebar ${
            mobileView !== "list"
              ? "public-reports-workspace__sidebar--hidden"
              : ""
          }`}
        >
          {showSelectedReportPanel ? (
            <SelectedReportPanel
              selectedReport={selectedReport}
              isLoading={isSelectedReportLoading}
              error={selectedReportError}
              onBack={handleBackToReports}
            />
          ) : (
            <PublicReportsSidebar
              reports={reports}
              categories={categories}
              statuses={statuses}
              categoryId={categoryId}
              statusId={statusId}
              page={page}
              totalPages={totalPages}
              totalCount={totalCount}
              selectedReportId={selectedReportId}
              isLoading={isListLoading}
              error={listError}
              onCategoryChange={
                handleCategoryChange
              }
              onStatusChange={handleStatusChange}
              onPageChange={handlePageChange}
              onReportSelect={handleReportSelect}
            />
          )}
        </aside>

        <main
          className={`public-reports-workspace__map ${
            mobileView !== "map"
              ? "public-reports-workspace__map--hidden"
              : ""
          }`}
        >
          <ReportsMap
            reports={mapReports}
            selectedReportId={selectedReportId}
            isLoading={isMapLoading}
            error={mapError}
            onReportSelect={handleReportSelect}
          />
        </main>
      </div>
    </section>
  );
}

export default HomePage;