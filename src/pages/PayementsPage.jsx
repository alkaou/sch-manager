import React from "react";
import { useOutletContext } from "react-router-dom";

const PayementsPageContent = (props) => {
  return (
    <div className="p-4 mt-20 ml-20">
      <h1>Page Payements</h1>
      <p>Contenu spécifique à la page Payements.</p>
    </div>
  );
};

const PayementsPage = () => {
  const context = useOutletContext();
  return <PayementsPageContent {...context} />;
};

export default PayementsPage;
