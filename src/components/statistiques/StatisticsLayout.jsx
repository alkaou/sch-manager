import React, { useState } from "react";
import StatisticsSidebar from "./StatisticsSidebar.jsx";
import StatisticsMainContent from "./StatisticsMainContent.jsx";

const StatisticsLayout = ({
  theme,
  database,
  loadingData,
  refreshData,
}) => {
  const [activeStat, setActiveStat] = useState("students_stats");

  return (
    <div className="flex h-full">
      <div className="w-1/4 h-full">
        <StatisticsSidebar
          activeStat={activeStat}
          setActiveStat={setActiveStat}
          theme={theme}
        />
      </div>
      <div className="w-3/4 h-full">
        <StatisticsMainContent
          activeStat={activeStat}
          theme={theme}
          database={database}
          loadingData={loadingData}
          refreshData={refreshData}
        />
      </div>
    </div>
  );
};

export default StatisticsLayout;
