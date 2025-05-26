// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
const { contextBridge, ipcRenderer } = require('electron');

// Exposer des API sécurisées au processus de rendu
contextBridge.exposeInMainWorld('electron', {
  // Fonctions existantes
  getDatabase: () => ipcRenderer.invoke('get-database'),
  saveDatabase: (db) => ipcRenderer.invoke('save-database', db),
  
  // Fonctions pour les listes d'élèves
  saveStudentList: (listData) => ipcRenderer.invoke('saveStudentList', listData),
  getStudentLists: () => ipcRenderer.invoke('getStudentLists'),
  deleteStudentList: (listId) => ipcRenderer.invoke('deleteStudentList', listId),
  
  // Nouvelles fonctions pour les enrollments et snapshots
  getEnrollments: () => ipcRenderer.invoke('get-enrollments'),
  getSnapshots: () => ipcRenderer.invoke('get-snapshots'),
  getEnrollmentStats: (schoolYear) => ipcRenderer.invoke('get-enrollment-stats', schoolYear),
});