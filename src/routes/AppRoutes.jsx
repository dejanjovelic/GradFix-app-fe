import React from "react";
import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import CitizenLayout from "../layouts/CitizenLayout";
import AdminLayout from "../layouts/AdminLayout";
import HomePage from "../pages/Home/HomePage";
import LoginPage from "../pages/Login/LoginPage";
import RegisterPage from "../pages/Register/RegisterPage";
import NewReportPage from "../pages/Report/NewReportPage";
import AdminDashboardPage from "../pages/Admin/AdminDashboardPage";

function AppRoutes() {
  return (
    <Routes>
      
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />


      <Route element={<CitizenLayout />}>
        <Route path="/" element={<HomePage />} />

        <Route
          path="/report/new"
          element={
            <ProtectedRoute>
              <NewReportPage />
            </ProtectedRoute>
          }
        />
      </Route>


      <Route
        element={
          <ProtectedRoute>
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