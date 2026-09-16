import React from "react";

export default function AuthField({
  id,
  label,
  type = "text",
  autoComplete,
  registration,
  error,
  hint,
}) {
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;
  const describedBy = error ? errorId : hint ? hintId : undefined;

  return (
    <div className="auth-form__field">
      <label className="auth-form__label" htmlFor={id}>{label}</label>
      <input
        id={id}
        type={type}
        autoComplete={autoComplete}
        className={`auth-form__input${error ? " auth-form__input--error" : ""}`}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy}
        {...registration}
      />
      {hint && !error && <p id={hintId} className="auth-form__hint">{hint}</p>}
      {error && <p id={errorId} className="auth-form__error" role="alert">{error}</p>}
    </div>
  );
}
