import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { getClasseName } from '../../utils/helpers';

// Create styles
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica',
  },
  title: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  table: {
    display: 'table',
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#bfbfbf',
    marginBottom: 10,
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableRowEven: {
    flexDirection: 'row',
    backgroundColor: '#f9f9f9',
  },
  tableHeaderCell: {
    backgroundColor: '#f0f0f0',
    fontWeight: 'bold',
    padding: 5,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#bfbfbf',
  },
  tableCell: {
    padding: 5,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#bfbfbf',
  },
  pageNumber: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 10,
  },
  customMessage: {
    position: 'absolute',
    bottom: 50,
    right: 30,
    textAlign: 'right',
  },
  customMessageText: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  customMessageDate: {
    fontSize: 10,
  },
});

const StudentListPDF = ({ list, db }) => {
  // Get all headers (standard + custom)
  const allHeaders = [...list.headers, ...list.customHeaders];
  
  // Always ensure Prénom and Nom are included
  if (!allHeaders.includes('Prénom')) allHeaders.unshift('Prénom');
  if (!allHeaders.includes('Nom') && allHeaders.includes('Prénom')) allHeaders.splice(1, 0, 'Nom');
  
  // If N° is selected, move it to the first position
  if (allHeaders.includes('N°')) {
    const index = allHeaders.indexOf('N°');
    allHeaders.splice(index, 1);
    allHeaders.unshift('N°');
  }
  
  // Get student data for a specific header
  const getStudentData = (student, header) => {
    if (header === 'N°') {
      return list.students.indexOf(student) + 1;
    }
    
    if (header === 'Prénom') return student.first_name || '';
    if (header === 'Nom') return student.last_name || '';
    if (header === 'Matricule') return student.matricule || '';
    if (header === 'Père') return student.father_name || '';
    if (header === 'Mère') return student.mother_name || '';
    if (header === 'Contact') return student.parents_contact || '';
    if (header === 'Date de naissance') return student.birth_date || '';
    if (header === 'Moyenne') return student.average || '';
    if (header === 'Classe') {
      const classObj = db?.classes?.find(c => c.id === student.class_id);
      return classObj ? getClasseName(classObj) : '';
    }
    if (header === 'Âge') {
      if (!student.birth_date) return '';
      const birthDate = new Date(student.birth_date);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      return age.toString();
    }
    if (header === 'Sexe') return student.sexe || '';
    if (header === 'Signature') return '';
    
    // Custom header
    return student.customData && student.customData[header] ? student.customData[header] : '';
  };
  
  // Calculate column widths
  const getColumnWidth = (header) => {
    if (header === 'N°') return '8%';
    if (header === 'Prénom' || header === 'Nom') return '15%';
    if (header === 'Date de naissance') return '15%';
    return `${70 / (allHeaders.length - 3)}%`;  // Distribute remaining width
  };
  
  // Split students into pages (approximately 25 students per page)
  const studentsPerPage = list.orientation === 'portrait' ? 25 : 30;
  const pages = [];
  for (let i = 0; i < list.students.length; i += studentsPerPage) {
    pages.push(list.students.slice(i, i + studentsPerPage));
  }
  
  // Add an empty page if needed for the custom message
  if (list.customMessage.show && list.students.length > 0 && list.students.length % studentsPerPage === 0) {
    pages.push([]);
  }
  
  // Apply title styles
  const titleStyles = {
    fontSize: list.title.style.fontSize || 18,
    fontWeight: list.title.style.fontWeight === 'bold' ? 'bold' : 'normal',
    fontStyle: list.title.style.fontStyle === 'italic' ? 'italic' : 'normal',
    textAlign: list.title.style.textAlign || 'center',
    textDecoration: list.title.style.textDecoration === 'underline' ? 'underline' : 'none',
    color: list.title.style.color || '#000000',
    marginBottom: 20,
  };
  
  return (
    <Document>
      {pages.map((pageStudents, pageIndex) => (
        <Page 
          key={pageIndex}
          size="A4"
          orientation={list.orientation}
          style={styles.page}
        >
          {/* Title */}
          <Text style={titleStyles}>
            {list.title.text}
          </Text>
          
          {/* Table */}
          {pageStudents.length > 0 && (
            <View style={styles.table}>
              {/* Table Header */}
              <View style={styles.tableRow}>
                {allHeaders.map(header => (
                  <View 
                    key={header} 
                    style={[
                      styles.tableHeaderCell,
                      { width: getColumnWidth(header) }
                    ]}
                  >
                    <Text>{header}</Text>
                  </View>
                ))}
              </View>
              
              {/* Table Rows */}
              {pageStudents.map((student, index) => (
                <View 
                  key={student.id} 
                  style={index % 2 === 0 ? styles.tableRow : styles.tableRowEven}
                >
                  {allHeaders.map(header => (
                    <View 
                      key={`${student.id}-${header}`} 
                      style={[
                        styles.tableCell,
                        { width: getColumnWidth(header) }
                      ]}
                    >
                      <Text>{getStudentData(student, header)}</Text>
                    </View>
                  ))}
                </View>
              ))}
            </View>
          )}
          
          {/* Custom message (only on the last page) */}
          {list.customMessage.show && pageIndex === pages.length - 1 && (
            <View style={styles.customMessage}>
              <Text style={styles.customMessageText}>{list.customMessage.text}</Text>
              <Text style={styles.customMessageDate}>
                Fait, le {new Date(list.customMessage.date).toLocaleDateString()}
              </Text>
            </View>
          )}
          
          {/* Page number */}
          <Text style={styles.pageNumber}>
            Page {pageIndex + 1} / {pages.length}
          </Text>
        </Page>
      ))}
    </Document>
  );
};

export default StudentListPDF;