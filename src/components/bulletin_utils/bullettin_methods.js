export const checkMoyenneGeneralToReturnStudentMention = (
  moyenneGeneral,
  language
) => {
  const APPRECIATION =
    moyenneGeneral >= 18
      ? language === "Français"
        ? "Excellent Travail, courage !"
        : language === "Anglais"
        ? "Excellent Work, keep it up !"
        : "Baara Ɲɛnna Kosɛbɛ, dusu taa !"
      : moyenneGeneral >= 16
      ? language === "Français"
        ? "Très Bon Travail, courage !"
        : language === "Anglais"
        ? "Very Good Work, keep going !"
        : "Baara Ɲuman, i jija halibi !"
      : moyenneGeneral >= 14
      ? language === "Français"
        ? "Bon Travail et courage !"
        : language === "Anglais"
        ? "Good Work, be courageous !"
        : "Baara Ka Ɲi, i ka cɛsiri hali sisan !"
      : moyenneGeneral >= 12
      ? language === "Français"
        ? "Déjà pas mal, courage, Tu peux mieux faire que ça !"
        : language === "Anglais"
        ? "Not Bad, Keep Working Hard !"
        : "A man kɛnɛ, i ka kan ka dɔ fara a kan !"
      : moyenneGeneral >= 10
      ? language === "Français"
        ? "Travail Passable, Il faut doubler d'efforts !"
        : language === "Anglais"
        ? "Satisfactory Work, you need to double your efforts !"
        : "Baara Bɛ Tɛmɛ, i cɛsiri hali bi, i ka kan ka baara caman kɛ !"
      : language === "Français"
      ? "Travail Insuffisant, il faut réagir !"
      : language === "Anglais"
      ? "Insufficient Work, you must react now !"
      : "Baara Ma Ɲi, i ka kan ka i yɛrɛ sɛgɛrɛ sisan !";
  return APPRECIATION;
};
