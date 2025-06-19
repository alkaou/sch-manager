const headers = {
    "Bambara": {
        "Prénom": "Tɔgɔ",
        "Nom": "Jamu",
        "N°": "N°",
        "Matricule": "Matirikili",
        "Contact": "Contact",
        "Classes": "Kalansow",
        "Date de naissance": "Bangε don",
        "Date de début": "Daminε don",
        "Postes": "Baara",
        "Sexe": "Cε walima Muso",
        "Statut": "Cogoya",
        "Signature": "Bolonɔ",
        "Salaire": "Sara",
        "Spécialité": "Dɔnniya kɛrɛnkɛrɛnnen",
        "Père": "Fa",
        "Mère": "Ba",
        "Date & Lieu de naissance": "Bangε don ni a yɔrɔ",
        "Moyenne": "Hakɛ cɛmancɛ",
        "Classe": "Kalasi",
        "Âge": "Si"
    },
    "Français": {
        "Prénom": "Prénom",
        "Nom": "Nom",
        "N°": "N°",
        "Matricule": "Matricule",
        "Contact": "Contact",
        "Classes": "Classes",
        "Date de naissance": "Date de naissance",
        "Date de début": "Date de début",
        "Postes": "Postes",
        "Sexe": "Sexe",
        "Statut": "Statut",
        "Signature": "Signature",
        "Salaire": "Salaire",
        "Spécialité": "Spécialité",
        "Père": "Père",
        "Mère": "Mère",
        "Date & Lieu de naissance": "Date & Lieu de naissance",
        "Moyenne": "Moyenne",
        "Classe": "Classe",
        "Âge": "Âge"
    },
    "Anglais": {
        "Prénom": "First Name",
        "Nom": "Last Name",
        "N°": "N°",
        "Matricule": "Registration Number",
        "Contact": "Contact",
        "Classes": "Classes",
        "Date de naissance": "Birth Date",
        "Date de début": "Start Date",
        "Postes": "Positions",
        "Sexe": "Gender",
        "Statut": "Status",
        "Signature": "Signature",
        "Salaire": "Salary",
        "Spécialité": "Specialty",
        "Père": "Father",
        "Mère": "Mother",
        "Date & Lieu de naissance": "Date & Place of Birth",
        "Moyenne": "Average",
        "Classe": "Class",
        "Âge": "Age"
    }
};


export const getHeaderNameByLang = (header, lang="Français") => {
    // Return original header if language doesn't exist or header isn't in the language dictionary
    if (!headers[lang] || !headers[lang][header]) {
        return header;
    }
    return headers[lang][header];
};