import React from "react";

export default function FeedbackMessage({
  children,
  title,
  variant = "info",
  className = "",
  action,
}) {
  const role = variant === "error" || variant === "warning" ? "alert" : "status";
  const classes = ["feedback-message", `feedback-message--${variant}`, className]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes} role={role}>
      <div>
        {title && <strong className="feedback-message__title">{title}</strong>}
        {children}
      </div>
      {action}
    </div>
  );
}
