import React from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import CitizenLayout from "../layouts/CitizenLayout";
import AdminLayout from "../layouts/AdminLayout";
import ReportsPage from "../pages/Reports/ReportsPage";
import MapPage from "../pages/Map/MapPage";
import LoginPage from "../pages/Login/LoginPage";
import RegisterPage from "../pages/Register/RegisterPage";
import NewReportPage from "../pages/Report/NewReportPage";
import AdminDashboardPage from "../pages/Admin/AdminDashboardPage";
import ReportDetailPage from "../pages/Report/ReportDetailPage";
import MyReportsPage from "../pages/Report/MyReportsPage";

import "../assets/styles/global.scss";



function ReportsRedirect() {
  const { search, hash } = useLocation();
  return <Navigate to={{ pathname: "/", search, hash }} replace />;
}

function AppRoutes() {
  return (
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
  );
}

export default AppRoutes;
