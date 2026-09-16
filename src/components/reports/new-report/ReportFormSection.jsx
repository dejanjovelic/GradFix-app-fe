import React from "react";

export default function ReportFormSection({ icon, title, description, children }) {
  return (
    <section className="report-form__section">
      <div className="report-form__section-heading">
        <div className="report-form__section-icon">{icon}</div>
        <div>
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
      </div>
      {children}
    </section>
  );
}
