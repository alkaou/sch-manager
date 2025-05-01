import React from "react";
import { useTheme } from "../components/contexts";

const EmployesPage = () => {

    const { app_bg_color, text_color } = useTheme();

    return (
        <div className={`p-4 mt-20 ml-20 flex justify-center items-center min-h-[80vh] ${app_bg_color} ${text_color}`}>
            employés School Manager
        </div>
    );
};

export default EmployesPage;
