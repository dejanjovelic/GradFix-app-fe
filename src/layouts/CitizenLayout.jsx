import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "../components/layout/Header/Header";
import Footer from "../components/layout/Footer/Footer";
import PageContainer from "../components/layout/PageContainer/PageContainer";
import "../assets/styles/civic.scss";

function CitizenLayout() {
  const { pathname } = useLocation();
  const fullWidth = ["/", "/reports", "/map"].includes(pathname);
  return (
    <div className="citizen-layout">
      <a className="skip-link" href="#main-content">Skip to content</a>
      <Header />

      <PageContainer fullWidth={fullWidth}>
        <Outlet />
      </PageContainer>

      <Footer />
    </div>
  );
}

export default CitizenLayout;
