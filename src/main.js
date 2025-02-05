const { app, BrowserWindow, ipcMain } = require('electron');
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
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY, // Assure-toi que tu définis ceci dans ton config Webpack
      nodeIntegration: false, // Désactiver l'intégration du Node.js dans le rendu
      contextIsolation: true, // Activer l'isolement du contexte
    },
    autoHideMenuBar: true,
  });

  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY); // Charge l'URL de ton application React
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
  return {}; // Si le fichier n'existe pas, retourner un objet vide
};

// Sauvegarder la base de données dans le fichier JSON
const saveDatabase = (db) => {
  const dbPath = getDbPath();
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 4), 'utf-8');
};

// Gestion des événements IPC pour communiquer avec le renderer process (React)
ipcMain.handle('get-database', () => {
  return readDatabase();
});

ipcMain.handle('save-database', (event, db) => {
  saveDatabase(db);
  return { success: true };
});

// Quand l'application est prête
app.whenReady().then(() => {
  createWindow();

  // Gérer le cas où l'application est activée sur macOS
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

