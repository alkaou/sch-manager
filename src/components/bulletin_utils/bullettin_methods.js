export const checkMoyenneGeneralToReturnStudentMention = (
  moyenneGeneral,
  language
) => {
  const student_mention =
    moyenneGeneral >= 18
      ? language === "Français"
        ? "Excellent Travail, courage !"
        : language === "Anglais"
        ? "Excellent Work !"
        : "Baara Ɲɛnna Kosɛbɛ !"
      : moyenneGeneral >= 16
      ? language === "Français"
        ? "Très Bon Travail, courage !"
        : language === "Anglais"
        ? "Very Good Work !"
        : "Baara Ɲuman !"
      : moyenneGeneral >= 14
      ? language === "Français"
        ? "Bon Travail et courage !"
        : language === "Anglais"
        ? "Good Work !"
        : "Baara Ka Ɲi !"
      : moyenneGeneral >= 12
      ? language === "Français"
        ? "Déjà pas mal, courage, Tu peux mieux faire que ça !"
        : language === "Anglais"
        ? "Good Work !"
        : "Baara Ka Ɲi !"
      : moyenneGeneral >= 10
      ? language === "Français"
        ? "Travail Passable, Il faut doubler l'effort !"
        : language === "Anglais"
        ? "Satisfactory Work !"
        : "Baara Bɛ Tɛmɛ !"
      : language === "Français"
      ? "Travail Insuffisant, Tu peux faire mieux !"
      : language === "Anglais"
      ? "Insufficient Work !"
      : "Baara Ma Ɲi !";
  return student_mention;
};
