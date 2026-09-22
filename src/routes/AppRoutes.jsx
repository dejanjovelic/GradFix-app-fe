import React, { lazy, Suspense } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import CitizenLayout from "../layouts/CitizenLayout";
import AdminLayout from "../layouts/AdminLayout";
import LoadingState from "../components/shared/LoadingState";

import "../assets/styles/global.scss";

const ReportsPage = lazy(() => import("../pages/Reports/ReportsPage"));
const MapPage = lazy(() => import("../pages/Map/MapPage"));
const LoginPage = lazy(() => import("../pages/Login/LoginPage"));
const RegisterPage = lazy(() => import("../pages/Register/RegisterPage"));
const NewReportPage = lazy(() => import("../pages/Report/NewReportPage"));
const AdminDashboardPage = lazy(() => import("../pages/Admin/AdminDashboardPage"));
const ReportDetailPage = lazy(() => import("../pages/Report/ReportDetailPage"));
const MyReportsPage = lazy(() => import("../pages/Report/MyReportsPage"));

function ReportsRedirect() {
  const { search, hash } = useLocation();
  return <Navigate to={{ pathname: "/", search, hash }} replace />;
}

function AppRoutes() {
  return (
    <Suspense fallback={<LoadingState message="Loading page…" />}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route element={<CitizenLayout />}>
          <Route path="/" element={<ReportsPage />} />
          <Route path="/reports" element={<ReportsRedirect />} />
          <Route path="/reports/:id" element={<ReportDetailPage />} />

          <Route
            path="/report/new"
            element={
              <ProtectedRoute>
                <NewReportPage />
              </ProtectedRoute>
            }
          />

          <Route path="/map" element={<MapPage />} />

          <Route
            path="/my-reports"
            element={
              <ProtectedRoute>
                <MyReportsPage />
              </ProtectedRoute>
            }
          />
        </Route>

        <Route
          element={
            <ProtectedRoute roles={["Admin"]}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/admin" element={<AdminDashboardPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default AppRoutes;
