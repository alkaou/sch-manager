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

// Dans votre fichier main.js ou équivalent
ipcMain.handle('saveStudentList', async (event, listData) => {
  try {
    // Vérifier si la liste existe déjà
    const existingList = await db.get('SELECT * FROM student_lists WHERE id = ?', [listData.id]);
    
    if (existingList) {
      // Mettre à jour la liste existante
      await db.run(
        'UPDATE student_lists SET name = ?, data = ?, updated_at = ? WHERE id = ?',
        [listData.name, JSON.stringify(listData), listData.updatedAt, listData.id]
      );
    } else {
      // Insérer une nouvelle liste
      await db.run(
        'INSERT INTO student_lists (id, name, data, created_at, updated_at) VALUES (?, ?, ?, ?, ?)',
        [listData.id, listData.name, JSON.stringify(listData), listData.createdAt, listData.updatedAt]
      );
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error saving student list:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('getStudentLists', async () => {
  try {
    const lists = await db.all('SELECT * FROM student_lists ORDER BY updated_at DESC');
    return lists.map(list => ({
      id: list.id,
      name: list.name,
      ...JSON.parse(list.data)
    }));
  } catch (error) {
    console.error('Error getting student lists:', error);
    return [];
  }
});

ipcMain.handle('deleteStudentList', async (event, listId) => {
  try {
    await db.run('DELETE FROM student_lists WHERE id = ?', [listId]);
    return { success: true };
  } catch (error) {
    console.error('Error deleting student list:', error);
    return { success: false, error: error.message };
  }
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

