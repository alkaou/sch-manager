import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import BulletinComponent from '../BulletinComponent.jsx';
import {calculateSubjectAverageForStudent, calculateGeneralAverage} from '../bulletin_utils/BulletinMethods';

const BulletinCard = ({
  student,
  students,
  subjects,
  composition,
  className,
  theme,
  textClass,
  language,
  school_name,
  school_short_name,
  school_zone_name,
  getStudentBulletinRef,
}) => {

  const printRef = useRef(null);

  // Utiliser votre composant BulletinComponent existant
  return (
    <motion.div 
      className="w-full"
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.2 }}
    >
      <BulletinComponent
        student={student}
        subjects={subjects}
        composition={composition}
        className={className}
        calculateSubjectAverageForStudent={calculateSubjectAverageForStudent}
        calculateGeneralAverage={calculateGeneralAverage}
        theme={theme}
        textClass={textClass}
        language={language}
        students={students}
        handleCloseBulletinPreview={() => {}} // Cette fonction ne sera pas utilisée dans ce contexte
        school_name={school_name}
        school_short_name={school_short_name}
        school_zone_name={school_zone_name}
        showPrintBottonBtn={false}
        printRef={printRef}
        getStudentBulletinRef={getStudentBulletinRef}
      />
    </motion.div>
  );
};

export default BulletinCard;