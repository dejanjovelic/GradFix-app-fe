import React from "react";
import "./page-container.scss";

function PageContainer({ children }) {
  return <main className="page-container">{children}</main>;
}

export default PageContainer;