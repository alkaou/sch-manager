import React from "react";
import { useOutletContext } from "react-router-dom";

const StatistiquesPageContent = (props) => {
  return (
    <div className="p-4 mt-20 ml-20">
      <h1>Page Statistiques</h1>
      <p>Contenu spécifique à la page Statistiques.</p>
    </div>
  );
};

const StatistiquesPage = () => {
  const context = useOutletContext();
  return <StatistiquesPageContent {...context} />;
};

export default StatistiquesPage;
