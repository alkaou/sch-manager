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

export { getFormattedDateTime }

// Exemple d'utilisation
// let { formattedDate, formattedTime } = getFormattedDateTime();
// console.log("Date:", formattedDate);
// console.log("Heure:", formattedTime);
