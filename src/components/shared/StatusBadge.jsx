import React from "react";

function getStatusKey(status) {
  const key = status?.trim().toLowerCase().replaceAll(" ", "-");
  return ["new", "accepted", "in-progress", "resolved", "closed"].includes(key)
    ? key
    : "unknown";
}

export default function StatusBadge({ status, fallback = "Unknown status", className = "" }) {
  const label = status || fallback;
  const statusKey = getStatusKey(label);
  const classes = [
    "status-badge",
    `status-badge--${statusKey}`,
    className,
    className && !className.includes(" ") ? `${className}--${statusKey}` : "",
  ]
    .filter(Boolean)
    .join(" ");

  return <span className={classes}>{label}</span>;
}
