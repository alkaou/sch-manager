import React from "react";
import { useOutletContext } from "react-router-dom";

const CompositionsPageContent = (props) => {
  // Vous pouvez extraire les valeurs du contexte si nécessaire, par ex:
  // const { app_bg_color, text_color, theme } = props;
  return (
    <div className="p-4 mt-20 ml-20">
      <h1>Page Compositions</h1>
      <p>Contenu spécifique à la page Compositions.</p>
    </div>
  );
};

const CompositionsPage = () => {
  const context = useOutletContext();
  return <CompositionsPageContent {...context} />;
};

export default CompositionsPage;
