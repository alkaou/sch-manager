import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';

import { useLanguage, useTheme } from '../contexts';
import woman_1 from "../../assets/profiles/woman_1.jpg";
import man_1 from "../../assets/profiles/man_1.jpg";
import man_2 from "../../assets/profiles/man_2.jpg";
import woman_2 from "../../assets/profiles/woman_2.jpg";
import parent_1 from "../../assets/profiles/parent_1.jpg";

const TestimonialsSection = ({ isOthersBGColors }) => {
  const { live_language } = useLanguage();
  const { theme, text_color } = useTheme();
  const [activeIndex, setActiveIndex] = useState(0);
  const [autoplay, setAutoplay] = useState(true);

  // Testimonial data
  const testimonials = [
    {
      id: 1,
      name: "Aïssa Founè Dembélé",
      role: live_language.principal_text || "Directrice, Groupe Scolaire Cheicknè Dembélé",
      image: woman_1,
      quote: live_language.testimonial_1 || "SchoolManager a révolutionné notre gestion administrative. La génération automatique des bulletins nous fait gagner des heures précieuses. Le support technique est également exemplaire.",
      rating: 5,
      location: "San, Mali"
    },
    {
      id: 2,
      name: "Gouanon Coulibaly",
      role: live_language.administrator_text || "Administrateur, Complexe Scolaire Charles Yanaba",
      image: man_1,
      quote: live_language.testimonial_2 || "Depuis que nous utilisons cette plateforme, nos processus administratifs sont beaucoup plus efficaces. Les parents apprécient particulièrement la présentation professionnelle des bulletins.",
      rating: 5,
      location: "Kati, Mali"
    },
    {
      id: 3,
      name: "Fatoumata Dembélé",
      role: live_language.teacher_text || "Enseignante, École Primaire Lumière",
      image: woman_2,
      quote: live_language.testimonial_3 || "L'interface est intuitive même pour les moins technophiles d'entre nous. Je peux gérer mes notes et évaluations sans difficulté, et les statistiques m'aident à améliorer mon enseignement.",
      rating: 4,
      location: "Sikasso, Mali"
    },
    {
      id: 4,
      name: "Yacouba C Dembélé",
      role: live_language.tech_director_text || "Directeur Informatique, Académie Moderne",
      image: man_2,
      quote: live_language.testimonial_4 || "La sécurité et la fiabilité de SchoolManager sont impressionnantes. Nous gérons 1 500 élèves sans aucun problème de performance, et les sauvegardes automatiques nous rassurent.",
      rating: 5,
      location: "Ségou, Mali"
    },
    {
      id: 5,
      name: "Hawa Coulibaly",
      role: live_language.parent_text || "Parent d'élève",
      image: parent_1,
      quote: live_language.testimonial_5 || "En tant que parent, j'apprécie la clarté des bulletins et la facilité de suivre les progrès de mes enfants. Je recommande vivement cette solution à toutes les écoles.",
      rating: 5,
      location: "Bamako, Mali"
    }
  ];

  // Autoplay functionality
  useEffect(() => {
    let interval;
    if (autoplay) {
      interval = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % testimonials.length);
      }, 6000);
    }
    return () => clearInterval(interval);
  }, [autoplay, testimonials.length]);

  // Pause autoplay on hover
  const handleMouseEnter = () => setAutoplay(false);
  const handleMouseLeave = () => setAutoplay(true);

  // Navigation functions
  const goToPrev = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const goToNext = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };

  const goToTestimonial = (index) => {
    setActiveIndex(index);
  };

  const _texts_color = isOthersBGColors ? "text-gray-700" : text_color;

  // Render star ratings
  const renderStars = (rating) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        size={18}
        className={i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300 dark:text-gray-600"}
      />
    ));
  };

  return (
    <section id="testimonials" className="py-20 relative overflow-hidden">
      {/* Background effect */}
      <div className="absolute inset-0 -z-10">
        <svg width="100%" height="100%" className="opacity-5">
          <pattern id="testimonialPattern" x="0" y="0" width="64" height="64" patternUnits="userSpaceOnUse">
            <path d="M32 0C14.3 0 0 14.3 0 32s14.3 32 32 32 32-14.3 32-32S49.7 0 32 0z" fill="currentColor" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#testimonialPattern)" />
        </svg>
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
            {live_language.testimonials_title || "Ce que disent nos utilisateurs"}
          </h2>
          <p className="max-w-2xl mx-auto text-lg opacity-75">
            {live_language.testimonials_subtitle || "Découvrez l'expérience de directeurs, enseignants et administrateurs qui utilisent notre solution au quotidien."}
          </p>
        </motion.div>

        {/* Testimonials carousel */}
        <div
          className="relative max-w-4xl mx-auto"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Main testimonial card */}
          <div className="relative h-96">
            <AnimatePresence mode="wait">
              {testimonials.map((testimonial, index) => (
                index === activeIndex && (
                  <motion.div
                    key={testimonial.id}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.5 }}
                    className={`${_texts_color} absolute inset-0 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-8 rounded-2xl shadow-xl flex flex-col md:flex-row items-center gap-8`}
                  >
                    {/* Left side - Image and rating */}
                    <div className="flex flex-col items-center w-full md:w-1/3">
                      <div className="relative">
                        <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-blue-100 dark:border-blue-900 shadow-lg">
                          <img
                            src={testimonial.image}
                            alt={testimonial.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white p-1 rounded-full">
                          <Quote size={16} className="rotate-180" />
                        </div>
                      </div>

                      <h3 className="text-xl font-bold mt-4">{testimonial.name}</h3>
                      <p className="text-sm opacity-75 mb-2">{testimonial.role}</p>
                      <p className="text-xs opacity-60 mb-3">{testimonial.location}</p>
                      <div className="flex space-x-1">
                        {renderStars(testimonial.rating)}
                      </div>
                    </div>

                    {/* Right side - Quote */}
                    <div className="w-full md:w-2/3 flex flex-col justify-center">
                      <div className="mb-6">
                        <Quote className="text-blue-400 opacity-40 w-12 h-12 mb-2" />
                        <p className="text-lg italic">{testimonial.quote}</p>
                      </div>

                      {/* Progress bar */}
                      <div className="w-full h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-blue-500"
                          initial={{ width: '0%' }}
                          animate={{ width: '100%' }}
                          transition={{
                            duration: 6,
                            ease: "linear",
                            repeat: autoplay ? Infinity : 0,
                            repeatType: "loop"
                          }}
                          key={activeIndex}
                        />
                      </div>
                    </div>
                  </motion.div>
                )
              ))}
            </AnimatePresence>
          </div>

          {/* Navigation controls */}
          <div className="flex justify-between mt-8">
            <div className="flex space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all ${index === activeIndex
                    ? 'bg-blue-600 w-6'
                    : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>

            <div className="flex space-x-3">
              <motion.button
                onClick={goToPrev}
                className="text-gray-700 p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="w-5 h-5" />
              </motion.button>
              <motion.button
                onClick={goToNext}
                className="text-gray-700 p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Next testimonial"
              >
                <ChevronRight className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </div>

        {/* Stats summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
          <motion.div
            className="text-center p-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-3xl md:text-4xl font-bold text-pink-900 dark:text-pink-200 mb-1">150+</h3>
            <p className="opacity-75">{live_language.schools_using || "Écoles utilisatrices"}</p>
          </motion.div>

          <motion.div
            className="text-center p-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h3 className="text-3xl md:text-4xl font-bold text-purple-900 dark:text-purple-200 mb-1">98%</h3>
            <p className="opacity-75">{live_language.satisfaction_rate || "Taux de satisfaction"}</p>
          </motion.div>

          <motion.div
            className="text-center p-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className="text-3xl md:text-4xl font-bold text-green-600 dark:text-green-400 mb-1">45K+</h3>
            <p className="opacity-75">{live_language.students_managed || "Élèves gérés"}</p>
          </motion.div>

          <motion.div
            className="text-center p-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h3 className="text-3xl md:text-4xl font-bold text-amber-900 dark:text-amber-200 mb-1">12K+</h3>
            <p className="opacity-75">{live_language.hours_saved || "Heures économisées"}</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection; 