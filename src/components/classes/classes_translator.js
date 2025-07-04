const translations = {
  level_required: {
    Français: "Le niveau est obligatoire.",
    Anglais: "Level is required.",
    Bambara: "Niveau ka kan ka sɛbɛn.",
  },
  level_between_1_and_12: {
    Français: "Le niveau doit être entre 1 et 12.",
    Anglais: "Level must be between 1 and 12.",
    Bambara: "Niveau ka kan ka kɛ 1 ni 12 cɛ.",
  },
  class_already_exists: {
    Français: "Cette classe existe déjà.",
    Anglais: "This class already exists.",
    Bambara: "Nin kilasi in bɛ yen kaban.",
  },
  class_already_added: {
    Français: "Cette classe a déjà été ajoutée.",
    Anglais: "This class has already been added.",
    Bambara: "Nin kilasi in fara kaban.",
  },
  new_classes_added_successfully: {
    Français: "Les nouvelles classes ont été ajoutées avec succès!",
    Anglais: "New classes have been added successfully!",
    Bambara: "Kilasi kuraw farala ni ɲɛtaa ye!",
  },
  error_saving_classes: {
    Français: "Erreur lors de la sauvegarde des classes.",
    Anglais: "Error saving classes.",
    Bambara: "Fili kɛra kilasiw marali la.",
  },
  class_deleted_successfully: {
    Français: "La classe a été supprimée avec succès!",
    Anglais: "The class has been deleted successfully!",
    Bambara: "Kilasi bɔra ni ɲɛtaa ye!",
  },
  error_deleting_class: {
    Français: "Erreur lors de la suppression de la classe.",
    Anglais: "Error deleting the class.",
    Bambara: "Fili kɛra kilasi bɔli la.",
  },
  class_updated_successfully: {
    Français: "La classe a été modifiée avec succès!",
    Anglais: "The class has been modified successfully!",
    Bambara: "Kilasi yɛlɛmana ni ɲɛtaa ye!",
  },
  error_updating_class: {
    Français: "Erreur lors de la mise à jour de la classe.",
    Anglais: "Error updating the class.",
    Bambara: "Fili kɛra kilasi yɛlɛmali la.",
  },
  manage_classes: {
    Français: "Gestion des classes",
    Anglais: "Manage Classes",
    Bambara: "Kilasiw ɲɛnabɔli",
  },
  existing_classes: {
    Français: "Classes existantes",
    Anglais: "Existing Classes",
    Bambara: "Kilasiw minnu bɛ yen",
  },
  sort_by_level: {
    Français: "Trier par niveau :",
    Anglais: "Sort by level:",
    Bambara: "Ka tila ni niveau ye :",
  },
  default: {
    Français: "Par défaut",
    Anglais: "Default",
    Bambara: "Sanni",
  },
  ascending: {
    Français: "Croissant",
    Anglais: "Ascending",
    Bambara: "Ka yɛlɛ sanfɛ",
  },
  descending: {
    Français: "Décroissant",
    Anglais: "Descending",
    Bambara: "Ka jigi duguma",
  },
  no_class_recorded: {
    Français: "Aucune classe enregistrée.",
    Anglais: "No class recorded.",
    Bambara: "Kilasi si ma sɛbɛn.",
  },
  level: {
    Français: "Niveau",
    Anglais: "Level",
    Bambara: "Kilasi Hakɛya",
  },
  class_name: {
    Français: "Nom de la classe",
    Anglais: "Class Name",
    Bambara: "Kilasi tɔgɔ",
  },
  student_count: {
    Français: "Nombre d'élèves",
    Anglais: "Number of students",
    Bambara: "Kalandenw jateminɛ",
  },
  actions: {
    Français: "Actions",
    Anglais: "Actions",
    Bambara: "Kɛwalew",
  },
  validate: {
    Français: "Valider",
    Anglais: "Validate",
    Bambara: "Sɔn",
  },
  cancel: {
    Français: "Annuler",
    Anglais: "Cancel",
    Bambara: "A lasegin",
  },
  edit: {
    Français: "Modifier",
    Anglais: "Edit",
    Bambara: "Yɛlɛma",
  },
  close: {
    Français: "Fermer",
    Anglais: "Close",
    Bambara: "A datugu",
  },
  delete: {
    Français: "Supprimer",
    Anglais: "Delete",
    Bambara: "A jɔsi",
  },
  add_new_classes: {
    Français: "Ajouter de nouvelles classes",
    Anglais: "Add new classes",
    Bambara: "Kilasi kura fara",
  },
  level_1_12: {
    Français: "Niveau (1-12)",
    Anglais: "Level (1-12)",
    Bambara: "Niveau (1-12)",
  },
  select: {
    Français: "Sélectionnez",
    Anglais: "Select",
    Bambara: "Sugandi",
  },
  class_name_placeholder: {
    Français: "EX : Terminale S || A1",
    Anglais: "EX: Terminal S || A1",
    Bambara: "Misali: Tɛriminali S || A1",
  },
  add_row: {
    Français: "Ajouter une ligne",
    Anglais: "Add a row",
    Bambara: "Sira kura fara",
  },
  save_classes: {
    Français: "Sauvegarder les classes",
    Anglais: "Save classes",
    Bambara: "Kilasiw mara",
  },
  confirm_delete: {
    Français: "Confirmer la suppression",
    Anglais: "Confirm deletion",
    Bambara: "Jɔsili lawaleya",
  },
  confirm_delete_class_message: {
    Français: "Voulez-vous vraiment supprimer la classe",
    Anglais: "Do you really want to delete the class",
    Bambara: "I b'a fɛ ka kilasi bɔ yen pewu wa?",
  },
  confirm: {
    Français: "Confirmer",
    Anglais: "Confirm",
    Bambara: "Sɔn",
  },
};

export const translate = (key, language) => {
  if (translations[key] && translations[key][language]) {
    return translations[key][language];
  }
  // Fallback to a default language (e.g., Français) if translation not found
  return translations[key] ? translations[key]["Français"] : key;
};
