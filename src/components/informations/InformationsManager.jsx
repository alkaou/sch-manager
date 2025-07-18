import React, { useEffect, useState } from "react";
import { useTheme } from "../contexts";

function InformationsManager({ setShowInformationPage, isOthersBGColors }) {
  const onReturn = () => {
    setShowInformationPage(false);
  };

  return (
    <div style={{ marginTop: "10%" }} className="min-h-screen">
      <button onClick={onReturn}>Retour</button>
      InformationsManager
    </div>
  );
}

export default InformationsManager;
