import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/layout/Header/Header";
import Sidebar from "../components/layout/Sidebar/Sidebar";
import PageContainer from "../components/layout/PageContainer/PageContainer";

function AdminLayout() {
  return (
    <div className="admin-layout">
      <Sidebar />

      <div className="admin-layout__content">
        <Header />

        <PageContainer>
          <Outlet />
        </PageContainer>
      </div>
    </div>
  );
}

export default AdminLayout;