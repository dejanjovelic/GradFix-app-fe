import React, { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { MapPin } from "lucide-react";

import { registerUser } from "../../api/authApi";
import { useAuth } from "../../hooks/useAuth";

import "./register-page.scss";

function RegisterPage() {
  const [serverError, setServerError] = useState("");

  const { login, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: "",
      surname: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const password = watch("password");

  if (isAuthenticated) {
    const isAdmin = user?.roles?.includes("Admin");

    return <Navigate to={isAdmin ? "/admin" : "/"} replace />;
  }

  const onSubmit = async (formData) => {
    setServerError("");

    const requestData = {
      name: formData.name.trim(),
      surname: formData.surname.trim(),
      email: formData.email.trim(),
      password: formData.password,
    };

    try {
      const response = await registerUser(requestData);

      login(response.data);

      navigate("/", { replace: true });
    } catch (error) {
      const responseData = error.response?.data;

      const message =
        responseData?.message ||
        responseData?.title ||
        (typeof responseData === "string" ? responseData : null) ||
        "Registration failed. Please try again.";

      setServerError(message);
    }
  };

  return (
    <main className="register-page">
      <section className="register-card">
        <div className="register-card__brand">
          <span className="register-card__logo" aria-hidden="true">
            <MapPin size={28} strokeWidth={2.25} />
          </span>

          <h1 className="register-card__title">Create your account</h1>

          <p className="register-card__subtitle">
            Join GradFix and help improve your city.
          </p>
        </div>

        <form
          className="register-form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          {serverError && (
            <div className="register-form__server-error" role="alert">
              {serverError}
            </div>
          )}

          <div className="register-form__row">
            <div className="register-form__field">
              <label className="register-form__label" htmlFor="name">
                First name
              </label>

              <input
                id="name"
                type="text"
                autoComplete="given-name"
                className={`register-form__input ${
                  errors.name ? "register-form__input--error" : ""
                }`}
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? "name-error" : undefined}
                {...register("name", {
                  required: "First name is required.",
                  minLength: {
                    value: 2,
                    message: "First name must contain at least 2 characters.",
                  },
                  maxLength: {
                    value: 50,
                    message: "First name cannot exceed 50 characters.",
                  },
                })}
              />

              {errors.name && (
                <p
                  id="name-error"
                  className="register-form__error"
                  role="alert"
                >
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="register-form__field">
              <label className="register-form__label" htmlFor="surname">
                Last name
              </label>

              <input
                id="surname"
                type="text"
                autoComplete="family-name"
                className={`register-form__input ${
                  errors.surname ? "register-form__input--error" : ""
                }`}
                aria-invalid={Boolean(errors.surname)}
                aria-describedby={errors.surname ? "surname-error" : undefined}
                {...register("surname", {
                  required: "Last name is required.",
                  minLength: {
                    value: 2,
                    message: "Last name must contain at least 2 characters.",
                  },
                  maxLength: {
                    value: 50,
                    message: "Last name cannot exceed 50 characters.",
                  },
                })}
              />

              {errors.surname && (
                <p
                  id="surname-error"
                  className="register-form__error"
                  role="alert"
                >
                  {errors.surname.message}
                </p>
              )}
            </div>
          </div>

          <div className="register-form__field">
            <label className="register-form__label" htmlFor="email">
              Email address
            </label>

            <input
              id="email"
              type="email"
              autoComplete="email"
              className={`register-form__input ${
                errors.email ? "register-form__input--error" : ""
              }`}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? "email-error" : undefined}
              {...register("email", {
                required: "Email address is required.",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Enter a valid email address.",
                },
              })}
            />

            {errors.email && (
              <p id="email-error" className="register-form__error" role="alert">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="register-form__field">
            <label className="register-form__label" htmlFor="password">
              Password
            </label>

            <input
              id="password"
              type="password"
              autoComplete="new-password"
              className={`register-form__input ${
                errors.password ? "register-form__input--error" : ""
              }`}
              aria-invalid={Boolean(errors.password)}
              aria-describedby={
                errors.password ? "password-error" : "password-hint"
              }
              {...register("password", {
                required: "Password is required.",
                minLength: {
                  value: 8,
                  message: "Password must contain at least 8 characters.",
                },
                validate: {
                  hasLowercase: (value) =>
                    /[a-z]/.test(value) ||
                    "Password must contain at least one lowercase letter.",

                  hasUppercase: (value) =>
                    /[A-Z]/.test(value) ||
                    "Password must contain at least one uppercase letter.",

                  hasDigit: (value) =>
                    /\d/.test(value) ||
                    "Password must contain at least one number.",

                  hasSpecialCharacter: (value) =>
                    /[^a-zA-Z0-9]/.test(value) ||
                    "Password must contain at least one special character.",
                },
              })}
            />

            {!errors.password && (
              <p id="password-hint" className="register-form__hint">
                Use at least 8 characters, including uppercase, lowercase, a
                number and a special character.
              </p>
            )}

            {errors.password && (
              <p
                id="password-error"
                className="register-form__error"
                role="alert"
              >
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="register-form__field">
            <label className="register-form__label" htmlFor="confirmPassword">
              Confirm password
            </label>

            <input
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              className={`register-form__input ${
                errors.confirmPassword ? "register-form__input--error" : ""
              }`}
              aria-invalid={Boolean(errors.confirmPassword)}
              aria-describedby={
                errors.confirmPassword ? "confirm-password-error" : undefined
              }
              {...register("confirmPassword", {
                required: "Please confirm your password.",
                validate: (value) =>
                  value === password || "Passwords do not match.",
              })}
            />

            {errors.confirmPassword && (
              <p
                id="confirm-password-error"
                className="register-form__error"
                role="alert"
              >
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <button
            className="register-form__submit"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="register-card__login">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </section>
    </main>
  );
}

export default RegisterPage;
