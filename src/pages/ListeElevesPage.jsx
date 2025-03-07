import React from "react";
import { useOutletContext } from "react-router-dom";

const ListeElevesPageContent = (props) => {
  return (
    <div className="p-4 mt-20 ml-20">
      <h1>Liste des élèves</h1>
      <p>Contenu spécifique à la page Liste des élèves.</p>
    </div>
  );
};

const ListeElevesPage = () => {
  const context = useOutletContext();
  return <ListeElevesPageContent {...context} />;
};

export default ListeElevesPage;
