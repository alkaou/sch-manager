// PDF-specific styles
export const addPdfStyles = () => {
  // Check if styles already exist
  if (document.getElementById('pdf-styles')) return;
  
  // Create style element
  const style = document.createElement('style');
  style.id = 'pdf-styles';
  style.innerHTML = `
    @media print {
      .no-print {
        display: none !important;
      }
    }
    
    .pdf-container {
      background-color: white;
    }
  `;
  
  // Add to document head
  document.head.appendChild(style);
};