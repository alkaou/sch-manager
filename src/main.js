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

  session.defaultSession.webRequest.onHeadersReceived({ urls: ['<all_urls>'] }, (details, callback) => {
  callback({
    responseHeaders: {
      ...details.responseHeaders,
      'Content-Security-Policy': [ 
        "default-src * 'unsafe-inline' 'unsafe-eval' data: blob:;" +
        "connect-src *;" +
        "script-src * 'unsafe-inline' 'unsafe-eval';" +
        "style-src * 'unsafe-inline';" +
        "img-src * data:;" +
        "font-src * data:;" +
        "frame-src *;"
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
  const db = readDatabase();
  return db;
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

// Nouvelles fonctions IPC pour les enrollments et snapshots
ipcMain.handle('get-enrollments', () => {
  const db = readDatabase();
  return db.enrollments || [];
});

ipcMain.handle('get-snapshots', () => {
  const db = readDatabase();
  return db.snapshots || [];
});

ipcMain.handle('get-enrollment-stats', (event, schoolYear) => {
  const db = readDatabase();
  const enrollments = db.enrollments || [];
  const snapshots = db.snapshots || [];
  
  // Filtrer par année scolaire si spécifiée
  const filteredEnrollments = schoolYear 
    ? enrollments.filter(e => e.schoolYear === schoolYear)
    : enrollments;
    
  const filteredSnapshots = schoolYear
    ? snapshots.filter(s => s.schoolYear === schoolYear)
    : snapshots;
    
  return {
    enrollments: filteredEnrollments,
    snapshots: filteredSnapshots
  };
});