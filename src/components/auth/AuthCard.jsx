import React from "react";
import { MapPin } from "lucide-react";
import "./auth.scss";

export default function AuthCard({
  title,
  subtitle,
  variant,
  children,
  footer,
}) {
  return (
    <main className="auth-page">
      <section className={`auth-card auth-card--${variant}`}>
        <div className="auth-card__brand">
          <span className="auth-card__logo" aria-hidden="true">
            <MapPin size={28} strokeWidth={2.25} />
          </span>
          <h1 className="auth-card__title">{title}</h1>
          <p className="auth-card__subtitle">{subtitle}</p>
        </div>
        {children}
        {footer && <div className="auth-card__footer">{footer}</div>}
      </section>
    </main>
  );
}
