import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Send, Heart, Mail, Phone, MapPin
} from 'lucide-react';

import { useLanguage, useTheme } from '../contexts';

const FooterSection = ({ isOthersBGColors }) => {
  const { live_language } = useLanguage();
  const { theme, text_color } = useTheme();
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscribeError, setSubscribeError] = useState(null);

  const _texts_color = isOthersBGColors ? "text-gray-700" : text_color;
  
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setSubscribeError(null);
  };
  
  const handleSubscribe = (e) => {
    e.preventDefault();
    
    // Basic email validation
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setSubscribeError(live_language.invalid_email || "Veuillez entrer une adresse email valide.");
      return;
    }
    
    // Simulate subscription
    setTimeout(() => {
      setIsSubscribed(true);
      setEmail('');
      
      // Reset after 5 seconds
      setTimeout(() => {
        setIsSubscribed(false);
      }, 5000);
    }, 1000);
  };
  
  const currentYear = new Date().getFullYear();
  
  // Footer link sections
  const footerSections = [
    // {
    //   title: live_language.product || "Produit",
    //   links: [
    //     { name: live_language.features_text || "Fonctionnalités", url: "#features" },
    //     { name: live_language.pricing || "Tarifs", url: "#pricing" },
    //     { name: live_language.testimonials_text || "Témoignages", url: "#testimonials" },
    //     { name: live_language.faq || "FAQ", url: "#faq" }
    //   ]
    // },
    {
      title: live_language.resources || "Ressources",
      links: [
        { name: live_language.tutorials_title || "Tutoriels", url: "/tuto_helpers" },
        { name: live_language.community || "Communauté", url: "#community" }
      ]
    },
    {
      title: live_language.company || "Entreprise",
      links: [
        { name: live_language.about_us || "À propos", url: "#about" },
        { name: live_language.legal || "Mentions légales", url: "/privacy-policy" }
      ]
    }
  ];
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };
  
  return (
    <footer className={`${_texts_color} border-t pt-20 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Logo and contact information */}
          <motion.div 
            className="lg:col-span-2"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center mb-6">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600" />
                <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600" />
                <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600" />
              </svg>
              <span className="text-xl font-bold">{live_language.app_name || "SchoolManager"}</span>
            </div>
            
            <p className="mb-6 opacity-75 max-w-md">
              {live_language.footer_description || "Une solution complète pour la gestion de votre établissement scolaire. Simple, efficace et adaptée aux besoins des écoles de toutes tailles."}
            </p>
            
            {/* Social media icons */}
            <div className="flex space-x-3 mt-2">
              {/* Languages */}
              <div className="mt-2">
                <h4 className="font-medium text-sm mb-2">{live_language.available_languages || "Langues disponibles"}</h4>
                <div className="flex space-x-3">
                  <span className="px-3 py-1 rounded-full text-xs border border-blue-500 text-blue-600">Français</span>
                  <span className="px-3 py-1 rounded-full text-xs border border-blue-500 text-blue-600">English</span>
                  <span className="px-3 py-1 rounded-full text-xs border border-blue-500 text-blue-600">Bambara</span>
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Links sections */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-8"
          >
            {footerSections.map((section, index) => (
              <motion.div key={index} variants={itemVariants}>
                <h4 className="font-bold text-lg mb-4">{section.title}</h4>
                <ul className="space-y-3">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <Link 
                        to={link.url}
                        className="opacity-75 hover:opacity-100 hover:text-blue-600 transition-colors"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>
          
          {/* Newsletter */}
          <motion.div
            className="lg:col-span-1"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h4 className="font-bold text-lg mb-4">{live_language.newsletter || "Newsletter"}</h4>
            <p className="opacity-75 mb-4">
              {live_language.newsletter_desc || "Recevez nos dernières actualités et mises à jour directement dans votre boîte mail."}
            </p>
            
            <form onSubmit={handleSubscribe}>
              <div className="flex flex-col space-y-2">
                <div className="relative">
                  <input
                    type="email"
                    placeholder={live_language.email_placeholder || "Votre adresse email"}
                    className={`w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-12 ${
                      theme === 'dark' 
                        ? 'bg-gray-800 border-gray-700' 
                        : 'bg-white border-gray-300'
                    } border`}
                    value={email}
                    onChange={handleEmailChange}
                  />
                  <motion.button
                    type="submit"
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg"
                    // whileHover={{ scale: 1.05 }}
                    // whileTap={{ scale: 0.95 }}
                  >
                    <Send className="w-5 h-5" />
                  </motion.button>
                </div>
                
                {subscribeError && (
                  <p className="text-sm text-red-500">{subscribeError}</p>
                )}
                
                {isSubscribed && (
                  <motion.p 
                    className="text-sm text-green-500"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {live_language.subscription_success || "Merci de votre inscription !"}
                  </motion.p>
                )}
              </div>
            </form>
          </motion.div>
        </div>
        
        {/* Divider */}
        <div className={`h-px w-full my-10 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'}`}></div>
        
        {/* Bottom footer */}
        <div className="flex flex-col md:flex-row justify-between items-center pb-10">
          <div className="mb-4 md:mb-0">
            <p className="text-sm opacity-75">
              &copy; {currentYear} SchoolManager. {live_language.rights_reserved || "Tous droits réservés."}
            </p>
          </div>
          
          <div className="flex space-x-6">
            <Link to="/privacy-policy" className="text-sm opacity-75 hover:opacity-100 hover:text-blue-600 transition-colors">
              {live_language.privacy_policy || "Politique de confidentialité"}
            </Link>
            <Link to="/terms-of-use" className="text-sm opacity-75 hover:opacity-100 hover:text-blue-600 transition-colors">
              {live_language.terms_of_service || "Conditions d'utilisation"}
            </Link>
            <Link to="/cookies" className="text-sm opacity-75 hover:opacity-100 hover:text-blue-600 transition-colors">
              {live_language.cookie_policy || "Politique des cookies"}
            </Link>
          </div>
        </div>
        
        {/* Made with love */}
        <div className="text-center py-4 text-sm opacity-75">
          <p className="flex items-center justify-center">
            {live_language.made_with || "Fait avec"} <Heart className="mx-1 text-red-500 w-4 h-4 fill-current" /> {live_language.in_mali || "au Mali"}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection; 