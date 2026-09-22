import React, { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

import { loginUser, loginWithGoogle } from "../../api/authApi";
import { useAuth } from "../../hooks/useAuth";

import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { getErrorMessage } from "../../utils/getErrorMessage";
import AuthCard from "../../components/auth/AuthCard";
import FeedbackMessage from "../../components/shared/FeedbackMessage";

function LoginPage() {
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
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
      setServerError(
        getErrorMessage(error, {
          fallbackMessage: "Login failed. Please try again.",
          unauthorizedMessage: "Email or password is incorrect.",
        }),
      );
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
      setServerError(
        getErrorMessage(error, {
          fallbackMessage: "Google login failed. Please try again.",
          unauthorizedMessage: "Google authentication was unsuccessful.",
        }),
      );
    }
  };

  const handleGoogleError = () => {
    setServerError("Google login was unsuccessful. Please try again.");
  };

  return (
    <AuthCard
      variant="login"
      title="GradFix"
      subtitle="Report problems in your city and follow their resolution."
      footer={<p>Don&apos;t have an account? <Link to="/register">Create an account</Link></p>}
    >
        <form
          className="auth-form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          {serverError && (
            <FeedbackMessage variant="error" className="auth-form__server-error">
              {serverError}
            </FeedbackMessage>
          )}
          <div className="auth-form__field">
            <label className="auth-form__label" htmlFor="email">Email address</label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              className={`auth-form__input${errors.email ? " auth-form__input--error" : ""}`}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? "email-error" : undefined}
              {...register("email", {
                required: "Email address is required.",
                pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Enter a valid email address." },
              })}
            />
            {errors.email && <p id="email-error" className="auth-form__error" role="alert">{errors.email.message}</p>}
          </div>
          <div className="auth-form__field">
            <label className="auth-form__label" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              className={`auth-form__input${errors.password ? " auth-form__input--error" : ""}`}
              aria-invalid={Boolean(errors.password)}
              aria-describedby={errors.password ? "password-error" : undefined}
              {...register("password", { required: "Password is required." })}
            />
            {errors.password && <p id="password-error" className="auth-form__error" role="alert">{errors.password.message}</p>}
          </div>
          <button className="auth-form__submit" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Logging in..." : "Log in"}
          </button>
        </form>

        <div className="auth-card__divider">
          <span>or</span>
        </div>
        {googleClientId ? (
          <GoogleOAuthProvider clientId={googleClientId}>
            <div className="auth-card__google">
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
          </GoogleOAuthProvider>
        ) : (
          <FeedbackMessage variant="warning" className="auth-form__server-error">
            Google sign-in is temporarily unavailable.
          </FeedbackMessage>
        )}
    </AuthCard>
  );
}

export default LoginPage;
