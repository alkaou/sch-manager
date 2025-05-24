// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
const { contextBridge, ipcRenderer } = require('electron');

// Exposer des API sécurisées au processus de rendu
contextBridge.exposeInMainWorld('electron', {
  // Fonctions existantes
  getDatabase: () => ipcRenderer.invoke('get-database'),
  saveDatabase: (db) => ipcRenderer.invoke('save-database', db),
  
  // Nouvelles fonctions pour les listes d'élèves
  saveStudentList: (listData) => ipcRenderer.invoke('saveStudentList', listData),
  getStudentLists: () => ipcRenderer.invoke('getStudentLists'),
  deleteStudentList: (listId) => ipcRenderer.invoke('deleteStudentList', listId),
  
  // Fonction pour générer un snapshot manuellement
  generateSnapshot: () => ipcRenderer.invoke('generate-snapshot')
});