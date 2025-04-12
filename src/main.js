const { app, BrowserWindow, ipcMain, session } = require('electron');
const fs = require('fs');
const path = require('path');

// Gérer la fermeture de l'application sous Windows
if (require('electron-squirrel-startup')) {
  app.quit();
}

let mainWindow;

// Créer la fenêtre principale de l'application
const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY, // Assurez-vous de définir correctement cette constante dans votre config Webpack
      nodeIntegration: false, // Désactive l'intégration de Node.js dans le rendu
      contextIsolation: true, // Active l'isolation du contexte
    },
    autoHideMenuBar: true,
  });

  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        "Content-Security-Policy": [
          "default-src 'self'; " +
          // Pour les scripts : autorise les scripts inline, unsafe-eval et les domaines externes nécessaires
          "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://ssl.gstatic.com https://accounts.google.com https://apis.google.com; " +
          // Pour les styles : autorise les styles inline et ceux hébergés sur ssl.gstatic.com et accounts.google.com
          "style-src 'self' 'unsafe-inline' https://ssl.gstatic.com https://accounts.google.com; " +
          // Pour les images : autorise les images depuis 'self', data:, www.google.com, lh3.googleusercontent.com et ssl.gstatic.com
          "img-src 'self' data: https://www.google.com https://lh3.googleusercontent.com https://ssl.gstatic.com; " +
          // Pour les frames : accès autorisé à votre domaine firebase
          "frame-src 'self' https://*.youtube.com https://schoolmanager-c228f.firebaseapp.com; " +
          // Pour les connexions : autorise les connexions vers les domaines définis, y compris les WebSockets
          "connect-src 'self' https://example.com https://schoolmanager-c228f.firebaseapp.com https://schoolmanager-c228f-default-rtdb.firebaseio.com schoolmanager-c228f.firebasestorage.app https://identitytoolkit.googleapis.com https://*.google.com https://*.firebaseio.com https://*.googleapis.com ws://0.0.0.0:3000 wss://schoolmanager-c228f.firebaseapp.com:3000 wss://accounts.google.com:3000; " +
          // Pour les polices : autorise les polices provenant notamment de Google Fonts
          "font-src 'self' https://fonts.googleapis.com https://fonts.gstatic.com;"
        ]
      }
    });
  });

  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY); // Charge l'URL de votre application (React)
  mainWindow.webContents.openDevTools(); // Ouvre les DevTools
};

// Gérer la création du fichier JSON et l'accès à la base de données
const getDbPath = () => path.join(app.getPath('userData'), 'database.json');

// Lire la base de données depuis le fichier JSON
const readDatabase = () => {
  const dbPath = getDbPath();
  if (fs.existsSync(dbPath)) {
    return JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
  }
  return {}; // Si le fichier n'existe pas, retourne un objet vide
};

// Sauvegarder la base de données dans le fichier JSON
const saveDatabase = (db) => {
  const dbPath = getDbPath();
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 4), 'utf-8');
};

// Créer une sauvegarde de la base de données
ipcMain.handle('backup-database', () => {
  try {
    const dbPath = getDbPath();
    if (fs.existsSync(dbPath)) {
      const backupPath = `${dbPath}.backup-${new Date().toISOString().replace(/:/g, '-')}`;
      fs.copyFileSync(dbPath, backupPath);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error backing up database:', error);
    return false;
  }
});

// Gestion des événements IPC pour communiquer avec le renderer (React)
ipcMain.handle('get-database', () => {
  return readDatabase();
});

ipcMain.handle('save-database', (event, db) => {
  saveDatabase(db);
  return { success: true };
});

// Fonctions pour la gestion des listes d'élèves
ipcMain.handle('saveStudentList', (event, listData) => {
  const db = readDatabase();

  // Initialiser le tableau student_lists s'il n'existe pas
  if (!db.student_lists) {
    db.student_lists = [];
  }

  // Mise à jour ou ajout d'une nouvelle liste
  const existingListIndex = db.student_lists.findIndex(list => list.id === listData.id);
  if (existingListIndex >= 0) {
    db.student_lists[existingListIndex] = listData;
  } else {
    db.student_lists.push(listData);
  }

  saveDatabase(db);
  return { success: true, id: listData.id };
});

ipcMain.handle('getStudentLists', () => {
  const db = readDatabase();
  return db.student_lists || [];
});

ipcMain.handle('deleteStudentList', (event, listId) => {
  const db = readDatabase();
  if (db.student_lists) {
    db.student_lists = db.student_lists.filter(list => list.id !== listId);
    saveDatabase(db);
  }
  return { success: true };
});

// Quand l'application est prête
app.whenReady().then(() => {
  createWindow();

  // Sur macOS, recréer une fenêtre si aucune n'est ouverte
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quitter l'application lorsque toutes les fenêtres sont fermées
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
