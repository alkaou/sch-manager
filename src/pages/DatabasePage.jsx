import React from "react";
import { useOutletContext } from "react-router-dom";

const DatabasePageContent = (props) => {
  return (
    <div className="p-4 mt-20 ml-20">
      <h1>Page Base de donnée</h1>
      <p>Contenu spécifique à la page Base de donnée.</p>
    </div>
  );
};

const DatabasePage = () => {
  const context = useOutletContext();
  return <DatabasePageContent {...context} />;
};

export default DatabasePage;
