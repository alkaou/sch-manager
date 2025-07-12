import React from "react";
import { useOutletContext } from "react-router-dom";

export default function EventsPage() {
  const {
    theme,
    app_bg_color,
    text_color,
    database,
    loadingData,
    refreshData,
  } = useOutletContext();
  
  return (
    <div
      style={{ marginLeft: "4%", height: "88vh", marginTop: "6%" }}
      className={`h-screen overflow-hidden ${app_bg_color} ${text_color}`}
    >
      EventsPage
    </div>
  );
}
