import React from "react";
import { useTheme } from "../components/contexts";
import { useNavigate } from "react-router-dom";

const CommunityPage = () => {

    const { app_bg_color, text_color } = useTheme();

    const navigate = useNavigate();

    const handleBack = () => {
        navigate("/");
    };

    return (
        <div className={`p-4 mt-20 ml-20 flex justify-center items-center min-h-[80vh] ${app_bg_color} ${text_color}`}>
            <button onClick={handleBack} className="btn btn-primary">
                back
            </button>
            Community School Manager
        </div>
    );
};

export default CommunityPage;
