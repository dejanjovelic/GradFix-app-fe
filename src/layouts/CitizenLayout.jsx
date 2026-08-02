import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/layout/Header/Header";
import BottomNavigation from "../components/layout/BottomNavigation/BottomNavigation";
import PageContainer from "../components/layout/PageContainer/PageContainer";

function CitizenLayout() {
  return (
    <>
      <Header />

      <PageContainer>
        <Outlet />
      </PageContainer>

      <BottomNavigation />
    </>
  );
}

export default CitizenLayout;