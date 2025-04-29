import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage, useTheme } from '../components/contexts';

const PrivacyPolicy = () => {
  const { theme, app_bg_color, text_color, gradients } = useTheme();
  const { language } = useLanguage();

  const isOthersBGColors = app_bg_color === gradients[1] || app_bg_color === gradients[2] || theme === "dark" ? false : true;
  const texts_color = isOthersBGColors ? "text-gray-700" : text_color;

  const pageVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.6 } },
    exit: { opacity: 0, transition: { duration: 0.4 } }
  };

  const sectionVariants = {
    initial: { y: 20, opacity: 0 },
    animate: { y: 0, opacity: 1, transition: { duration: 0.5 } }
  };

  // Language-specific text content
  const getContent = (fr, en, bm) => {
    if (language === 'Français') return fr;
    if (language === 'Anglais') return en;
    if (language === 'Bambara') return bm;
    return fr; // Default to French
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className={`min-h-screen p-6 md:p-10 ${app_bg_color}`}
    >
      <div className="max-w-4xl mx-auto">
        <Link to="/" className={`inline-flex items-center mb-6 btn btn-primary`}>
          <ArrowLeft className="mr-2" size={18} />
          {getContent(
            'Retour à l\'accueil', 
            'Back to Home',
            'Segin so kɔnɔ'
          )}
        </Link>

        <motion.div variants={sectionVariants} className="mb-10">
          <h1 className={`text-3xl md:text-4xl font-bold mb-4 ${text_color}`}>
            {getContent(
              'Politique de Confidentialité',
              'Privacy Policy',
              'Gundo Mara Sariyaw'
            )}
          </h1>
          <p className={`text-lg ${text_color} opacity-75`}>
            {getContent(
              'Dernière mise à jour : Juillet 2025. Cette politique de confidentialité décrit comment nous collectons, utilisons et partageons vos informations personnelles lorsque vous utilisez notre application School Manager.',
              'Last updated: July 2025. This Privacy Policy describes how we collect, use, and share your personal information when you use our School Manager application.',
              'A laban labɛnna: Juyekalo san 2025. Nin gundo sariya bɛ a ɲɛfɔ anw bɛ aw ka kunnafoni cɛ, k\'a baara kɛ ani k\'a tilannen cogow ɲɛfɔ n\'aw bɛ an ka SchoolManager baara kɛ tuma min na.'
            )}
          </p>
        </motion.div>

        <motion.section 
          variants={sectionVariants} 
          className={`mb-8 p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}`}
        >
          <h2 className={`text-xl md:text-2xl font-semibold mb-3 ${texts_color}`}>
            {getContent(
              '1. Informations que nous collectons',
              '1. Information We Collect',
              '1. Kunnafoniw min bɛ cɛ'
            )}
          </h2>
          <p className={`mb-3 ${texts_color} opacity-75`}>
            {getContent(
              'Nous collectons les informations que vous nous fournissez directement lors de l\'inscription et de l\'utilisation de l\'application School Manager, notamment :', 
              'We collect information that you provide directly to us when registering and using the School Manager application, including:',
              'An bɛ kunnafoni minw cɛ aw yɛrɛ ka diɲɛna an ma tɔgɔ sɛbɛnni ni SchoolManager baara kɛli senfɛ:'
            )}
          </p>
          <ul className={`list-disc pl-6 ${texts_color} opacity-75`}>
            <li className="mb-2">
              {getContent(
                'Informations de compte : nom, adresse e-mail, mot de passe et rôle.',
                'Account information: name, email address, password, and role.',
                'Jɔyɔrɔ kunnafoniw: tɔgɔ, email, gundo tɔgɔ, ani aw ka baara.'
              )}
            </li>
            <li className="mb-2">
              {getContent(
                'Données scolaires : dossiers que vous créez, documents que vous téléchargez et informations organisationnelles.',
                'School data: records you create, documents you upload, and organizational information.',
                'Kalanso kunnafoniw: gafew aw bɛ minw dilan, sɛbɛnw aw bɛ minw ladon ani sigida kunnafoniw.'
              )}
            </li>
            <li>
              {getContent(
                'Données d\'utilisation : interactions avec l\'application, fonctionnalités utilisées et temps passé.',
                'Usage data: interactions with the application, features used, and time spent.',
                'Baara kɛcogo kunnafoniw: musaka kɛlen application la, nafaw cɛlaw ani waati min banna.'
              )}
            </li>
          </ul>
        </motion.section>

        <motion.section 
          variants={sectionVariants} 
          className={`mb-8 p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}`}
        >
          <h2 className={`text-xl md:text-2xl font-semibold mb-3 ${texts_color}`}>
            {getContent(
              '2. Comment nous utilisons vos informations',
              '2. How We Use Your Information',
              '2. An bɛ aw ka kunnafoniw kɛ cogow la'
            )}
          </h2>
          <p className={`mb-3 ${texts_color} opacity-75`}>
            {getContent(
              'Nous utilisons les informations que nous collectons pour :', 
              'We use the information we collect to:',
              'An bɛ kunnafoniw minw cɛ olu kɛ:'
            )}
          </p>
          <ul className={`list-disc pl-6 ${texts_color} opacity-75`}>
            <li className="mb-2">
              {getContent(
                'Fournir, maintenir et améliorer l\'application School Manager.',
                'Provide, maintain, and improve the School Manager application.',
                'Ka SchoolManager application di, k\'a mara, ani k\'a ɲɛ.'
              )}
            </li>
            <li className="mb-2">
              {getContent(
                'Traiter et compléter les transactions, et envoyer les informations associées.',
                'Process and complete transactions, and send related information.',
                'Ka warilabɔliw kɛ, k\'u dafa, ani ka kunnafoniw ci.'
              )}
            </li>
            <li className="mb-2">
              {getContent(
                'Envoyer des avis techniques, des mises à jour, des alertes de sécurité et des messages d\'assistance.',
                'Send technical notices, updates, security alerts, and support messages.',
                'Ka kibaruciw ci baara cogoya, kurayaliw, lakana kibaruciw ani dɛmɛ ciw kan.'
              )}
            </li>
            <li>
              {getContent(
                'Analyser les modèles d\'utilisation pour améliorer l\'expérience utilisateur et les performances de l\'application.',
                'Analyze usage patterns to improve user experience and application performance.',
                'Ka baara kɛli cogoya sɛgɛsɛgɛ walasa k\'a yiriwali n\'a baara kɛcogo nɔgɔya baarakɛla ye.'
              )}
            </li>
          </ul>
        </motion.section>

        <motion.section 
          variants={sectionVariants} 
          className={`mb-8 p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}`}
        >
          <h2 className={`text-xl md:text-2xl font-semibold mb-3 ${texts_color}`}>
            {getContent(
              '3. Partage de vos informations',
              '3. Sharing Your Information',
              '3. Aw ka kunnafoniw tilali'
            )}
          </h2>
          <p className={`mb-3 ${texts_color} opacity-75`}>
            {getContent(
              'Nous ne vendons ni ne louons vos informations personnelles à des tiers. Nous pouvons partager vos informations dans les circonstances suivantes :', 
              'We do not sell or rent your personal information to third parties. We may share your information in the following circumstances:',
              'An tɛ aw kelen kelen ka kunnafoniw feere walima k\'a singa mɔgɔ wɛrɛw ma. An bɛ se ka aw ka kunnafoniw tilatila cogoya ninnu na:'
            )}
          </p>
          <ul className={`list-disc pl-6 ${texts_color} opacity-75`}>
            <li className="mb-2">
              {getContent(
                'Avec des prestataires de services qui ont besoin d\'y accéder pour effectuer des services en notre nom.',
                'With service providers who need access to perform services on our behalf.',
                'Ni baarakɛla minnu mako bɛ a la ka don a kɔnɔ walasa ka baara kɛ an ye.'
              )}
            </li>
            <li className="mb-2">
              {getContent(
                'Si requis par la loi, la réglementation ou une procédure légale.',
                'If required by law, regulation, or legal process.',
                'Ni sariya, walima fɛɛrɛ dɔ y\'a ɲini.'
              )}
            </li>
            <li>
              {getContent(
                'Dans le cadre d\'un abonnement scolaire ou de district, avec les administrateurs qui gèrent le compte.',
                'In connection with a school or district subscription, with administrators who manage the account.',
                'Ni kalanso walima mara dɔ ye sanni kɛ, ni fanga mara mɔgɔw min b\'u jɔyɔrow ɲɛnabɔ.'
              )}
            </li>
          </ul>
        </motion.section>

        <motion.section 
          variants={sectionVariants} 
          className={`mb-8 p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}`}
        >
          <h2 className={`text-xl md:text-2xl font-semibold mb-3 ${texts_color}`}>
            {getContent(
              '4. Sécurité des données',
              '4. Data Security',
              '4. Kunnafoniw Lakana'
            )}
          </h2>
          <p className={`${texts_color} opacity-75`}>
            {getContent(
              'Nous mettons en œuvre des mesures de sécurité raisonnables pour protéger vos informations personnelles contre tout accès, altération, divulgation ou destruction non autorisés. Cela inclut le chiffrement, le stockage sécurisé des bases de données et des évaluations régulières de la sécurité. Cependant, aucune méthode de transmission ou de stockage électronique n\'est sécurisée à 100%, et nous ne pouvons garantir une sécurité absolue.',
              'We implement reasonable security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction. This includes encryption, secure database storage, and regular security assessments. However, no method of electronic transmission or storage is 100% secure, and we cannot guarantee absolute security.',
              'An bɛ fɛɛrɛw tigɛ minnu ka kan walasa ka aw kunnafoniw lakana ka bɔ doni, yɛlɛmani, yirali, walima tiɲɛni fɛ ni izini tɛ. O kɔnɔ dogoli, kunnafoniw marayɔrɔ lakana, ani tuma ni tuma lakana segesegeli bɛ kɛ. O bɛɛ la, cakɛda kunnafoni cili ani marayɔrɔw si tɛ kisi 100%, an tɛ se ka da a la ko fosi tɛna kɛ.'
            )}
          </p>
        </motion.section>

        <motion.section 
          variants={sectionVariants} 
          className={`mb-8 p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}`}
        >
          <h2 className={`text-xl md:text-2xl font-semibold mb-3 ${texts_color}`}>
            {getContent(
              '5. Vos droits et choix',
              '5. Your Rights and Choices',
              '5. Aw ka josiriw ani sugandiliw'
            )}
          </h2>
          <p className={`mb-3 ${texts_color} opacity-75`}>
            {getContent(
              'En fonction de votre localisation, vous pouvez avoir certains droits concernant vos informations personnelles :', 
              'Depending on your location, you may have certain rights regarding your personal information:',
              'Ka da aw sigiyɔrɔ kan, aw bɛ se ka josiriw sɔrɔ aw kelen-kelen ka kunnafoniw kan:'
            )}
          </p>
          <ul className={`list-disc pl-6 ${texts_color} opacity-75`}>
            <li className="mb-2">
              {getContent(
                'Accéder et mettre à jour vos informations personnelles via les paramètres de votre compte.',
                'Access and update your personal information through your account settings.',
                'Ka don ani ka aw kelen-kelen ka kunnafoniw kurayali kɛ aw ka jɔyɔrɔ labɛn fɛ.'
              )}
            </li>
            <li className="mb-2">
              {getContent(
                'Demander la suppression de votre compte et de vos informations personnelles.',
                'Request deletion of your account and personal information.',
                'Ka aw ka jɔyɔrɔ n\'aw kelen-kelen ka kunnafoniw jɔsi ɲini.'
              )}
            </li>
            <li className="mb-2">
              {getContent(
                'S\'opposer à certains traitements de vos données.',
                'Object to certain processing of your data.',
                'K\'aw jugu aw ka kunnafoniw labaara cogoya dɔw ma.'
              )}
            </li>
            <li>
              {getContent(
                'Droits de portabilité des données pour obtenir une copie de vos données dans un format structuré.',
                'Data portability rights to obtain a copy of your data in a structured format.',
                'Kunnafoni tali josiriw walasa k\'aw ka kunnafoni jarada sɔrɔ cogoya labɛnnen na.'
              )}
            </li>
          </ul>
        </motion.section>

        <motion.section 
          variants={sectionVariants} 
          className={`mb-8 p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}`}
        >
          <h2 className={`text-xl md:text-2xl font-semibold mb-3 ${texts_color}`}>
            {getContent(
              '6. Confidentialité des enfants',
              '6. Children\'s Privacy',
              '6. Denmisɛnw ka gundo mara'
            )}
          </h2>
          <p className={`${texts_color} opacity-75`}>
            {getContent(
              'L\'application School Manager est conçue pour être utilisée par des établissements d\'enseignement et peut collecter des informations auprès d\'élèves de moins de 13 ans. Nous respectons la loi sur la protection de la vie privée des enfants en ligne (COPPA) et des réglementations similaires. Nous ne collectons des informations auprès des enfants qu\'avec le consentement approprié des parents ou tuteurs légaux, ou par l\'intermédiaire d\'établissements d\'enseignement qui ont obtenu les consentements nécessaires.',
              'The School Manager application is designed for use by educational institutions and may collect information from students under 13 years of age. We comply with the Children\'s Online Privacy Protection Act (COPPA) and similar regulations. We only collect information from children with appropriate consent from parents or legal guardians, or through educational institutions that have obtained necessary consents.',
              'SchoolManager application dilannin don kalansow baara kama, a bɛ se ka kunnafoniw cɛ kalandenw min si tɛ san 13 bɔ. An bɛ Denmisɛnw ka lakana sariya internetiko (COPPA) ani sariya wɛrɛw kun. An bɛ kunnafoniw cɛ denmisɛnw fe ni u fadenw, u lakanabaagaw walima u ka kalansow ye son dɔrɔn.'
            )}
          </p>
        </motion.section>

        <motion.section 
          variants={sectionVariants} 
          className={`mb-8 p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}`}
        >
          <h2 className={`text-xl md:text-2xl font-semibold mb-3 ${texts_color}`}>
            {getContent(
              '7. Modifications de cette politique',
              '7. Changes to This Policy',
              '7. Nin sariya yɛlɛmani'
            )}
          </h2>
          <p className={`${texts_color} opacity-75`}>
            {getContent(
              'Nous pouvons mettre à jour cette politique de confidentialité de temps à autre pour refléter des changements dans nos pratiques ou pour d\'autres raisons opérationnelles, légales ou réglementaires. Nous vous informerons de tout changement important en publiant la nouvelle politique de confidentialité sur cette page et en mettant à jour la date de "Dernière mise à jour". Nous vous conseillons de consulter périodiquement cette politique de confidentialité pour prendre connaissance des changements.',
              'We may update this Privacy Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We will notify you of any material changes by posting the new Privacy Policy on this page and updating the "Last Updated" date. You are advised to review this Privacy Policy periodically for any changes.',
              'An bɛ se ka nin gundo mara sariya kurayali kɛ tuma ni tuma walasa k\'an ka baara kɛcogo yɛlɛmaniw jira walima sababu wɛrɛw la. An bɛn\'aw lasɔmi yɛlɛmani kɛlen juguw kan ni gundo mara sariya kura sigili ye nin gafe kan ani "A laban labɛn" don suguya. An b\'aw ladi ka nin gundo mara sariya lajɛ tuma ni tuma walasa ka yɛlɛmaniw dɔn.'
            )}
          </p>
        </motion.section>

        <motion.section 
          variants={sectionVariants} 
          className={`mb-8 p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}`}
        >
          <h2 className={`text-xl md:text-2xl font-semibold mb-3 ${texts_color}`}>
            {getContent(
              '8. Contactez-nous',
              '8. Contact Us',
              '8. Anw join'
            )}
          </h2>
          <p className={`${texts_color} opacity-75`}>
            {getContent(
              'Si vous avez des questions concernant cette politique de confidentialité ou nos pratiques en matière de données, veuillez nous contacter à privacy@schoolmanager.com ou nous écrire à : School Manager, Voix de l\'Éducation, Ville d\'Apprentissage.',
              'If you have any questions about this Privacy Policy or our data practices, please contact us at privacy@schoolmanager.com or write to us at: School Manager, Education Street, Learning City.',
              'N\'aw fɛ ka fɛn dɔw ɲininkan nin gundo mara sariya walima anw ka kunnafoni mara cogoya kan, aw ye anw join privacy@schoolmanager.com la walima aw ye sɛbɛnni kɛ anw ma: School Manager, Kalan Sira kan, Kalanduguba.'
            )}
          </p>
        </motion.section>
      </div>
    </motion.div>
  );
};

export default PrivacyPolicy; 