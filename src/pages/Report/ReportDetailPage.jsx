import React, { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { ArrowLeft, CalendarDays, LoaderCircle, MapPin } from "lucide-react";

import { getReportById } from "../../api/reportApi";

import "./report-detail-page.scss";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

function getImageUrl(filePath) {
  if (!filePath) {
    return "";
  }

  if (filePath.startsWith("http://") || filePath.startsWith("https://")) {
    return filePath;
  }

  return `${backendUrl}${filePath}`;
}

function formatDate(date) {
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
}

function ReportDetailPage() {
  const { id } = useParams();
  const location = useLocation();

  const [report, setReport] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const successMessage = location.state?.successMessage;

  useEffect(() => {
    async function loadReport() {
      setIsLoading(true);
      setError("");

      try {
        const data = await getReportById(id);
        setReport(data);
      } catch (error) {
        setError(
          getErrorMessage(error, {
            fallbackMessage: "The report could not be loaded.",
            notFoundMessage: "This report does not exist.",
          }),
        );

        if (requestError.response?.status === 404) {
          setError("This report does not exist.");
        } else {
          setError("The report could not be loaded. Please try again.");
        }
      } finally {
        setIsLoading(false);
      }
    }

    loadReport();
  }, [id]);

  if (isLoading) {
    return (
      <div className="report-detail-state">
        <LoaderCircle className="report-detail-state__spinner" size={32} />

        <p>Loading report...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="report-detail-state">
        <h1>Report unavailable</h1>
        <p>{error}</p>

        <Link to="/">Return home</Link>
      </div>
    );
  }

  return (
    <article className="report-detail">
      <Link className="report-detail__back" to="/">
        <ArrowLeft size={18} />
        Back to reports
      </Link>

      {successMessage && (
        <div className="report-detail__success" role="status">
          {successMessage}
        </div>
      )}

      <header className="report-detail__header">
        <div>
          <span className="report-detail__category">
            {report.category?.name ?? "Uncategorized"}
          </span>

          <h1>{report.title || `Report #${report.id}`}</h1>
        </div>

        <span className="report-detail__status">
          {report.status?.name ?? "New"}
        </span>
      </header>

      {report.images?.length > 0 && (
        <section className="report-detail__images" aria-label="Report photos">
          {report.images
            .slice()
            .sort((first, second) => first.order - second.order)
            .map((image, index) => (
              <img
                key={image.id ?? image.filePath}
                src={getImageUrl(image.filePath)}
                alt={`Photo ${index + 1} for ${
                  report.title || `report ${report.id}`
                }`}
              />
            ))}
        </section>
      )}

      <div className="report-detail__grid">
        <section className="report-detail__card">
          <h2>Description</h2>

          <p className="report-detail__description">{report.description}</p>
        </section>

        <aside className="report-detail__card">
          <h2>Report information</h2>

          <dl className="report-detail__metadata">
            <div>
              <dt>
                <CalendarDays size={18} />
                Submitted
              </dt>
              <dd>{formatDate(report.createdAt)}</dd>
            </div>

            <div>
              <dt>
                <MapPin size={18} />
                Location
              </dt>

              <dd>
                {report.addressFallback ||
                  (report.latitude && report.longitude
                    ? `${report.latitude}, ${report.longitude}`
                    : "Location unavailable")}
              </dd>
            </div>
          </dl>
        </aside>
      </div>

      {report.statusHistory?.length > 0 && (
        <section className="report-detail__card">
          <h2>Status history</h2>

          <ol className="report-detail__timeline">
            {report.statusHistory
              .slice()
              .sort(
                (first, second) =>
                  new Date(first.changedAt) - new Date(second.changedAt),
              )
              .map((history) => (
                <li key={history.id}>
                  <strong>{history.newStatus?.name}</strong>

                  <span>{formatDate(history.changedAt)}</span>

                  {history.comment && <p>{history.comment}</p>}
                </li>
              ))}
          </ol>
        </section>
      )}
    </article>
  );
}

export default ReportDetailPage;
