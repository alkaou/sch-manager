import secureLocalStorage from "react-secure-storage";

const BG_COLORS = {
    light: "bg-gray-800/80 text-white",
    dark: "bg-gray-900 text-white",
}

const checkThemeForBgColor = () => {
    // secureLocalStorage.removeItem("ThemeColorSelect");
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
    "bg-gradient-to-r from-fuchsia-600 via-pink-600 to-rose-600 text-white",
    "bg-gray-100 text-gray-700",
    "bg-white text-gray-700",
    "bg-blue-500 text-white",
    "bg-gray-800/80 text-white",
    "bg-purple-600 text-white",
    "bg-[#2D5A27] text-white",
    "bg-[#1B4F72] text-white",
    "bg-emerald-600 text-white",
    "bg-purple-600 text-white",
    "bg-[#1877F2] text-white",
    "bg-[#0088CC] text-white",
    "bg-[#25D366] text-white",
    "bg-gradient-to-r from-purple-700 via-pink-700 to-red-700 text-white",
    "bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 text-white",
    "bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600 text-white",
    "bg-gradient-to-r from-blue-800 via-purple-800 to-pink-800 text-white",
    "bg-gradient-to-r from-green-300 via-teal-400 to-blue-500 text-white",
    "bg-gradient-to-r from-lime-500 via-emerald-600 to-teal-700 text-white",
    "bg-gradient-to-r from-pink-400 via-fuchsia-500 to-purple-600 text-white",
];


export { BG_COLORS, gradients, checkThemeForBgColor };