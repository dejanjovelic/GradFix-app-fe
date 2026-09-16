import React, { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

import { registerUser } from "../../api/authApi";
import { useAuth } from "../../hooks/useAuth";
import { getErrorMessage } from "../../utils/getErrorMessage";
import AuthCard from "../../components/auth/AuthCard";
import AuthField from "../../components/auth/AuthField";
import AuthSubmitButton from "../../components/auth/AuthSubmitButton";
import FeedbackMessage from "../../components/shared/FeedbackMessage";

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
    defaultValues: { name: "", surname: "", email: "", password: "", confirmPassword: "" },
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
      setServerError(
        getErrorMessage(error, {
          fallbackMessage: "Registration failed. Please try again.",
          unauthorizedMessage: "Registration could not be completed.",
        }),
      );
    }
  };

  return (
    <AuthCard
      variant="register"
      title="Create your account"
      subtitle="Join GradFix and help improve your city."
      footer={<p>Already have an account? <Link to="/login">Log in</Link></p>}
    >
      <form className="auth-form" onSubmit={handleSubmit(onSubmit)} noValidate>
        {serverError && (
          <FeedbackMessage variant="error" className="auth-form__server-error">
            {serverError}
          </FeedbackMessage>
        )}

        <div className="auth-form__row">
          <AuthField
            id="name"
            label="First name"
            autoComplete="given-name"
            error={errors.name?.message}
            registration={register("name", {
              required: "First name is required.",
              minLength: { value: 2, message: "First name must contain at least 2 characters." },
              maxLength: { value: 50, message: "First name cannot exceed 50 characters." },
            })}
          />
          <AuthField
            id="surname"
            label="Last name"
            autoComplete="family-name"
            error={errors.surname?.message}
            registration={register("surname", {
              required: "Last name is required.",
              minLength: { value: 2, message: "Last name must contain at least 2 characters." },
              maxLength: { value: 50, message: "Last name cannot exceed 50 characters." },
            })}
          />
        </div>

        <AuthField
          id="email"
          label="Email address"
          type="email"
          autoComplete="email"
          error={errors.email?.message}
          registration={register("email", {
            required: "Email address is required.",
            pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Enter a valid email address." },
          })}
        />
        <AuthField
          id="password"
          label="Password"
          type="password"
          autoComplete="new-password"
          error={errors.password?.message}
          hint="Use at least 8 characters, including uppercase, lowercase, a number and a special character."
          registration={register("password", {
            required: "Password is required.",
            minLength: { value: 8, message: "Password must contain at least 8 characters." },
            validate: {
              hasLowercase: (value) => /[a-z]/.test(value) || "Password must contain at least one lowercase letter.",
              hasUppercase: (value) => /[A-Z]/.test(value) || "Password must contain at least one uppercase letter.",
              hasDigit: (value) => /\d/.test(value) || "Password must contain at least one number.",
              hasSpecialCharacter: (value) => /[^a-zA-Z0-9]/.test(value) || "Password must contain at least one special character.",
            },
          })}
        />
        <AuthField
          id="confirmPassword"
          label="Confirm password"
          type="password"
          autoComplete="new-password"
          error={errors.confirmPassword?.message}
          registration={register("confirmPassword", {
            required: "Please confirm your password.",
            validate: (value) => value === password || "Passwords do not match.",
          })}
        />
        <AuthSubmitButton
          isSubmitting={isSubmitting}
          idleText="Create account"
          submittingText="Creating account..."
        />
      </form>
    </AuthCard>
  );
}

export default RegisterPage;
