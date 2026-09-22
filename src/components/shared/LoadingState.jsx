import React from "react";
import { LoaderCircle } from "lucide-react";

export default function LoadingState({
  message = "Loading…",
  className = "loading-state",
  spinnerClassName,
  size = 24,
}) {
  const classes = ["loading-state", className]
    .filter(Boolean)
    .filter((value, index, values) => values.indexOf(value) === index)
    .join(" ");

  return (
    <div className={classes} role="status" aria-live="polite">
      <LoaderCircle className={spinnerClassName} size={size} aria-hidden="true" />
      <p>{message}</p>
    </div>
  );
}
