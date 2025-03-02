import secureLocalStorage from "react-secure-storage";

const BG_COLORS = {
    light: "bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white",
    dark: "bg-gradient-to-r from-gray-800 via-gray-900 to-black text-white",
}

const APP_TEXT_COLORS = {
    light: "black-500",
    dark: "white",
}

const checkThemeForBgColor = () => {
    // secureLocalStorage.removeItem("ThemeColorSelect")
    let BgColorSelected = secureLocalStorage.getItem("ThemeColorSelect");
    if (BgColorSelected === undefined || BgColorSelected === null) {
        secureLocalStorage.setItem("ThemeColorSelect", BG_COLORS);
        return BG_COLORS;
    } else {
        // console.log(BgColorSelected);
        return BgColorSelected;
    }
}

const gradients = [
    "bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white",
    "bg-gray-100 text-gray-600",
    "bg-white text-gray-600",
    "bg-gradient-to-r from-green-500 to-blue-600 text-white",
    "bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white",
    "bg-gradient-to-r from-yellow-500 via-red-500 to-pink-500 text-black",
    "bg-gradient-to-r from-teal-400 to-cyan-500 text-white",
    "bg-gradient-to-r from-rose-500 to-orange-500 text-white",
    "bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-700 text-white",
    "bg-gradient-to-r from-green-600 via-yellow-500 to-red-500 text-black",
    "bg-gradient-to-r from-red-500 via-orange-600 to-yellow-500 text-black",
    "bg-gradient-to-r from-emerald-500 via-green-600 to-lime-600 text-white",
    "bg-gradient-to-r from-purple-700 via-pink-700 to-red-700 text-white",
    "bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 text-white",
    "bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600 text-black",
    "bg-gradient-to-r from-fuchsia-600 via-pink-600 to-rose-600 text-white",
    "bg-gradient-to-r from-blue-800 via-purple-800 to-pink-800 text-white",
    "bg-gradient-to-r from-green-300 via-teal-400 to-blue-500 text-black",
    "bg-gradient-to-r from-lime-500 via-emerald-600 to-teal-700 text-white",
    "bg-gradient-to-r from-indigo-400 via-sky-500 to-cyan-600 text-white",
    "bg-gradient-to-r from-yellow-400 via-lime-500 to-green-600 text-black",
    "bg-gradient-to-r from-pink-400 via-fuchsia-500 to-purple-600 text-white",
];


export { BG_COLORS, gradients, checkThemeForBgColor, APP_TEXT_COLORS };