import React from "react";

export default function AuthSubmitButton({
  isSubmitting,
  idleText,
  submittingText,
}) {
  return (
    <button className="auth-form__submit" type="submit" disabled={isSubmitting}>
      {isSubmitting ? submittingText : idleText}
    </button>
  );
}
