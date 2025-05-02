import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage, useTheme } from '../components/contexts';

const TermsOfUse = () => {
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
        <Link to="/" style={{fontWeight: "bold"}} className={`inline-flex items-center mb-6 btn btn-primary`}>
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
              'Conditions d\'Utilisation',
              'Terms of Use',
              'Baara kɛcogo Sariyaw'
            )}
          </h1>
          <p className={`text-lg ${text_color} opacity-75`}>
            {getContent(
              'Dernière mise à jour : Juillet 2025. Veuillez lire attentivement ces conditions avant d\'utiliser l\'application School Manager.',
              'Last updated: July 2025. Please read these terms and conditions carefully before using the School Manager application.',
              'A laban labɛnna: Juyekalo san 2025. Aw ye nin sariyaw kalan ka ɲɛ sani aw ka SchoolManager application baara kɛ.'
            )}
          </p>
        </motion.div>

        <motion.section 
          variants={sectionVariants} 
          className={`mb-8 p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}`}
        >
          <h2 className={`text-xl md:text-2xl font-semibold mb-3 ${texts_color}`}>
            {getContent(
              '1. Acceptation des conditions',
              '1. Acceptance of Terms',
              '1. Sariyaw sɔnni'
            )}
          </h2>
          <p className={`${texts_color} opacity-75`}>
            {getContent(
              'En accédant ou en utilisant l\'application School Manager, vous acceptez d\'être lié par ces Conditions d\'Utilisation et toutes les lois et réglementations applicables. Si vous n\'êtes pas d\'accord avec l\'une de ces conditions, vous n\'êtes pas autorisé à utiliser ou à accéder à cette application. Les matériaux contenus dans cette application sont protégés par le droit d\'auteur et les lois sur les marques applicables.',
              'By accessing or using the School Manager application, you agree to be bound by these Terms of Use and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this application. The materials contained in this application are protected by applicable copyright and trademark law.',
              'Ni aw ye SchoolManager application baara kɛ, aw sɔnna ka don nin sariyaw ni laɲiniw kɔnɔ. Ni aw ma sɔn nin sariyaw ma, aw tɛ se ka nin application baara kɛ. Application kɔnɔ fɛnw lakanalenw don ni gafe labaaraliw ye.'
            )}
          </p>
        </motion.section>

        <motion.section 
          variants={sectionVariants} 
          className={`mb-8 p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}`}
        >
          <h2 className={`text-xl md:text-2xl font-semibold mb-3 ${texts_color}`}>
            {getContent(
              '2. Licence d\'utilisation',
              '2. License to Use',
              '2. Baara kɛli yɔrɔ'
            )}
          </h2>
          <p className={`mb-3 ${texts_color} opacity-75`}>
            {getContent(
              'L\'autorisation est accordée d\'utiliser temporairement l\'application School Manager à des fins personnelles, éducatives ou commerciales conformément à votre forfait d\'abonnement. Il s\'agit de l\'octroi d\'une licence, et non d\'un transfert de titre, et en vertu de cette licence, vous ne pouvez pas :',
              'Permission is granted to temporarily use the School Manager application for personal, educational, or commercial purposes in accordance with your subscription plan. This is the grant of a license, not a transfer of title, and under this license you may not:',
              'Izini bɛ aw ma ka SchoolManager application baara kɛ aw yɛrɛ kama, kalan walima baara kama ka kɛɲɛ ni aw ka fɛɛrɛ ye. Nin ye sariya tali ye, a tɛ tɔgɔ yɛlɛmani ye, ani nin sariya kɔnɔ, aw tɛ se ka:'
            )}
          </p>
          <ul className={`list-disc pl-6 ${texts_color} opacity-75`}>
            <li className="mb-2">
              {getContent(
                'Modifier ou copier les matériaux en dehors de l\'utilisation normale de l\'application;',
                'Modify or copy the materials outside of normal application use;',
                'Ka fɛnw yɛlɛma walima ka u ladɛgɛ application baara kɛli kɔ;'
              )}
            </li>
            <li className="mb-2">
              {getContent(
                'Tenter de décompiler ou d\'effectuer une ingénierie inverse de tout logiciel contenu dans School Manager;',
                'Attempt to decompile or reverse engineer any software contained in the School Manager;',
                'Ka SchoolManager application kɔnɔ software bɔsi walima ka u lasegin kɔ fɛ;'
              )}
            </li>
            <li className="mb-2">
              {getContent(
                'Supprimer tout droit d\'auteur ou autres notations de propriété des matériaux;',
                'Remove any copyright or other proprietary notations from the materials;',
                'Ka gafe tɔgɔw walima tɔgɔla taamasiyɛnw jɔsi fɛnw na;'
              )}
            </li>
            <li>
              {getContent(
                'Transférer les matériaux à une autre personne ou "refléter" les matériaux sur un autre serveur.',
                'Transfer the materials to another person or "mirror" the materials on any other server.',
                'Ka fɛnw di mɔgɔ wɛrɛ ma walima ka u "jirakɛ" server wɛrɛ kan.'
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
              '3. Comptes utilisateurs',
              '3. User Accounts',
              '3. Baarakɛlaw ka jɔyɔrɔw'
            )}
          </h2>
          <p className={`mb-3 ${texts_color} opacity-75`}>
            {getContent(
              'Pour utiliser certaines fonctionnalités de l\'application School Manager, vous pourriez être amené à créer un compte. Vous acceptez de :',
              'To use certain features of the School Manager application, you may be required to create an account. You agree to:',
              'Walasa ka SchoolManager application baara dɔw kɛ, a bɛ se ka kɛ ko aw ka kan ka jɔyɔrɔ dɔ dabɔ. Aw sɔnna ka:'
            )}
          </p>
          <ul className={`list-disc pl-6 ${texts_color} opacity-75`}>
            <li className="mb-2">
              {getContent(
                'Fournir des informations exactes, actuelles et complètes lors du processus d\'inscription;',
                'Provide accurate, current, and complete information during the registration process;',
                'Ka kunnafoni tigitigi, kɔ ni kuntaa diw tɔgɔsɛbɛnni waati;'
              )}
            </li>
            <li className="mb-2">
              {getContent(
                'Maintenir et mettre à jour rapidement les informations de votre compte;',
                'Maintain and promptly update your account information;',
                'Ka aw ka jɔyɔrɔ kunnafoniw lakana ani ka u kurayali kɛ joona;'
              )}
            </li>
            <li className="mb-2">
              {getContent(
                'Être responsable de la protection de votre mot de passe et de toutes les activités qui se produisent sous votre compte;',
                'Be responsible for safeguarding your password and for all activities that occur under your account;',
                'Ka aw ka gundotɔgɔ lakana ani ka lɔn ko ko minw bɛ kɛ aw ka jɔyɔrɔ kɔnɔ, aw de bɛ u kunko ta;'
              )}
            </li>
            <li>
              {getContent(
                'Nous informer immédiatement de toute utilisation non autorisée de votre compte ou de toute autre violation de sécurité.',
                'Notify us immediately of any unauthorized use of your account or any other breach of security.',
                'Ka anw lasɔmi joona ni mɔgɔ dɔ ye aw ka jɔyɔrɔ baara kɛ izini kɔ walima ni lakana tiɲɛni fɛɛrɛ wɛrɛ kɛra.'
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
              '4. Contenu et conduite',
              '4. Content and Conduct',
              '4. Kunnafoni ani Tagamacogow'
            )}
          </h2>
          <p className={`mb-3 ${texts_color} opacity-75`}>
            {getContent(
              'Les utilisateurs de School Manager sont responsables de tout contenu qu\'ils téléchargent, créent ou partagent via l\'application. Vous acceptez de ne pas :',
              'Users of School Manager are responsible for any content they upload, create, or share through the application. You agree not to:',
              'SchoolManager baarakɛlaw bɛ u ka kunnafoniw kun ta, ladoni, dilan walima tilatila kɛ application kɔnɔ. Aw sɔnna ko aw tɛna:'
            )}
          </p>
          <ul className={`list-disc pl-6 ${texts_color} opacity-75`}>
            <li className="mb-2">
              {getContent(
                'Utiliser l\'application pour stocker, partager ou transmettre tout contenu illégal, nuisible, menaçant, abusif, harcelant, diffamatoire ou autrement répréhensible;',
                'Use the application to store, share, or transmit any content that is unlawful, harmful, threatening, abusive, harassing, defamatory, or otherwise objectionable;',
                'Ka application baara kɛ ka kunnafoni jugu, baga, faratili, nkalonya walima sariya tiɲɛni wɛrɛw mara, tilatila walima ci;'
              )}
            </li>
            <li className="mb-2">
              {getContent(
                'Adopter une conduite qui restreint ou empêche quiconque d\'utiliser ou de profiter de l\'application;',
                'Engage in any conduct that restricts or inhibits anyone\'s use or enjoyment of the application;',
                'Ka kɛwale dɔ kɛ min bɛ mɔgɔ wɛrɛw bali ka application baara kɛ walima k\'a diyabɔ;'
              )}
            </li>
            <li>
              {getContent(
                'Utiliser l\'application à des fins illégales ou interdites par ces Conditions.',
                'Use the application for any purpose that is illegal or prohibited by these Terms.',
                'Ka application baara kɛ sariya kama min jatigɛlenw don walima min balilenw don ni nin sariyaw yew.'
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
              '5. Abonnement et paiements',
              '5. Subscription and Payments',
              '5. Tɔgɔsɛbɛnni ani Saraw'
            )}
          </h2>
          <p className={`${texts_color} opacity-75`}>
            {getContent(
              'Certaines fonctionnalités de l\'application School Manager peuvent nécessiter un abonnement. En vous abonnant à notre service, vous acceptez de payer tous les frais conformément aux conditions de facturation. Les frais d\'abonnement ne sont pas remboursables, sauf si la loi l\'exige. Nous nous réservons le droit de modifier les frais d\'abonnement moyennant un préavis raisonnable. Vous êtes responsable de toutes les taxes associées à votre abonnement.',
              'Certain features of the School Manager application may require a subscription. By subscribing to our service, you agree to pay all fees in accordance with the billing terms. Subscription fees are non-refundable except where required by law. We reserve the right to change subscription fees upon reasonable notice. You are responsible for all taxes associated with your subscription.',
              'SchoolManager application baara kɛli dɔw bɛ se ka fɛɛrɛ sanni ɲini. Ni aw ye fɛɛrɛ sanni kɛ, aw sɔnna ka warida bɛɛ di ka kɛɲɛ ni sara kɛ cogoya ye. Fɛɛrɛ sanni sara tɛ segin aw ma, fo ni sariya ye a ɲini. An bɛ se ka fɛɛrɛ sanni sara yɛlɛma ni lasɔmini kɛra. Aw bɛ ninsɔngɔw bɛɛ sara minw bɛ kɛɲɛ ni aw ka tɔgɔsɛbɛnni ye.'
            )}
          </p>
        </motion.section>

        <motion.section 
          variants={sectionVariants} 
          className={`mb-8 p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}`}
        >
          <h2 className={`text-xl md:text-2xl font-semibold mb-3 ${texts_color}`}>
            {getContent(
              '6. Limitation de responsabilité',
              '6. Limitation of Liability',
              '6. Ɲɛmɔgɔya Dankolenw'
            )}
          </h2>
          <p className={`${texts_color} opacity-75`}>
            {getContent(
              'En aucun cas, School Manager, ses dirigeants, administrateurs, employés ou agents ne seront responsables des dommages indirects, punitifs, accessoires, spéciaux ou consécutifs découlant de, ou liés de quelque manière que ce soit à, votre utilisation ou incapacité à utiliser l\'application, que ce soit sur la base d\'un contrat, d\'un délit, d\'une responsabilité stricte ou autre, même si School Manager a été informé de la possibilité de tels dommages.',
              'In no event shall School Manager, its officers, directors, employees, or agents be liable for any indirect, punitive, incidental, special, or consequential damages arising out of, or in any way connected with, your use of or inability to use the application, whether based on contract, tort, strict liability, or otherwise, even if School Manager has been advised of the possibility of such damages.',
              'SchoolManager ni a ɲɛmɔgɔw, a kulebaw, a baarakɛlaw walima a ciden tɛna tiɲɛni foyi sara min bɔra, walima min sirilen don cogoya o cogoya, aw ka application baara kɛli walima aw ka ban walima a baara kɛbaliya la, hali ni a kɛra ni bɛɛjɛkulu cɛ, a juguman, a tiɲɛni walima fɛn wɛrɛ, hali ni SchoolManager lasɔmilen don ko nin tiɲɛni kow bɛ se ka kɛ.'
            )}
          </p>
        </motion.section>

        <motion.section 
          variants={sectionVariants} 
          className={`mb-8 p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}`}
        >
          <h2 className={`text-xl md:text-2xl font-semibold mb-3 ${texts_color}`}>
            {getContent(
              '7. Résiliation',
              '7. Termination',
              '7. Labanni'
            )}
          </h2>
          <p className={`${texts_color} opacity-75`}>
            {getContent(
              'Nous pouvons résilier ou suspendre votre compte et l\'accès à l\'application School Manager immédiatement, sans préavis ni responsabilité, pour quelque raison que ce soit, y compris, sans limitation, si vous enfreignez ces Conditions d\'Utilisation. À la résiliation, votre droit d\'utiliser l\'application cessera immédiatement. Toutes les dispositions de ces Conditions qui, par leur nature, devraient survivre à la résiliation, survivront, y compris, sans limitation, les dispositions de propriété, les clauses de non-responsabilité, l\'indemnisation et les limitations de responsabilité.',
              'We may terminate or suspend your account and access to the School Manager application immediately, without prior notice or liability, for any reason, including, without limitation, if you breach these Terms of Use. Upon termination, your right to use the application will immediately cease. All provisions of these Terms which by their nature should survive termination shall survive, including, without limitation, ownership provisions, warranty disclaimers, indemnity, and limitations of liability.',
              'An bɛ se ka aw ka jɔyɔrɔ ani SchoolManager application baara kɛli jɔ yɔrɔnin kelen, lasɔmini walima ɲɛmɔgɔya kɔ, kun o kun na, a kɛli la, ka dan balikɛ, ni aw ye nin kɛwale sariyaw tiɲɛ. Labanni kɔfɛ, aw ka jo ka application baara kɛ bɛna jɔ yɔrɔnin kelen. Nin sariyaw fɛn bɛɛ minw bɛ kan ka to u ɲɛ na labanni kɔfɛ, olu bɛna to u ɲɛ na, a kɛli la, ka dan balikɛ, tigiyadaw, basi tɛ fɛnw, tiɲɛni saraw ani ɲɛmɔgɔya dankolenw.'
            )}
          </p>
        </motion.section>

        <motion.section 
          variants={sectionVariants} 
          className={`mb-8 p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}`}
        >
          <h2 className={`text-xl md:text-2xl font-semibold mb-3 ${texts_color}`}>
            {getContent(
              '8. Loi applicable',
              '8. Governing Law',
              '8. Sariya Barakɛtaw'
            )}
          </h2>
          <p className={`${texts_color} opacity-75`}>
            {getContent(
              'Ces Conditions seront régies et interprétées conformément aux lois de la juridiction dans laquelle School Manager est basé, sans tenir compte de ses dispositions relatives aux conflits de lois. Notre incapacité à faire respecter tout droit ou disposition de ces Conditions ne sera pas considérée comme une renonciation à ces droits.',
              'These Terms shall be governed by construed in accordance with the laws of the jurisdiction in which School Manager is based, without regard to its conflict of law provisions. Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.',
              'Nin sariyaw bɛna mara ka kɛɲɛ ni SchoolManager sigilen mara sariyaw ye, sariya ɲɔgɔnna ma. An ka dɛsɛli ka jo walima fɛɛrɛ bange nin sariyaw la tɛna jate i n\'a fɔ an banna o jo nin na.'
            )}
          </p>
        </motion.section>

        <motion.section 
          variants={sectionVariants} 
          className={`mb-8 p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}`}
        >
          <h2 className={`text-xl md:text-2xl font-semibold mb-3 ${texts_color}`}>
            {getContent(
              '9. Modifications des conditions',
              '9. Changes to Terms',
              '9. Sariyaw Yɛlɛmani'
            )}
          </h2>
          <p className={`${texts_color} opacity-75`}>
            {getContent(
              'Nous nous réservons le droit, à notre seule discrétion, de modifier ou de remplacer ces Conditions à tout moment. Si une révision est importante, nous fournirons un préavis d\'au moins 30 jours avant l\'entrée en vigueur de nouvelles conditions. Ce qui constitue un changement important sera déterminé à notre seule discrétion. En continuant à accéder ou à utiliser notre application après l\'entrée en vigueur de ces révisions, vous acceptez d\'être lié par les conditions révisées.',
              'We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days\' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion. By continuing to access or use our application after those revisions become effective, you agree to be bound by the revised terms.',
              'An bɛ jo mara, an yɛrɛ nɔ na, ka nin sariyaw yɛlɛma walima ka u falen tuma o tuma. Ni yɛlɛmani nin ye ko jugu ye, an bɛna lasɔmini kɛ don 30 ɲɔgɔn sani sariya kuraw ka daminɛ. Fɛn min bɛ jate ko jugu la, an yɛrɛ ta miiriya bɛna o latigɛ. Ni aw tora ka don walima ka an ka application baara kɛ yɛlɛmaniw daminɛni kɔfɛ, aw sɔnna ka don sariya yɛlɛmanin kɔnɔ.'
            )}
          </p>
        </motion.section>

        <motion.section 
          variants={sectionVariants} 
          className={`mb-8 p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}`}
        >
          <h2 className={`text-xl md:text-2xl font-semibold mb-3 ${texts_color}`}>
            {getContent(
              '10. Contactez-nous',
              '10. Contact Us',
              '10. Anw Sɔrɔ'
            )}
          </h2>
          <p className={`${texts_color} opacity-75`}>
            {getContent(
              'Si vous avez des questions concernant ces Conditions, veuillez nous contacter à terms@schoolmanager.com ou nous écrire à : School Manager, Voix de l\'Éducation, Ville d\'Apprentissage.',
              'If you have any questions about these Terms, please contact us at terms@schoolmanager.com or write to us at: School Manager, Education Street, Learning City.',
              'Ni aw fɛ ka ɲininkali kɛ nin sariyaw kan, aw ye anw sɔrɔ terms@schoolmanager.com la walima aw ye sɛbɛnni kɛ anw ma: School Manager, Kalan Sira, Kalansoba.'
            )}
          </p>
        </motion.section>
      </div>
    </motion.div>
  );
};

export default TermsOfUse; 