/**
 * Récupère la base de données locale depuis l'API Electron
 * @returns {Promise<Object>} Les données de la base de données ou un objet vide en cas d'échec
 */
export const getLocalDatabase = async () => {
  await window.electron.getDatabase().then((data) => {
    if (!data) {
      return {};
    }
    return data;
  });
};

/**
 * Sauvegarde les données dans la base de données locale via l'API Electron
 * @param {Object} remoteData - Les données à sauvegarder dans la base de données
 * @returns {Promise<boolean>} True si la sauvegarde a réussi
*/
export const updateLocalDatabase = async (remoteData) => {
  await window.electron.saveDatabase(remoteData).then(() => {
    return true;
  });
};