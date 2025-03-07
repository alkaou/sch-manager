import React from "react";
import { useOutletContext } from "react-router-dom";

const BulletinsPageContent = (props) => {
  return (
    <div className="p-4 mt-20 ml-20">
      <h1>Page Bulletins</h1>
      <p>Contenu spécifique à la page Bulletins.</p>
    </div>
  );
};

const BulletinsPage = () => {
  const context = useOutletContext();
  return <BulletinsPageContent {...context} />;
};

export default BulletinsPage;
