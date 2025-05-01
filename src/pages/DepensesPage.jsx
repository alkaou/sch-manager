import React from "react";
import { useTheme } from "../components/contexts";

const DepensesPage = () => {

    const { app_bg_color, text_color } = useTheme();

    return (
        <div style={{marginLeft: "7%"}} className={`p-4 mt-20 flex justify-center items-center min-h-[80vh] ${app_bg_color} ${text_color}`}>
            Dépenses School Manager
        </div>
    );
};

export default DepensesPage;
