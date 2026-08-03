import React, { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

import { loginUser, loginWithGoogle } from "../../api/authApi";
import { useAuth } from "../../hooks/useAuth";

import "./login-page.scss";
import { MapPin } from "lucide-react";

import { GoogleLogin } from "@react-oauth/google";

function LoginPage() {
  const [serverError, setServerError] = useState("");

  const { login, isAuthenticated, user } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  if (isAuthenticated) {
    const isAdmin = user?.roles?.includes("Admin");

    return <Navigate to={isAdmin ? "/admin" : "/"} replace />;
  }

  const onSubmit = async (formData) => {
    setServerError("");

    try {
      const response = await loginUser(formData);

      login(response.data);

      const isAdmin = response.data.profile?.roles?.includes("Admin");

      const requestedPage = location.state?.from?.pathname;

      if (requestedPage) {
        navigate(requestedPage, { replace: true });
        return;
      }

      navigate(isAdmin ? "/admin" : "/", { replace: true });
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.title ||
        "Invalid email or password.";

      setServerError(message);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setServerError("");

    if (!credentialResponse.credential) {
      setServerError("Google did not return a valid credential.");
      return;
    }

    try {
      const response = await loginWithGoogle({
        idToken: credentialResponse.credential,
      });

      login(response.data);

      const isAdmin = response.data.profile?.roles?.includes("Admin");

      const requestedPage = location.state?.from?.pathname;

      if (requestedPage) {
        navigate(requestedPage, { replace: true });
        return;
      }

      navigate(isAdmin ? "/admin" : "/", {
        replace: true,
      });
    } catch (error) {
      const responseData = error.response?.data;

      const message =
        responseData?.message ||
        responseData?.title ||
        (typeof responseData === "string" ? responseData : null) ||
        "Google login failed. Please try again.";

      setServerError(message);
    }
  };

  const handleGoogleError = () => {
    setServerError("Google login was unsuccessful. Please try again.");
  };

  return (
    <main className="login-page">
      <section className="login-card">
        <div className="login-card__brand">
          <span className="login-card__logo" aria-hidden="true">
            <MapPin />
          </span>

          <h1 className="login-card__title">GradFix</h1>

          <p className="login-card__subtitle">
            Report problems in your city and follow their resolution.
          </p>
        </div>

        <form
          className="login-form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          {serverError && (
            <div className="login-form__server-error" role="alert">
              {serverError}
            </div>
          )}

          <div className="login-form__field">
            <label className="login-form__label" htmlFor="email">
              Email address
            </label>

            <input
              id="email"
              type="email"
              autoComplete="email"
              className={`login-form__input ${
                errors.email ? "login-form__input--error" : ""
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
              <p id="email-error" className="login-form__error" role="alert">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="login-form__field">
            <label className="login-form__label" htmlFor="password">
              Password
            </label>

            <input
              id="password"
              type="password"
              autoComplete="current-password"
              className={`login-form__input ${
                errors.password ? "login-form__input--error" : ""
              }`}
              aria-invalid={Boolean(errors.password)}
              aria-describedby={errors.password ? "password-error" : undefined}
              {...register("password", {
                required: "Password is required.",
              })}
            />

            {errors.password && (
              <p id="password-error" className="login-form__error" role="alert">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            className="login-form__submit"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Logging in..." : "Log in"}
          </button>
        </form>
        
        <div className="login-card__divider">
          <span>or</span>
        </div>

        <div className="login-card__google">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            useOneTap={false}
            theme="outline"
            size="large"
            text="continue_with"
            shape="rectangular"
          />
        </div>

        <p className="login-card__register">
          Don&apos;t have an account?{" "}
          <Link to="/register">Create an account</Link>
        </p>
      </section>
    </main>
  );
}

export default LoginPage;
