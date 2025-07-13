# Gestionnaire d'Événements - School Manager

## Vue d'ensemble

Le gestionnaire d'événements est un système complet pour gérer les événements scolaires avec des fonctionnalités avancées de création, modification, validation et suppression.

## Structure des fichiers

### Composants principaux

- **EventsPage.jsx** - Page principale qui orchestre tous les composants
- **EventsList.jsx** - Affichage des listes d'événements avec animations
- **EventCard.jsx** - Carte individuelle d'événement
- **EventForm.jsx** - Formulaire de création/modification d'événements
- **EventValidationForm.jsx** - Formulaire de validation des événements passés
- **EventDetails.jsx** - Vue détaillée d'un événement
- **EventFilters.jsx** - Système de filtres avancés et recherche

### Fichiers utilitaires

- **EventsMethodes.js** - Toutes les méthodes de gestion des événements
- **events_translator.js** - Traductions multilingues (FR, EN, Bambara)
- **index.js** - Exports centralisés

## Fonctionnalités

### 1. Gestion des événements
- ✅ Création d'événements avec validation complète
- ✅ Modification d'événements (sauf validés/passés)
- ✅ Suppression avec confirmation (sauf validés/passés)
- ✅ Validation des événements passés

### 2. Statuts des événements
- **pending** - En attente
- **validated** - Validé
- **ongoing** - En cours
- **past** - Passé

### 3. Types d'événements
- Football, Basketball, Volleyball
- Journée Culturelle, Fête de Fermeture
- Conférence, Séminaire, Formation
- Compétition Sportive, Tournoi
- Spectacle, Concert, Théâtre
- Exposition, Salon, Foire
- Cérémonie, Remise de Prix
- Réunion, Assemblée Générale
- Voyage Scolaire, Excursion
- Autre

### 4. Filtres et recherche
- 🔍 Recherche rapide par texte
- 📊 Filtres par statut, type, dates
- 📈 Tri par différents critères
- 📋 Filtres avancés avec interface intuitive

### 5. Validation des événements
- ✅ Formulaire de validation séparé
- 📝 Champs obligatoires : succès, échecs, remarques
- 🔒 Validation uniquement après la fin de l'événement

### 6. Interface utilisateur
- 🎨 Design moderne et attrayant
- ✨ Animations fluides avec Framer Motion
- 🌙 Support du thème sombre
- 📱 Interface responsive
- 🌍 Support multilingue

## Validation des données

### Événement
- **Titre** : 5-150 caractères
- **Description** : 100-10000 caractères
- **Type** : Sélection obligatoire
- **Dates** : Date de fin >= Date de début
- **Heures** : Heure de fin > Heure de début

### Validation d'événement
- **Succès** : 100-10000 caractères
- **Échecs** : 100-10000 caractères
- **Remarques** : 100-10000 caractères

## Permissions

### Modification
- ✅ Événements en attente
- ❌ Événements validés
- ❌ Événements passés

### Suppression
- ✅ Événements en attente
- ❌ Événements validés
- ❌ Événements passés

### Validation
- ❌ Événements en attente
- ❌ Événements en cours
- ✅ Événements passés (non validés)
- ❌ Événements déjà validés

## Utilisation

### Import des composants
```javascript
import { 
  EventsList, 
  EventForm, 
  EventValidationForm,
  getAllEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  validateEvent
} from '../components/events';
```

### Exemple d'utilisation
```javascript
// Charger les événements
const events = await getAllEvents(database);

// Créer un événement
const newEvent = await createEvent(eventData, database, setFlashMessage, language);

// Valider un événement
const validatedEvent = await validateEvent(eventId, validationData, database, setFlashMessage, language);
```

## Messages Flash

Tous les messages utilisateur utilisent le système `setFlashMessage` :
```javascript
setFlashMessage({
  type: "success", // success, error, warning, info
  message: "Message traduit",
  duration: 3000
});
```

## Traductions

Toutes les chaînes de caractères sont externalisées dans `events_translator.js` avec support pour :
- 🇫🇷 Français
- 🇬🇧 Anglais  
- 🇲🇱 Bambara

## Base de données

Le système utilise les méthodes de `database_methods.js` pour :
- Génération d'IDs uniques
- Validation des données
- Opérations CRUD
- Gestion des erreurs

## Animations

Utilisation de Framer Motion pour :
- Transitions de page fluides
- Animations de cartes d'événements
- Effets hover et tap
- Transitions de modales
- Animations de liste avec stagger

## Responsive Design

- 📱 Mobile-first approach
- 💻 Adaptation tablette et desktop
- 🎯 Grilles adaptatives
- 📐 Espacement cohérent

---

*Développé avec expertise pour une expérience utilisateur optimale*