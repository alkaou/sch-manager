import React from "react";

export default function Error({ text = "Passer le message du variable *text* au paramètre" }) {
    return (
        <div className="flex items-center gap-2 text-red-600 text-sm font-medium p-2 rounded-md bg-red-100 border border-red-400 shadow-md animate-fadeIn animate-duration-300">
            <span>{text}</span>
        </div>
    );
};
