import React from "react";
import { motion } from "framer-motion";
import {
  FileText,
  Users,
  Star,
  BarChart2,
  DollarSign,
  BookOpen,
  Database,
  Calendar,
  Calculator,
  Shield,
  DownloadCloud,
  Layers,
} from "lucide-react";

import { useLanguage, useTheme } from "../contexts";

const FeaturesSection = ({ isOthersBGColors }) => {
  const { live_language } = useLanguage();
  const { theme } = useTheme();

  const text_color = isOthersBGColors ? "text-gray-700" : "";

  // A function to get animated feature item
  const FeatureItem = ({ icon, title, description, delay }) => {
    const Icon = icon;

    return (
      <motion.div
        className={`${text_color} p-3 sm:p-4 md:p-6 rounded-xl shadow-lg ${
          theme === "dark" ? "bg-gray-800" : "bg-white"
        } hover:shadow-xl transition-all duration-300`}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.5, delay: delay }}
        whileHover={{ y: -5 }}
      >
        <div className="mb-3 md:mb-4 bg-blue-100 dark:bg-blue-900/30 w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-lg flex items-center justify-center">
          <Icon
            size={18}
            className="text-blue-600 dark:text-blue-400 sm:w-5 sm:h-5 md:w-7 md:h-7"
          />
        </div>
        <h3 className="text-base sm:text-lg md:text-xl font-bold mb-2 md:mb-3">
          {title}
        </h3>
        <p className="opacity-75 text-sm sm:text-base">{description}</p>
      </motion.div>
    );
  };

  // Features data
  const features = [
    {
      id: 1,
      icon: FileText,
      title: live_language.bulletins_nav || "Bulletins",
      description:
        live_language.bulletins_description ||
        "Générez des bulletins scolaires personnalisables avec calcul automatique des moyennes et des rangs.",
      delay: 0.1,
    },
    {
      id: 2,
      icon: Star,
      title: live_language.compositions_nav || "Compositions",
      description:
        live_language.compositions_description ||
        "Enregistrez et gérez facilement les notes des élèves pour chaque évaluation et trimestre.",
      delay: 0.2,
    },
    {
      id: 3,
      icon: Users,
      title: live_language.lists_nav || "Listes d'élèves",
      description:
        live_language.lists_description ||
        "Organisez vos élèves par classe et générez des listes personnalisées et exportables.",
      delay: 0.3,
    },
    {
      id: 4,
      icon: BarChart2,
      title: live_language.analytics_nav || "Analyses statistiques",
      description:
        live_language.analytics_description ||
        "Visualisez les performances avec des graphiques intuitifs et suivez l'évolution des résultats.",
      delay: 0.4,
    },
    {
      id: 5,
      icon: DollarSign,
      title: live_language.finance_nav || "Gestion financière",
      description:
        live_language.finance_description ||
        "Suivez les paiements des frais scolaires et générez des rapports financiers détaillés.",
      delay: 0.5,
    },
    {
      id: 6,
      icon: BookOpen,
      title: live_language.read_nav || "Documents pédagogiques",
      description:
        live_language.read_description ||
        "Accédez à une bibliothèque de ressources éducatives pour enrichir votre enseignement.",
      delay: 0.15,
    },
    {
      id: 7,
      icon: Database,
      title: live_language.database_nav || "Base de données",
      description:
        live_language.database_description ||
        "Stockez en toute sécurité les informations de votre établissement avec des sauvegardes automatiques.",
      delay: 0.25,
    },
    {
      id: 8,
      icon: Calendar,
      title: live_language.calendar_text || "Calendrier",
      description:
        live_language.calendar_description ||
        "Planifiez les événements scolaires et les évaluations importantes dans un calendrier intégré.",
      delay: 0.35,
    },
    {
      id: 9,
      icon: Calculator,
      title: live_language.calculator_text || "Calculatrice",
      description:
        live_language.calculator_description ||
        "Utilisez des outils de calcul intégrés pour les moyennes et les statistiques de classe.",
      delay: 0.45,
    },
  ];

  return (
    <section
      id="features"
      className="py-12 sm:py-10 md:py-5 relative overflow-hidden"
    >
      {/* Background decorations */}
      <div className="absolute inset-0 -z-10 opacity-5">
        <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
          <defs>
            <pattern
              id="dotPattern"
              patternUnits="userSpaceOnUse"
              width="40"
              height="40"
            >
              <circle cx="20" cy="20" r="1" fill="currentColor" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dotPattern)" />
        </svg>
      </div>

      <div className="container mx-auto px-4 w-full">
        <motion.div
          className="text-center mb-8 sm:mb-12 md:mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2
            className={`
              text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 md:mb-6 inline-block bg-clip-text text-transparent 
              ${
                isOthersBGColors
                  ? "bg-gradient-to-r from-white to-gray-50"
                  : "bg-gradient-to-r from-blue-600 to-purple-600"
              }
          `}
          >
            {live_language.features_title || "Fonctionnalités Puissantes"}
          </h2>
          <p className="max-w-2xl mx-auto text-base sm:text-lg opacity-75 px-4">
            {live_language.features_subtitle ||
              "Tout ce dont vous avez besoin pour une gestion scolaire efficace, accessible depuis n'importe quel appareil."}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {features.map((feature) => (
            <FeatureItem
              key={feature.id}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              delay={feature.delay}
            />
          ))}
        </div>

        {/* Additional feature highlight */}
        <motion.div
          className={`mt-10 sm:mt-12 md:mt-16 p-4 sm:p-6 md:p-8 ${text_color} rounded-2xl shadow-2xl ${
            theme === "dark" ? "bg-gray-800/50" : "bg-blue-50"
          } border border-blue-200 dark:border-blue-800`}
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
            <div className="w-full md:w-1/2">
              <h3 className="text-xl sm:text-2xl font-bold mb-3 md:mb-4">
                {live_language.multilingual_support || "Support multilingue"}
              </h3>
              <p className="mb-4 md:mb-6 opacity-75 text-sm sm:text-base">
                {live_language.multilingual_description ||
                  "Notre application prend en charge plusieurs langues (Français, Anglais, Bambara) pour répondre aux besoins de différentes communautés éducatives."}
              </p>
              <div className="flex flex-wrap gap-3 md:gap-4">
                <div className="flex items-center">
                  <Shield className="text-green-600 mr-2 w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="text-sm sm:text-base">
                    {live_language.security_text || "Sécurité"}
                  </span>
                </div>
                <div className="flex items-center">
                  <DownloadCloud className="text-blue-600 mr-2 w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="text-sm sm:text-base">
                    {live_language.backup_text || "Sauvegarde"}
                  </span>
                </div>
                <div className="flex items-center">
                  <Layers className="text-purple-600 mr-2 w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="text-sm sm:text-base">
                    {live_language.customization_text || "Personnalisation"}
                  </span>
                </div>
              </div>
            </div>
            <div className="w-full md:w-1/2 flex justify-center">
              <motion.div
                className="relative h-48 w-48 sm:h-56 sm:w-56 md:h-64 md:w-64"
                animate={{ rotate: 360 }}
                transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
              >
                {/* Circular animated globe */}
                <div className="absolute inset-0 rounded-full border-4 border-dashed border-blue-200 dark:border-blue-900"></div>
                <div
                  className="absolute inset-2 rounded-full border-4 border-dashed border-blue-300 dark:border-blue-800 animate-spin"
                  style={{ animationDuration: "30s" }}
                ></div>
                <div
                  className="absolute inset-4 rounded-full border-4 border-dashed border-blue-400 dark:border-blue-700 animate-spin"
                  style={{
                    animationDuration: "20s",
                    animationDirection: "reverse",
                  }}
                ></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    className="h-24 w-24 sm:h-28 sm:w-28 md:h-32 md:w-32 bg-blue-600 dark:bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg sm:text-xl md:text-2xl shadow-lg"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    IA
                  </motion.div>
                </div>

                {/* Orbiting elements */}
                {["🇲🇱", "🇫🇷", "🇬🇧"].map((flag, index) => (
                  <motion.div
                    key={index}
                    className={`
                      absolute w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 
                      ${
                        index === 0
                          ? "bg-green-600"
                          : index === 1
                          ? "bg-yellow-600"
                          : "bg-red-600"
                      } 
                      text-white rounded-full flex items-center justify-center text-sm sm:text-base md:text-xl shadow-lg
                    `}
                    initial={{
                      x: Math.cos(index * ((2 * Math.PI) / 3)) * 100,
                      y: Math.sin(index * ((2 * Math.PI) / 3)) * 100,
                      rotate: 0,
                    }}
                    animate={{
                      rotate: 360,
                      x: [
                        Math.cos(index * ((2 * Math.PI) / 3) + 0) * 100,
                        Math.cos(index * ((2 * Math.PI) / 3) + 2) * 100,
                        Math.cos(index * ((2 * Math.PI) / 3) + 4) * 100,
                        Math.cos(index * ((2 * Math.PI) / 3) + 6) * 100,
                      ],
                      y: [
                        Math.sin(index * ((2 * Math.PI) / 3) + 0) * 100,
                        Math.sin(index * ((2 * Math.PI) / 3) + 2) * 100,
                        Math.sin(index * ((2 * Math.PI) / 3) + 4) * 100,
                        Math.sin(index * ((2 * Math.PI) / 3) + 6) * 100,
                      ],
                    }}
                    transition={{
                      duration: 20,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    style={{
                      left: "calc(50% - 24px)",
                      top: "calc(50% - 24px)",
                    }}
                  >
                    {flag}
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;
