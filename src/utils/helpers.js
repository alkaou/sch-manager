function getFormattedDateTime() {
  let now = new Date();

  // Récupérer la date au format JJ/MM/AAAA
  let day = String(now.getDate()).padStart(2, '0');
  let month = String(now.getMonth() + 1).padStart(2, '0'); // Mois commence à 0
  let year = now.getFullYear();
  let formattedDate = `${day}/${month}/${year}`;

  // Récupérer l'heure au format HH:MM:SS:MS
  let hours = String(now.getHours()).padStart(2, '0');
  let minutes = String(now.getMinutes()).padStart(2, '0');
  let seconds = String(now.getSeconds()).padStart(2, '0');
  let milliseconds = String(now.getMilliseconds()).padStart(3, '0'); // On met 3 chiffres pour être précis

  let formattedTime = `${hours}:${minutes}:${seconds}:${milliseconds}`;

  return { formattedDate, formattedTime };
}

function getDateTime() {
  // Retourne le timestamp en millisecondes depuis le 1er janvier 1970
  let dateTime = Date.now();
  return { dateTime };
}

function getAge(birthTimestamp) {
  // Conversion du paramètre en objet Date
  const birthDate = new Date(birthTimestamp);

  // Vérifier si la date est valide
  if (isNaN(birthDate.getTime())) {
    // Si la date n'est pas valide, retourner directement la valeur passée
    return birthTimestamp;
  }

  // Récupération de la date actuelle
  const now = new Date();

  // Calcul initial de l'âge
  let age = now.getFullYear() - birthDate.getFullYear();

  // Ajustement de l'âge si l'anniversaire n'est pas encore passé cette année
  const monthDiff = now.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
}


export { getFormattedDateTime, getAge, getDateTime }

