import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Mail, Phone, MapPin, Send, MessageSquare,
  LinkedinIcon, Twitter, Facebook, Youtube, Github
} from 'lucide-react';

import { useLanguage, useTheme } from '../contexts';

import maps from "../../assets/images/Mali_Map.jpg";

const ContactSection = ({ isOthersBGColors }) => {
  const { live_language } = useLanguage();
  const { theme, text_color } = useTheme();

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [formStatus, setFormStatus] = useState({
    isSubmitting: false,
    isSubmitted: false,
    error: null
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Start submission process
    setFormStatus({ isSubmitting: true, isSubmitted: false, error: null });

    // Simulate API call with timeout
    setTimeout(() => {
      // Form validation
      if (!formData.name || !formData.email || !formData.message) {
        setFormStatus({
          isSubmitting: false,
          isSubmitted: false,
          error: live_language.form_validation_error || "Veuillez remplir tous les champs obligatoires."
        });
        return;
      }

      // Success simulation
      setFormStatus({
        isSubmitting: false,
        isSubmitted: true,
        error: null
      });

      // Reset form after successful submission
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });

      // Reset success message after 5 seconds
      setTimeout(() => {
        setFormStatus({
          isSubmitting: false,
          isSubmitted: false,
          error: null
        });
      }, 5000);

    }, 1500);
  };

  // CSS classes based on theme
  const inputClass = `w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${theme === 'dark'
    ? 'bg-gray-800 border-gray-700 text-white'
    : 'bg-white border-gray-300 text-gray-900'
    } border`;

  const cardBg = theme === 'dark' ? 'bg-gray-800' : 'bg-white';
  const highlightBg = theme === 'dark' ? 'bg-blue-900/30' : 'bg-blue-50';

  const _texts_color = isOthersBGColors ? "text-gray-700" : text_color;

  return (
    <section id="contact" className="py-20 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-blue-200 dark:bg-blue-900 opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-purple-200 dark:bg-purple-900 opacity-20 blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className={`
            text-3xl md:text-4xl font-bold mb-6 inline-block bg-clip-text text-transparent 
            ${isOthersBGColors ? text_color : "bg-gradient-to-r from-blue-600 to-purple-600"}
          `}>
            {live_language.contact_title || "Contactez-nous"}
          </h2>
          <p className="max-w-2xl mx-auto text-lg opacity-75">
            {live_language.contact_subtitle || "Vous avez des questions ou besoin d'assistance ? Notre équipe est là pour vous aider."}
          </p>
        </motion.div>

        <div className={`grid grid-cols-1 md:grid-cols-2 gap-10 max-w-6xl mx-auto ${_texts_color}`}>
          {/* Contact information */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className={`${cardBg} rounded-2xl shadow-xl p-8 h-full`}>
              <h3 className="text-2xl font-bold mb-6">{live_language.contact_info || "Informations de contact"}</h3>

              <div className="space-y-6">
                <div className="flex items-start">
                  <div className={`p-3 ${highlightBg} rounded-lg mr-4`}>
                    <Mail className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">{live_language.email || "Email"}</h4>
                    <p className="opacity-75">contact@schoolmanager.com</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className={`p-3 ${highlightBg} rounded-lg mr-4`}>
                    <Phone className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">{live_language.phone || "Téléphone"}</h4>
                    <p className="opacity-75">+223 67 22 00 66 / +223 96 50 64 09</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className={`p-3 ${highlightBg} rounded-lg mr-4`}>
                    <MapPin className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">{live_language.address || "Adresse"}</h4>
                    <p className="opacity-75">San, Mali<br />Kati, Mali</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className={`p-3 ${highlightBg} rounded-lg mr-4`}>
                    <MessageSquare className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">{live_language.live_chat || "Chat en direct"}</h4>
                    <p className="opacity-75">{live_language.chat_availability || "Disponible 7j/7 de 8h à 20h"}</p>
                  </div>
                </div>
              </div>

              {/* Social media */}
              <div className="mt-8">
                <h4 className="font-medium mb-4">{live_language.follow_us || "Suivez-nous"}</h4>
                <div className="flex space-x-3">
                  <motion.a
                    // href="https://linkedin.com"
                    // target="_blank"
                    title='Linked'
                    rel="noopener noreferrer"
                    className={`p-3 ${highlightBg} rounded-full`}
                    whileHover={{ y: -5, backgroundColor: theme === 'dark' ? '#1d4ed8' : '#dbeafe' }}
                  >
                    <LinkedinIcon className="w-5 h-5 text-blue-600" />
                  </motion.a>
                  <motion.a
                    // href="https://twitter.com"
                    // target="_blank"
                    title='Twitter'
                    rel="noopener noreferrer"
                    className={`p-3 ${highlightBg} rounded-full`}
                    whileHover={{ y: -5, backgroundColor: theme === 'dark' ? '#1d4ed8' : '#dbeafe' }}
                  >
                    <Twitter className="w-5 h-5 text-blue-600" />
                  </motion.a>
                  <motion.a
                    // href="https://facebook.com"
                    // target="_blank"
                    title='Facebook'
                    rel="noopener noreferrer"
                    className={`p-3 ${highlightBg} rounded-full`}
                    whileHover={{ y: -5, backgroundColor: theme === 'dark' ? '#1d4ed8' : '#dbeafe' }}
                  >
                    <Facebook className="w-5 h-5 text-blue-600" />
                  </motion.a>
                  <motion.a
                    // href="https://youtube.com"
                    // target="_blank"
                    title='Youtube'
                    rel="noopener noreferrer"
                    className={`p-3 ${highlightBg} rounded-full`}
                    whileHover={{ y: -5, backgroundColor: theme === 'dark' ? '#1d4ed8' : '#dbeafe' }}
                  >
                    <Youtube className="w-5 h-5 text-blue-600" />
                  </motion.a>
                  <motion.a
                    // href="https://github.com"
                    // target="_blank"
                    title='Github'
                    rel="noopener noreferrer"
                    className={`p-3 ${highlightBg} rounded-full`}
                    whileHover={{ y: -5, backgroundColor: theme === 'dark' ? '#1d4ed8' : '#dbeafe' }}
                  >
                    <Github className="w-5 h-5 text-blue-600" />
                  </motion.a>
                </div>
              </div>

              {/* Map or Location */}
              <div className="mt-8">
                <h4 className="font-medium mb-4">{live_language.location || "Emplacement"}</h4>
                <div className={`rounded-lg overflow-hidden h-40 bg-gray-200 dark:bg-gray-700 relative`}>
                  {/* Placeholder for map - in a real application, you would embed an actual map here */}
                  <img
                    src={maps}
                    title="maps"
                    alt="mpas"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <MapPin className="w-12 h-12 text-blue-600 animate-bounce" />
                  </div>
                  <div className="absolute bottom-0 w-full py-2 px-4 bg-black bg-opacity-70 text-white text-xs text-center">
                    {live_language.map_placeholder || "Carte interactive disponible sur le site web complet"}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contact form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className={`${cardBg} rounded-2xl shadow-xl p-8`}>
              <h3 className="text-2xl font-bold mb-6">{live_language.send_message || "Envoyez-nous un message"}</h3>

              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  {/* Name field */}
                  <div>
                    <label className="block text-sm font-medium mb-2" htmlFor="name">
                      {live_language.name || "Nom"} *
                    </label>
                    <motion.input
                      whileFocus={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={inputClass}
                      placeholder={live_language.name_placeholder || "Votre nom complet"}
                      required
                    />
                  </div>

                  {/* Email field */}
                  <div>
                    <label className="block text-sm font-medium mb-2" htmlFor="email">
                      {live_language.email || "Email"} *
                    </label>
                    <motion.input
                      whileFocus={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={inputClass}
                      placeholder={live_language.email_placeholder || "votre@email.com"}
                      required
                    />
                  </div>

                  {/* Subject field */}
                  <div>
                    <label className="block text-sm font-medium mb-2" htmlFor="subject">
                      {live_language.subject || "Sujet"}
                    </label>
                    <motion.input
                      whileFocus={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className={inputClass}
                      placeholder={live_language.subject_placeholder || "Objet de votre message"}
                    />
                  </div>

                  {/* Message field */}
                  <div>
                    <label className="block text-sm font-medium mb-2" htmlFor="message">
                      {live_language.message || "Message"} *
                    </label>
                    <motion.textarea
                      whileFocus={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows="5"
                      className={inputClass}
                      placeholder={live_language.message_placeholder || "Comment pouvons-nous vous aider ?"}
                      required
                    />
                  </div>

                  {/* Form status indicators */}
                  {formStatus.error && (
                    <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg text-sm">
                      {formStatus.error}
                    </div>
                  )}

                  {formStatus.isSubmitted && (
                    <motion.div
                      className="p-3 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg text-sm"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      {live_language.message_sent || "Votre message a été envoyé avec succès. Nous vous répondrons dans les plus brefs délais."}
                    </motion.div>
                  )}

                  {/* Submit button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={formStatus.isSubmitting}
                    type="submit"
                    className={`w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex justify-center items-center ${formStatus.isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                      }`}
                  >
                    {formStatus.isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {live_language.sending || "Envoi en cours..."}
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5 mr-2" />
                        {live_language.send_message_btn || "Envoyer le message"}
                      </>
                    )}
                  </motion.button>

                  {/* Privacy note */}
                  <p className="text-xs opacity-75 text-center mt-3">
                    {live_language.privacy_note || "En soumettant ce formulaire, vous acceptez notre politique de confidentialité."}
                  </p>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection; 