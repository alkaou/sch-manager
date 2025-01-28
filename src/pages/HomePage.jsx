import React, { useContext } from "react";
import { motion } from "framer-motion";
import {  useNavigate } from "react-router";

import { ThemeContext } from "../components/contexts";
import ThemeSwitcher from "../components/ThemeSwitcher.jsx";


const useTheme = () => useContext(ThemeContext);


const HomePage = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();

  return (
    <div className="">
      <ThemeSwitcher />
    </div>
  );
};

export default HomePage;