import React, { useState, useEffect } from 'react';

import HomeNavBar from '../components/home_components/HomeNavBar.jsx';
import HeroSection from '../components/home_components/HeroSection.jsx';
import FeaturesSection from '../components/home_components/FeaturesSection.jsx';
import TestimonialsSection from '../components/home_components/TestimonialsSection.jsx';
import StatisticsSection from '../components/home_components/StatisticsSection.jsx';
import TutorialsSection from '../components/home_components/TutorialsSection.jsx';
import ContactSection from '../components/home_components/ContactSection.jsx';
import FooterSection from '../components/home_components/FooterSection.jsx';
import Popup from '../components/Popup.jsx';
import DatabaseCreator from '../components/DatabaseCreator.jsx';
import ColorsSelector from '../components/ColorsSelector.jsx';

import { useTheme } from '../components/contexts';

const HomePage = () => {
  // State for popup management
  const [isOpenPopup, setIsOpenPopup] = useState(false);
  const [data, setData] = useState(null);
  const { app_bg_color, theme, gradients } = useTheme();

  const isOthersBGColors = app_bg_color === gradients[1] || app_bg_color === gradients[2] || theme === "dark" ? false : true;


  useEffect(() => {
    window.electron.getDatabase().then((data) => {
      setData(data);
    });
  }, []);
  
  // Handle popup content switching
  const OpenThePopup = () => {
    const popup_bool = isOpenPopup === true ? false : isOpenPopup === false ? true : false;
    setIsOpenPopup(popup_bool);
  };
  
  return (
    <div className={`${app_bg_color} min-h-screen`}>
      {/* Navigation Bar */}
      <HomeNavBar setIsOpenPopup={setIsOpenPopup} />
      
      {/* Main Content Sections */}
      <main>
        <HeroSection 
          setIsOpenPopup={setIsOpenPopup}
          data={data}
          isOthersBGColors={isOthersBGColors}
        />
        <FeaturesSection
          isOthersBGColors={isOthersBGColors}
        />
        <StatisticsSection
          isOthersBGColors={isOthersBGColors}
        />
        <TestimonialsSection
          isOthersBGColors={isOthersBGColors}
        />
        <TutorialsSection
          isOthersBGColors={isOthersBGColors}
        />
        <ContactSection
          isOthersBGColors={isOthersBGColors}
        />
      </main>
      
      {/* Footer */}
      <FooterSection
       isOthersBGColors={isOthersBGColors}
      />
      
      {/* Popups */}
      {isOpenPopup === "DB_CREATOR" ? (
        <DatabaseCreator setIsOpenPopup={setIsOpenPopup} />
      ) : (
        <Popup
          isOpenPopup={isOpenPopup}
          setIsOpenPopup={setIsOpenPopup}
          children={<ColorsSelector OpenThePopup={OpenThePopup} />}
        />
      )}
    </div>
  );
};

export default HomePage;
