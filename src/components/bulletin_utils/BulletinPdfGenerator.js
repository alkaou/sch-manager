import jsPDF from 'jspdf';
import html2canvas from 'html2canvas-pro';

// Générer un PDF pour plusieurs bulletins
export const generateMultipleBulletinsPDF = async ({
  students,
  composition,
  className,
  bulletinsPerPage,
  allStudentBulletinRefs,
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

  let bulletinsForPrint = [];
  const prepareBulletinsForPrint = () => {
    bulletinsForPrint = [];
    // Traiter chaque élève
    for (const every_student of students) {
      const bulletin = allStudentBulletinRefs.find(item => item.studentId === every_student.id);
      if (bulletin !== undefined) {
        bulletinsForPrint = [...bulletinsForPrint, bulletin];
      }
    }
  };

  await prepareBulletinsForPrint();

  // console.log(bulletinsForPrint);

  let bulletinImages = [];
  const getBulletinImages = async () => {
    bulletinImages = [];
    for (const st_ref of bulletinsForPrint) {
      const printRef = st_ref.studentBulletinRef;
      const element = printRef.current;
      // Capture l'élément en image avec html2canvas
      const canvas = await html2canvas(element, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      // console.log(imgData);
      bulletinImages = [...bulletinImages, imgData];
    }
  }

  // Utiliser await pour s'assurer que getBulletinImages() se termine avant de continuer
  await getBulletinImages()
  // console.log(bulletinImages.length);

  const generateBulletins = async () => {
    if (bulletinsPerPage === 2) {
      // Marges éventuelles
      const margin = 2;
      const usableWidth = pageWidth - 2 * margin;
      const usableHeight = pageHeight - 2 * margin;
      // Largeur de chaque bulletin (disposition côte à côte)
      const bulletinWidth = usableWidth / 2;
      const bulletinHeight = usableHeight; // toute la hauteur disponible

      for (let i = 0; i < bulletinImages.length; i += 2) {
        const groupe = bulletinImages.slice(i, i + 2);
        // console.log(groupe); // Affiche par exemple ["image1.jpg", "image2.jpg"], puis ["image3.jpg", "image4.jpg"]
        // console.log(i);
        if (groupe.length === 2) {
          // Premier bulletin à gauche
          pdf.addImage(groupe[0], 'PNG', margin, margin, bulletinWidth, bulletinHeight);
          // Deuxième bulletin à droite
          const snd_margin = margin + bulletinWidth;
          pdf.addImage(groupe[1], 'PNG', snd_margin, margin, bulletinWidth, bulletinHeight);
          if (i <= bulletinImages.length - 3) {
            pdf.addPage();
          }
        } else {
          pdf.addImage(groupe[0], 'PNG', margin, margin, bulletinWidth, bulletinHeight);
        }
      }
    } else {

      for (const [index, imgData] of bulletinImages.entries()) {
        pdf.addImage(imgData, 'PNG', 12, 0, pageWidth - 24, pageHeight);
        if (index < bulletinImages.length - 1) {
          pdf.addPage();
        }
      }
    }
  }

  await generateBulletins();

  // Nom du fichier
  const fileName = `Bulletins_${className}_${composition.label.replace(/\s+/g, '_')}.pdf`;

  // Télécharger le PDF
  pdf.save(fileName);

  return fileName;

};
