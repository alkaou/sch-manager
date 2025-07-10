import React from "react";
import { useOutletContext } from "react-router-dom";
import StatisticsLayout from "../components/statistiques/StatisticsLayout.jsx";

const StatistiquesPage = () => {
  const {
    theme,
    app_bg_color,
    text_color,
    database,
    loadingData,
    refreshData,
  } = useOutletContext();

  return (
    <div
      style={{ marginLeft: "4%", height: "88vh", marginTop: "6%" }}
      className={`h-screen overflow-hidden ${app_bg_color} ${text_color}`}
    >
      <div className="h-full">
        <StatisticsLayout
          theme={theme}
          database={database}
          loadingData={loadingData}
          refreshData={refreshData}
        />
      </div>
    </div>
  );
};

export default StatistiquesPage;
