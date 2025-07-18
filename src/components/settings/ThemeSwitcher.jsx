import React from "react";
import { useTheme } from "../contexts";

const ThemeSwitcher = () => {

    const { theme, toggleTheme } = useTheme();
    const isDarkmode = theme === "dark";

    return (
        <button
            onClick={toggleTheme}
            className="w-10 h-6 rounded-full bg-white flex items-center transition duration-300 focus:outline-none shadow"
        >
            <div
                className={`w-5 h-5 relative rounded-full transition duration-500 transform p-0.5 text-white ${isDarkmode
                    ? "bg-gray-700 translate-x-4"
                    : "bg-yellow-500 -translate-x-1"
                    }`}
            >
                {isDarkmode ? (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        className="w-full h-full"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                        />
                    </svg>
                ) : (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        className="w-full h-full"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                        />
                    </svg>
                )}
            </div>
        </button>
    );
};

export default ThemeSwitcher;
