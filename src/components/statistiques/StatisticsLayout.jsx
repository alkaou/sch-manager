import React, { useState } from "react";
import StatisticsSidebar from "./StatisticsSidebar.jsx";
import StatisticsMainContent from "./StatisticsMainContent.jsx";

const StatisticsLayout = ({
  theme,
  database,
  loadingData,
  refreshData,
  app_bg_color,
  text_color,
}) => {
  const [activeStat, setActiveStat] = useState("expense_stats"); // doit être vide par défaut.

  return (
    <div className="flex h-full">
      <div className="w-1/4 h-full">
        <StatisticsSidebar
          activeStat={activeStat}
          setActiveStat={setActiveStat}
          theme={theme}
          app_bg_color={app_bg_color}
          text_color={text_color}
        />
      </div>
      <div className="w-3/4 h-full">
        <StatisticsMainContent
          activeStat={activeStat}
          theme={theme}
          app_bg_color={app_bg_color}
          text_color={text_color}
          database={database}
          loadingData={loadingData}
          refreshData={refreshData}
        />
      </div>
    </div>
  );
};

export default StatisticsLayout;
