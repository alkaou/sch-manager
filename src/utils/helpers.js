function getFormattedDateTime() {
  let now = new Date();

  // Récupérer la date au format JJ/MM/AAAA
  let day = String(now.getDate()).padStart(2, "0");
  let month = String(now.getMonth() + 1).padStart(2, "0"); // Mois commence à 0
  let year = now.getFullYear();
  let formattedDate = `${day}/${month}/${year}`;

  // Récupérer l'heure au format HH:MM:SS:MS
  let hours = String(now.getHours()).padStart(2, "0");
  let minutes = String(now.getMinutes()).padStart(2, "0");
  let seconds = String(now.getSeconds()).padStart(2, "0");
  let milliseconds = String(now.getMilliseconds()).padStart(3, "0"); // On met 3 chiffres pour être précis

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
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && now.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age;
}

function getClasseName(chaine, lang = "Français") {
  const regex = /^(\d+)\s*(.*)$/;
  const result = chaine.match(regex);

  if (!result) {
    // Si la chaîne ne correspond pas au format attendu, on la retourne telle quelle ou on gère l'erreur
    return chaine;
  }

  const number = result[1];
  const restText = result[2];
  let classeName = "";

  if (lang === "Français") {
    // Utilise "1ère année" pour 1 et "ème année" pour les autres
    const yearLabel = number === "1" ? "1ère année" : `${number}ème année`;
    classeName = `${yearLabel} ${restText}`;
  } else if (lang === "Anglais") {
    // Définit le suffixe ordinal approprié en anglais
    const grade =
      number === "1"
        ? "st grade"
        : number === "2"
        ? "nd grade"
        : number === "3"
        ? "rd grade"
        : "th grade";
    classeName = `${number}${grade} ${restText}`;
  } else {
    // Pour toute autre langue, ici exemple avec "Bambara"
    classeName = `${number} nan ${restText}`.trim();
  }

  return classeName;
}

const delay = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const areArraysEqual = (arr1, arr2) => {
  if (arr1.length !== arr2.length) return false;

  return arr1.every((item1) =>
    arr2.some((item2) => JSON.stringify(item1) === JSON.stringify(item2))
  );
};

const getBornInfos = (init_born_date, _born_lieu = "", lang = "Français") => {
  const born_lieu =
    _born_lieu.trim() !== ""
      ? _born_lieu
      : lang === "Français"
      ? "*Inconnu*"
      : lang === "Anglais"
      ? "*Unknow*"
      : "*A ma sidɔn*";
  const born_date = new Date(init_born_date).toLocaleDateString();
  if (lang === "Français" || lang === "Anglais") {
    const langText = lang === "Français" ? " à " : " in ";
    const infos = `${born_date}${langText}${born_lieu}`.trim();
    return infos;
  }
  const fixBornLieu = born_lieu.trim() !== "" ? `${born_lieu} kɔnɔ` : "";
  const infos = `${born_date} ${fixBornLieu}`.trim();
  return infos;
};

const textToUppercase = (text) => {
  return text.toUpperCase();
};

const getClasseById = (classes, id, lang = "Français") => {
  const inconnuText =
    lang === "Français"
      ? "Inconnu"
      : lang === "Anglais"
      ? "Unknow"
      : "A ma sidɔn";
  if (!classes || classes.length <= 0)
    return { id: id, level: inconnuText, name: inconnuText };
  const this_classe = classes.find((cls) => {
    return cls.id === id;
  });
  if (!this_classe) return { id: id, level: inconnuText, name: inconnuText };
  return this_classe;
};

const getPostNameTrans = (post_name, lang = "Français") => {
  if (post_name !== "Professeurs" || lang === "Français") return post_name;
  const nameTrans = lang === "Anglais" ? "Teachers" : "Karamɔgɔw";
  return nameTrans;
};

const getCurrentMonthScolar = () => {
  const now = new Date();
  const months = now.getMonth() + 1; // 0-11 (janvier = 0)
  const currentMonth =
    months === 1
      ? 4
      : months === 2
      ? 5
      : months === 3
      ? 6
      : months === 4
      ? 7
      : months === 5
      ? 8
      : months === 6
      ? 9
      : months === 10
      ? 1
      : months === 11
      ? 2
      : months === 12
      ? 3
      : 1;
  return currentMonth;
};

// Formatage de la date pour l'affichage
// Tableau des mois en bambara
const bambara_month_array = [
  { Janvier: "Zanwuyekalo" },
  { Février: "Feburuyekalo" },
  { Mars: "Marsikalo" },
  { Avril: "Awirilikalo" },
  { Mai: "Mɛkalo" },
  { Juin: "Zuwenkalo" },
  { Juillet: "Zuyekalo" },
  { Août: "Utikalo" },
  { Septembre: "Sɛtanburukalo" },
  { Octobre: "Ɔkutɔburukalo" },
  { Novembre: "Nowanburukalo" },
  { Décembre: "Desanburukalo" },
];

// On transforme le tableau en simple tableau de chaînes, indexé 0→Janvier, …, 11→Décembre
const bambaraMonths = bambara_month_array.map((obj) => Object.values(obj)[0]);

const formatDate = (dateString, language="Français") => {
  const date = new Date(dateString);
  // Pour Français ou Anglais on utilise toLocaleDateString
  if (language === "Français" || language === "Anglais") {
    const locale = language === "Français" ? "fr-FR" : "en-US";
    return date.toLocaleDateString(locale, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  // Sinon on reconstruit la date à la main avec le mois en bambara
  const day = date.getDate(); // jour du mois, 1–31
  const year = date.getFullYear(); // année sur 4 chiffres
  const monthIndex = date.getMonth(); // 0–11
  const monthName = bambaraMonths[monthIndex];

  // Ex. "zanwuyekalo tile 4 2025"
  return `${monthName} tile ${day} san ${year}`;
};

export {
  getFormattedDateTime,
  getAge,
  getDateTime,
  getClasseName,
  delay,
  areArraysEqual,
  getBornInfos,
  textToUppercase,
  getClasseById,
  getPostNameTrans,
  getCurrentMonthScolar,
  formatDate,
};
