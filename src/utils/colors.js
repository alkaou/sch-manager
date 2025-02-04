import secureLocalStorage from "react-secure-storage";

const BG_COLORS = {
    light: "bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300",
    dark: "bg-gradient-to-r from-gray-800 via-gray-900 to-black",
}

const checkThemeForBgColor = () => {
    // secureLocalStorage.removeItem("ThemeColorSelect")
    let BgColorSelected = secureLocalStorage.getItem("ThemeColorSelect");
    if (BgColorSelected === undefined || BgColorSelected === null){
        secureLocalStorage.setItem("ThemeColorSelect", BG_COLORS);
        return BG_COLORS;
    } else {
        // console.log(BgColorSelected);
        return BgColorSelected;
    }
}

const gradients = [
    "bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300",
    "bg-gradient-to-r from-green-400 to-blue-500",
    "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500",
    "bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500",
    "bg-gradient-to-r from-teal-300 to-cyan-400",
    "bg-gradient-to-r from-rose-400 to-orange-400",
    "bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-600",
    "bg-gradient-to-r from-green-700 via-yellow-500 to-red-500",
    "bg-gradient-to-r from-red-400 via-orange-500 to-yellow-500",
    "bg-gradient-to-r from-emerald-400 via-green-500 to-lime-500",
    "bg-gradient-to-r from-purple-600 via-pink-600 to-red-600",
    "bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500",
    "bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500",
    "bg-gradient-to-r from-fuchsia-500 via-pink-500 to-rose-500",
    "bg-gradient-to-r from-blue-900 via-purple-900 to-pink-900",
    "bg-gradient-to-r from-green-200 via-teal-300 to-blue-400",
    "bg-gradient-to-r from-lime-400 via-emerald-500 to-teal-600",
    "bg-gradient-to-r from-indigo-300 via-sky-400 to-cyan-500",
    "bg-gradient-to-r from-yellow-300 via-lime-400 to-green-500",
    "bg-gradient-to-r from-pink-300 via-fuchsia-400 to-purple-500"
];

export { BG_COLORS, gradients, checkThemeForBgColor};