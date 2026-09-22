import React from "react";
import "./page-container.scss";

function PageContainer({ children, fullWidth = false }) {
  return (
    <main
      id="main-content"
      className={`page-container${fullWidth ? " page-container--full" : ""}`}
    >
      {children}
    </main>
  );
}

export default PageContainer;
