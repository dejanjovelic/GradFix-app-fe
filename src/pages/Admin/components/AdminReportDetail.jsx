import React, { useEffect, useState } from "react";
import { LoaderCircle, ImageOff } from "lucide-react";

import { updateReportStatus } from "../../../api/reportApi.js";
import { getErrorMessage } from "../../../utils/getErrorMessage";

import { getImageUrl } from "../../../utils/getImageUrl";
import LoadingState from "../../../components/shared/LoadingState";
import StatusBadge from "../../../components/shared/StatusBadge";

function AdminReportDetail({ report, statuses, isLoading, onReportUpdated }) {
  const [statusId, setStatusId] = useState("");
  const [comment, setComment] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState("");

  const imageUrl = getImageUrl(report?.images?.[0]?.filePath);

  useEffect(() => {
    if (!report) {
      setStatusId("");
      setComment("");
      return;
    }

    setStatusId(report.statusId.toString());
    setComment("");
    setError("");
  }, [report]);

  if (isLoading) {
    return <LoadingState className="admin-report-detail admin-report-detail--empty" spinnerClassName="admin-status-form__spinner" message="Loading report details..." />;
  }

  if (!report) {
    return (
      <section className="admin-report-detail admin-report-detail--empty">
        <div>
          <h2>Select a report</h2>
          <p>
            Select a report from the list to review its details and update its
            status.
          </p>
        </div>
      </section>
    );
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    const selectedStatusId = Number(statusId);

    if (!selectedStatusId) {
      setError("Please select a status.");
      return;
    }

    if (selectedStatusId === report.statusId) {
      setError("Please select a different status.");
      return;
    }

    try {
      setIsUpdating(true);

      const updatedReport = await updateReportStatus(report.id, {
        statusId: selectedStatusId,
        comment: comment.trim() || null,
      });

      setComment("");

      onReportUpdated(updatedReport);
    } catch (error) {
      setError(
        getErrorMessage(error, {
          fallbackMessage: "The report status could not be updated.",
          unauthorizedMessage: "Your session has expired. Please log in again.",
          forbiddenMessage: "You do not have permission to update reports.",
        }),
      );
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <section className="admin-report-detail">
      <div className="admin-report-detail__header">
        <div>
          <span className="admin-report-detail__eyebrow">
            Report #{report.id}
          </span>

          <h2>{report.title || "Untitled report"}</h2>
        </div>

        <StatusBadge status={report.status?.name} className="admin-report-detail__current-status" />
      </div>

      <div className="admin-report-detail__image">
        {imageUrl ? (
          <img src={imageUrl} alt={report.title || `Report ${report.id}`} />
        ) : (
          <ImageOff size={32} />
        )}
      </div>

      <div className="admin-report-detail__meta">
        <span>
          <strong>Category:</strong> {report.category?.name || "Uncategorized"}
        </span>

        <span>
          <strong>Created:</strong>{" "}
          {new Date(report.createdAt).toLocaleString()}
        </span>
      </div>

      <div className="admin-report-detail__section">
        <h3>Description</h3>
        <p>{report.description}</p>
      </div>

      {(report.addressFallback ||
        (report.latitude != null && report.longitude != null)) && (
        <div className="admin-report-detail__section">
          <h3>Location</h3>

          {report.addressFallback && <p>{report.addressFallback}</p>}

          {report.latitude != null && report.longitude != null && (
            <small>
              {report.latitude.toFixed(6)}, {report.longitude.toFixed(6)}
            </small>
          )}
        </div>
      )}

      <form className="admin-status-form" onSubmit={handleSubmit}>
        <div className="admin-status-form__header">
          <h3>Update status</h3>

          <p>
            Change the current report status and optionally leave a comment.
          </p>
        </div>

        <div className="admin-status-form__field">
          <label htmlFor="admin-report-status">New status</label>

          <select
            id="admin-report-status"
            value={statusId}
            onChange={(event) => setStatusId(event.target.value)}
            disabled={isUpdating}
          >
            {statuses.map((status) => (
              <option key={status.id} value={status.id}>
                {status.name}
              </option>
            ))}
          </select>
        </div>

        <div className="admin-status-form__field">
          <label htmlFor="admin-status-comment">
            Comment
            <span> Optional</span>
          </label>

          <textarea
            id="admin-status-comment"
            value={comment}
            maxLength={500}
            rows={4}
            placeholder="Add a note about this status change..."
            onChange={(event) => setComment(event.target.value)}
            disabled={isUpdating}
          />

          <small>{comment.length}/500</small>
        </div>

        {error && (
          <p className="admin-status-form__error" role="alert">
            {error}
          </p>
        )}

        <button
          type="submit"
          className="admin-status-form__submit"
          disabled={
            isUpdating || !statusId || Number(statusId) === report.statusId
          }
        >
          {isUpdating ? (
            <>
              <LoaderCircle className="admin-status-form__spinner" size={18} />
              Updating...
            </>
          ) : (
            "Update status"
          )}
        </button>
      </form>
    </section>
  );
}

export default AdminReportDetail;
