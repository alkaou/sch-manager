// Variables de suggestions de base
// Tableau de prénoms (plus de 210 entrées)
const suggestNames = [
  // Noms masculins traditionnels
  "Alkaou", "Amadou", "Adama", "Issa", "Drissa", "Hamidou", "Amidou", "Ramata", "Aly", "Aly Baba", 'Cheicknè',
  "Cheïcknè", "Maïmouna", "Djènèba", "Djénéba", "Sali", "Saly", "Mamou",
  "Mamadou", "Moussa", "Oumar", "Souleymane", "Abdoulaye", "Boubacar", "Seydou", "Cheick", "Modibo", "Yaya",
  "Ibrahima", "Kalilou", "Fousseyni", "Abdou", "Ibrahim", "Ousmane", "Bakary", "Habib", "Soumaila", "Sory",
  "Mahamadou", "Lamine", "Alpha", "Amara", "Assane", "Bocar", "Massalate", "Kassim", "Yacouba", "Saliou",
  "Nourdine", "Alioune", "Tiemoko", "Babacar", "Abdoul", "El Hadji", "M’Baye", "Sékou", "Mamoudou", "Sidiki",
  "Kouma", "Samba", "Youssouf", "Sidi", "Karamoko", "Garan", "Mamadi", "Oumarou", "Ali", "N'Guessan",
  "Djibril", "Mamadouba", "Sidy", "Mahamane", "Dramane", "Issouf", "Balla", "Goumar", "Sangaré", "Salif",
  "Ibra", "Sidiou", "Oumarouba", "Mamadoulaye",
  // Noms féminins traditionnels
  "Fatoumata", "Aminata", "Mariam", "Aissatou", "Kadiatou", "Kadidia", "Salimata", "Nafissatou", "Coumba", "Awa",
  "Fanta", "Djeneba", "Rokia", "Sira", "Maimouna", "Khady", "Bintou", "Hawa", "Mariamou", "Yamina",
  "Mariama", "Rosine", "Constance", "Koumba", "Oumou", "Lala", "Mariame", "Sidiya", "Lina", "Marietou",
  "Seynabou", "Nadège", "Cécile", "Sitan", "Oumouma", "Dahaba", "Fadima", "Sidiatou", "Khadija",
  // Noms masculins d'inspiration française (courants chez les chrétiens)
  "Jean-Baptiste", "François", "Gabriel", "Georges", "Bernard", "Olivier", "René", "Didier", "Christophe", "Marcel",
  "Antoine", "Alain", "Laurent", "Patrick", "Michel", "Jacques", "André", "Daniel", "Samuel", "Emmanuel",
  "Charles", "Pierre", "Paul", "Marc", "Jean",
  // Noms féminins d'inspiration française
  "Marie", "Catherine", "Françoise", "Sylvie", "Monique", "Christine", "Isabelle", "Sophie", "Anne", "Nathalie",
  "Valérie", "Caroline", "Véronique", "Chantal", "Dominique",
  // Ajouts masculins supplémentaires
  "Yacouba", "Saliou", "Mourtala", "Mahamane", "Issoufou", "Baba", "Kouyate", "Pape", "Papis", "Ibrahimou",
  // Ajouts féminins supplémentaires
  "Mousso", "Mounira", "Faiza", "Aicha", "Amie", "Assitan", "Safiatou", "Rokhaya", "Zainab", "Imane", "Leila",
  "Binta", "Rahama", "Marieme", "Adja",
  // Ajouts unisex / mixtes
  "Aminou", "Assitan", "Binta", "Coumbi", "Dja", "Fadima", "Galou", "Hama", "Ibou", "Jamilou", "Kadi", "Lamina",
  "Niare", "Ouleye", "Penda", "Rokhaya", "Saara", "Sandi", "Tina", "Ussene", "Wassila", "Zara", "Zenab", "Zohra",
  "Adila", "Gnilane", "Jamila", "Kany", "Lamy", "Macky", "Nafi", "Ramatoulaye", "Tida", "Zaynab", "Nafissa",
  "Arouna", "Issaou", "Samar", "Mounir", "Goumana", "Laye", "Massila", "Saran", "Youness",
  // Ajouts complémentaires pour dépasser 200 noms
  "Fantaou", "Samba", "Kouba", "Makary", "Oumarifa", "Adjaratou", "Kourouma", "Sambouba", "Kouyate", "Nene",
  "Haby", "Sita", "Khadim", "Kolo", "Moussan", "Lassana", "Sare", "Adji", "Amin", "Louncinet"
];

// Tableau de noms de famille (environ 50 entrées)
const suggestLastNames = [
  "Mallé", "Dé", "Sokanda", "Dianè", "Diané", "N'Diané", "N'Dianè", "Maïga", "Tall", "Wologuème", "Tessougé",
  "Traoré", "Keïta", "Sissoko", "Tounkara", "Camara", "Sidibé", "Touré", "Bagayoko", "Seck", "Ndiaye",
  "Fall", "Mbaye", "Guindo", "Barry", "Sow", "Kaba", "Koné", "Diarra", "Cissé", "Diallo",
  "Coulibaly", "Ballo", "Demba", "Dembélé", "Fofana", "Kouyaté", "Goulamaly", "Sangaré", "Maiga", "Sy",
  "Zongo", "Ouattara", "Diakite", "Niamké", "Kourouma", "N’Diaye", "Bambara", "Bougou", "Doumbia", "Kamara",
  "Bonkoungou", "N'Guessan", "N'Dour", "Sall", "Sambou", "Bocoum", "Djiré", "Sinayoko"
];

const suggCitiesNames = [
  "San", "Katala", "Karaba", "Ségou", "Bamako", "Mopti", "Kayes", "Kidal", "Kati", "Koro", "Sikasso",
  "Koutiala", "Bougouni", "Ténéni", "Koulikoro", "Da", "Niono", "Nioro", "Coro", "Badjangara", "Sofara",
  "Kimparana", "Bla", "Marakala", "Kôrô", "Nampasso", "Worofanasso", "Tombouctou", "Gao", "Diola", "Fana"
];

// Génération dynamique de toutes les combinaisons "Prénom Nom"
const suggNameComplete = suggestNames.flatMap(firstName =>
  suggestLastNames.map(lastName => `${firstName} ${lastName}`)
);

export { suggestLastNames, suggestNames, suggNameComplete, suggCitiesNames };
