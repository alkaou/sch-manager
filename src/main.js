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

// Fonction pour déterminer l'année scolaire en cours
const getCurrentSchoolYear = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1; // Les mois commencent à 0

  // Si on est avant Juin, on est dans l'année scolaire précédente
  if (month < 6) {
    return `${year-1}-${year}`;
  } else {
    return `${year}-${year+1}`;
  }
};

// Fonction pour mettre à jour le snapshot de l'année scolaire en cours
const updateCurrentSnapshot = (db) => {
  if (!db.students || !db.classes) {
    return db;
  }

  const currentYear = getCurrentSchoolYear();
  
  // Initialiser les snapshots s'ils n'existent pas
  if (!db.snapshots) {
    db.snapshots = [];
  }

  // Calculer le nombre d'élèves actifs par classe, séparés par sexe
  const classCounts = {};
  let totalMalesStudents = 0;
  let totalFemalesStudents = 0;
  
  // Pour chaque classe existante dans la DB, initialiser les compteurs
  db.classes.forEach(cls => {
    const classKey = cls.name ? `${cls.level} ${cls.name}`.trim() : `${cls.level}`;
    classCounts[classKey] = {
      total: 0,
      males: 0,
      females: 0
    };
  });

  // Compter les élèves actifs par classe et par sexe
  db.students.forEach(student => {
    if (student.status === "actif") {
      const classKey = student.classe;
      
      // Si la classe n'existe pas encore dans classCounts, l'initialiser
      if (!classCounts[classKey]) {
        classCounts[classKey] = {
          total: 0,
          males: 0,
          females: 0
        };
      }
      
      // Incrémenter le total pour cette classe
      classCounts[classKey].total += 1;
      
      // Incrémenter le compteur par sexe pour cette classe
      if (student.sexe === "M") {
        classCounts[classKey].males += 1;
        totalMalesStudents += 1;
      } else if (student.sexe === "F") {
        classCounts[classKey].females += 1;
        totalFemalesStudents += 1;
      }
    }
  });

  const totalStudents = totalMalesStudents + totalFemalesStudents;

  // Vérifier si un snapshot pour l'année en cours existe déjà
  const existingSnapshotIndex = db.snapshots.findIndex(
    snapshot => snapshot.schoolYear === currentYear
  );

  if (existingSnapshotIndex >= 0) {
    // Mettre à jour le snapshot existant
    db.snapshots[existingSnapshotIndex].classCounts = classCounts;
    db.snapshots[existingSnapshotIndex].updatedAt = Date.now();
    db.snapshots[existingSnapshotIndex].totalStudents = totalStudents;
    db.snapshots[existingSnapshotIndex].totalMalesStudents = totalMalesStudents;
    db.snapshots[existingSnapshotIndex].totalFemalesStudents = totalFemalesStudents;
  } else {
    // Créer un nouveau snapshot
    db.snapshots.push({
      schoolYear: currentYear,
      classCounts: classCounts,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      totalStudents: totalStudents,
      totalMalesStudents: totalMalesStudents,
      totalFemalesStudents: totalFemalesStudents
    });
  }

  return db;
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
  // Mise à jour automatique du snapshot au démarrage de l'app
  // et uniquement si la DB contient déjà des données
  if (db.students && db.classes) {
    const updatedDb = updateCurrentSnapshot(db);
    saveDatabase(updatedDb);
    return updatedDb;
  }
  return db;
});

ipcMain.handle('save-database', (event, db) => {
  saveDatabase(db);
  return { success: true };
});

// Méthode pour générer un snapshot manuellement
ipcMain.handle('generate-snapshot', () => {
  const db = readDatabase();
  const updatedDb = updateCurrentSnapshot(db);
  saveDatabase(updatedDb);
  return updatedDb;
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