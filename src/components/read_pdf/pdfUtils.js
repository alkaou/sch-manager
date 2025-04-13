import scito_litta from "../../assets/pdf/HISTOIRE-DE-SCITO-ET-LITTA.pdf";
import aventure_ali from "../../assets/pdf/Les-Miracles-de-l_education.pdf";
import aissata_connais from "../../assets/pdf/aissata_connaissance.pdf";
import odysee_maimouna from "../../assets/pdf/aventure_maimouna.pdf";


// This function would normally fetch PDF files from the server
// For now, we'll simulate it with some sample data
export const getPDFFiles = async () => {
  // In a real application, you would fetch this data from your backend
  // For example: const response = await fetch('/api/pdf-files');
  
  // For demonstration purposes, we'll return mock data
  // In a real app, you would replace this with actual API calls
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 1,
          name: "HISTOIRE DE SCITO ET LITTA.pdf",
          url: scito_litta, // Chemin relatif corrigé
          dateAdded: "20-04-2025",
          size: "534 ko"
        },
        {
          id: 2,
          name: "Les Miracles de l'Éducation : L'Histoire d'Ali.pdf",
          url: aventure_ali, // Chemin relatif corrigé
          dateAdded: "20-04-2025",
          size: "452 ko"
        },
        {
          id: 3,
          name: "Aïssata au Cœur de la Connaissance.pdf",
          url: aissata_connais, // Chemin relatif corrigé
          dateAdded: "20-04-2025",
          size: "149 ko"
        },
        {
          id: 4,
          name: "Les Miracles de l'Éducation - L'Odyssée de Maïmouna.pdf",
          url: odysee_maimouna, // Chemin relatif corrigé
          dateAdded: "20-04-2025",
          size: "477 ko"
        }
      ]);
    }, 1000);
  });
};
