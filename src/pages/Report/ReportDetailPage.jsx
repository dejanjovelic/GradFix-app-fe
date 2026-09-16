import React, { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { ArrowLeft, CalendarDays, MapPin } from "lucide-react";

import { getReportById } from "../../api/reportApi";
import { getErrorMessage } from "../../utils/getErrorMessage";
import { formatDateTime } from "../../utils/formatDateTime";
import { getImageUrl } from "../../utils/getImageUrl";
import LoadingState from "../../components/shared/LoadingState";
import StatusBadge from "../../components/shared/StatusBadge";

import "./report-detail-page.scss";

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

        if (error.response?.status === 404) {
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
    return <LoadingState className="report-detail-state" spinnerClassName="report-detail-state__spinner" size={32} message="Loading report..." />;
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

        <StatusBadge status={report.status?.name} fallback="New" className="report-detail__status" />
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
              <dd>{formatDateTime(report.createdAt)}</dd>
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
                <li className="report-detail__timeline-item" key={history.id}>
                  <div className="report-detail__timeline-marker" />

                  <div className="report-detail__timeline-content">
                    <div className="report-detail__timeline-header">
                      <strong>
                        {history.newStatus?.name ?? "Status changed"}
                      </strong>

                      <time dateTime={history.changedAt}>
                        {formatDateTime(history.changedAt)}
                      </time>
                    </div>

                    {history.oldStatus?.name && (
                      <p className="report-detail__timeline-transition">
                        {history.oldStatus.name}
                        {" → "}
                        {history.newStatus?.name}
                      </p>
                    )}

                    {history.comment && (
                      <p className="report-detail__timeline-comment">
                        {history.comment}
                      </p>
                    )}

                    {history.changedByUser && (
                      <span className="report-detail__timeline-user">
                        Changed by{" "}
                        {history.changedByUser.name ||
                          history.changedByUser.email ||
                          "administrator"}
                      </span>
                    )}
                  </div>
                </li>
              ))}
          </ol>
        </section>
      )}
    </article>
  );
}

export default ReportDetailPage;
