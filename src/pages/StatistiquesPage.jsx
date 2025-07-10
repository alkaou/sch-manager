import React from 'react';
import { useOutletContext } from 'react-router-dom';
import StatisticsLayout from '../components/statistiques/StatisticsLayout.jsx';

const StatistiquesPage = () => {
  const { theme, app_bg_color, text_color } = useOutletContext();

  return (
    <div
      style={{ marginLeft: "7%" }}
      className={`h-screen ${app_bg_color} ${text_color} pt-20 pr-4`}
    >
      <div className="h-[calc(100vh-100px)]">
        <StatisticsLayout theme={theme} />
      </div>
    </div>
  );
};


export default StatistiquesPage;
