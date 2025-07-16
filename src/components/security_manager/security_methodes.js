import bcrypt from 'bcryptjs';

// Vérifie si un mot de passe est suffisamment complexe.
const isPasswordComplex = (password) => {
  const hasNumber = /\d/.test(password);
  const hasLetter = /[a-zA-Z]/.test(password);
  return password.length >= 10 && hasNumber && hasLetter;
};

// Vérifie si un mot de passe est défini dans la base de données.
export const hasPassword = (db) => {
  return !!(db && db.security && db.security.password);
};

// Vérifie si le mot de passe fourni correspond à celui de l'utilisateur ou de l'admin.
export const verifyPassword = (password, db) => {
  if (!db || !db.security || !password) {
    return false;
  }

  // Vérifie si c'est le mot de passe de l'utilisateur (s'il existe)
  const userPasswordHash = db.security.password;
  if (userPasswordHash && bcrypt.compareSync(password, userPasswordHash)) {
    return true;
  }

  // Sinon, vérifie si c'est le mot de passe de l'administrateur
  const adminPasswordHash = db.security.admin;
  if (adminPasswordHash && bcrypt.compareSync(password, adminPasswordHash)) {
    return true;
  }

  return false;
};

// Crée un nouveau mot de passe de sécurité.
export const createPassword = (password, confirmPassword, db) => {
  if (!isPasswordComplex(password)) {
    return { success: false, message: 'passwordComplexityError' };
  }
  if (password !== confirmPassword) {
    return { success: false, message: 'passwordsDoNotMatch' };
  }

  if (!db.security) {
    db.security = {};
  }

  const hashedPassword = bcrypt.hashSync(password, 10);
  db.security.password = hashedPassword;
  window.electron.saveDatabase(db);

  return { success: true, message: 'passwordCreatedSuccess' };
};

// Change le mot de passe de sécurité existant.
export const changePassword = (oldPassword, newPassword, confirmNewPassword, db) => {
  if (!verifyPassword(oldPassword, db)) {
    return { success: false, message: 'oldPasswordIncorrect' };
  }
  if (!isPasswordComplex(newPassword)) {
    return { success: false, message: 'passwordComplexityError' };
  }
  if (newPassword !== confirmNewPassword) {
    return { success: false, message: 'newPasswordsDoNotMatch' };
  }

  const hashedPassword = bcrypt.hashSync(newPassword, 10);
  db.security.password = hashedPassword;
  window.electron.saveDatabase(db);

  return { success: true, message: 'passwordChangedSuccess' };
};

// Supprime la protection par mot de passe.
export const removePassword = (password, db) => {
  if (!verifyPassword(password, db)) {
    return { success: false, message: 'incorrectPassword' };
  }

  db.security.password = null; // ou delete db.security.password;
  window.electron.saveDatabase(db);

  return { success: true, message: 'passwordRemovedSuccess' };
};
