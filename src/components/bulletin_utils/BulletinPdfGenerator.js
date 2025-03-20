import jsPDF from 'jspdf';
import html2canvas from 'html2canvas-pro';
import React from 'react';
import ReactDOM from 'react-dom';
import BulletinComponent from '../BulletinComponent.jsx';

// Générer un PDF pour plusieurs bulletins
export const generateMultipleBulletinsPDF = async ({
  students,
  allStudents,
  subjects,
  composition,
  className,
  bulletinsPerPage,
  language,
  school_name,
  school_short_name,
  school_zone_name,
}) => {
  // Créer un nouveau document PDF
  const pdf = new jsPDF({
    orientation: bulletinsPerPage === 1 ? 'portrait' : 'landscape',
    unit: 'mm',
    format: 'a4',
  });

  // Dimensions de la page
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  // Créer un conteneur temporaire pour le rendu des bulletins
  const container = document.createElement('div');
  document.body.appendChild(container);

  // Traiter chaque élève
  for (let i = 0; i < students.length; i++) {
    // Créer un élément div pour contenir le bulletin
    const bulletinContainer = document.createElement('div');
    bulletinContainer.style.width = bulletinsPerPage === 1 ? '210mm' : '148mm'; // A4 width or half A4 width
    bulletinContainer.style.height = bulletinsPerPage === 1 ? '297mm' : '210mm'; // A4 height or half A4 height
    bulletinContainer.style.overflow = 'hidden';
    bulletinContainer.style.position = 'relative';
    
    // Ajouter le conteneur au DOM
    container.appendChild(bulletinContainer);
    
    // Rendre le composant BulletinComponent dans le conteneur
    ReactDOM.render(
      <BulletinComponent
        student={students[i]}
        subjects={subjects}
        composition={composition}
        className={className}
        calculateSubjectAverageForStudent={(students, studentId, subjectName) => {
          const student = students.find(s => s.id === studentId);
          if (!student || !student.notes[subjectName]) return "-";
          
          const classeNote = student.notes[subjectName].classe;
          const compoNote = student.notes[subjectName].composition;
          
          if (classeNote === null && compoNote !== null) return compoNote.toFixed(2);
          if (classeNote !== null && compoNote === null) return classeNote.toFixed(2);
          if (classeNote === null && compoNote === null) return "-";
          
          const average = (classeNote + (compoNote * 2)) / 3;
          return average.toFixed(2);
        }}
        calculateGeneralAverage={(students, studentId, subjects) => {
          const student = students.find(s => s.id === studentId);
          if (!student) return "-";
          
          let totalPoints = 0;
          let totalCoefficients = 0;
          
          subjects.forEach(subject => {
            const subjectAvg = student.notes[subject.name] ? 
              ((student.notes[subject.name].classe || 0) + ((student.notes[subject.name].composition || 0) * 2)) / 3 : 
              "-";
              
            if (subjectAvg !== "-") {
              totalPoints += parseFloat(subjectAvg) * subject.coefficient;
              totalCoefficients += subject.coefficient;
            }
          });
          
          if (totalCoefficients === 0) return "-";
          return (totalPoints / totalCoefficients).toFixed(2);
        }}
        theme="light" // Toujours utiliser le thème clair pour les PDF
        textClass="text-gray-800"
        language={language}
        students={allStudents}
        handleCloseBulletinPreview={() => {}}
        school_name={school_name}
        school_short_name={school_short_name}
        school_zone_name={school_zone_name}
      />,
      bulletinContainer
    );
    
    // Attendre que le rendu soit terminé
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Capturer le bulletin en image
    const canvas = await html2canvas(bulletinContainer.querySelector('[ref="printRef"]') || bulletinContainer, { 
      scale: 2,
      useCORS: true,
      allowTaint: true,
      logging: false
    });
    
    const imgData = canvas.toDataURL('image/png');
    
    // Si on a 2 bulletins par page
    if (bulletinsPerPage === 2) {
      // Premier bulletin de la paire (gauche)
      if (i % 2 === 0) {
        pdf.addImage(imgData, 'PNG', 0, 0, pageWidth / 2 - 5, pageHeight);
        
        // Si c'est le dernier élève, ajouter la page
        if (i === students.length - 1) {
          // La page est déjà ajoutée
        }
      } 
      // Deuxième bulletin de la paire (droite)
      else {
        pdf.addImage(imgData, 'PNG', pageWidth / 2 + 5, 0, pageWidth / 2 - 5, pageHeight);
        
        // Ajouter une nouvelle page si ce n'est pas le dernier élève
        if (i < students.length - 1) {
          pdf.addPage();
        }
      }
    } 
    // Un seul bulletin par page
    else {
      pdf.addImage(imgData, 'PNG', 0, 0, pageWidth, pageHeight);
      
      // Ajouter une nouvelle page si ce n'est pas le dernier élève
      if (i < students.length - 1) {
        pdf.addPage();
      }
    }
    
    // Nettoyer
    ReactDOM.unmountComponentAtNode(bulletinContainer);
    container.removeChild(bulletinContainer);
  }
  
  // Nettoyer le conteneur principal
  ReactDOM.unmountComponentAtNode(container);
  document.body.removeChild(container);
  
  // Nom du fichier
  const fileName = `Bulletins_${className}_${composition.label.replace(/\s+/g, '_')}.pdf`;
  
  // Télécharger le PDF
  pdf.save(fileName);
  
  return fileName;
};