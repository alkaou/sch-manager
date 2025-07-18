# Système d'Informations - School Manager

## Vue d'ensemble

Ce système permet de gérer et d'afficher des informations, actualités et articles dans l'application School Manager. Il récupère les données depuis Firestore et offre une interface utilisateur moderne avec support du markdown, notifications en temps réel, et gestion multilingue.

## Structure des fichiers

```
src/components/informations/
├── InformationsManager.jsx      # Composant principal
├── InformationCard.jsx          # Carte d'affichage d'une information
├── InformationsList.jsx         # Liste avec recherche et filtres
├── LoadingSpinner.jsx           # Composant de chargement
├── EmptyState.jsx               # État vide (aucune information)
├── ErrorState.jsx               # Gestion des erreurs
├── NotificationBadge.jsx        # Badge de notification
├── informations_methodes.js     # Méthodes Firestore et utilitaires
├── informations_translator.js   # Traductions multilingues
├── index.js                     # Exports centralisés
└── README.md                    # Documentation
```

## Structure des données Firestore

Chaque information dans la collection `informations` doit avoir la structure suivante :

```javascript
{
  id: string,                    // ID automatique Firestore
  title: string,                 // Titre de l'information
  media_1: string | null,        // URL média principal (image/vidéo)
  media_2: string,               // URL média par défaut (jamais null)
  descriptions: string,          // Contenu en markdown
  contact: string,               // Information de contact
  createdAt: Timestamp          // Date de publication Firestore
}
```

## Fonctionnalités principales

### 1. Affichage des informations
- Support complet du markdown pour le contenu
- Affichage d'images et vidéos
- Design responsive et animations fluides
- Thème sombre/clair automatique

### 2. Notifications en temps réel
- Badge de notification sur le bouton "Informations"
- Popup de notification pour les nouvelles informations
- Gestion de l'état "lu/non lu" avec `react-secure-storage`

### 3. Recherche et filtres
- Recherche en temps réel dans le titre, description et contact
- Tri par date (plus récent/plus ancien)
- Interface de filtrage intuitive

### 4. Multilingue
- Support Français, Anglais, Bambara
- Traductions centralisées dans `informations_translator.js`
- Formatage des dates selon la langue

### 5. Gestion d'état
- États de chargement avec spinner animé
- Gestion des erreurs avec retry
- État vide avec message encourageant

## Utilisation

### Import du composant principal
```javascript
import InformationsManager from './components/informations/InformationsManager.jsx';

// Dans votre composant
<InformationsManager 
  setShowInformationPage={setShowInformationPage}
  isOthersBGColors={isOthersBGColors}
/>
```

### Intégration des notifications
```javascript
import NotificationBadge from './components/informations/NotificationBadge.jsx';

// Dans HomeNavBar
<div className="relative">
  <button onClick={() => setShowInformationPage(true)}>
    Informations
  </button>
  <NotificationBadge onNotificationClick={() => setShowInformationPage(true)} />
</div>
```

### Utilisation des méthodes
```javascript
import {
  getAllInformations,
  listenToInformations,
  markInformationAsRead,
  getUnreadInformations
} from './components/informations/informations_methodes.js';

// Récupérer toutes les informations
const informations = await getAllInformations();

// Écouter les changements en temps réel
const unsubscribe = listenToInformations((informations) => {
  console.log('Nouvelles informations:', informations);
});

// Marquer comme lu
markInformationAsRead(informationId);
```

## Configuration Firebase

Le système utilise la configuration Firebase existante :
- `firebaseConfig.js` - Configuration
- `firebaseService.js` - Service principal
- `firebaseFirestore.js` - Méthodes Firestore

## Animations et design

### Animations Framer Motion
- Transitions fluides entre les états
- Animations de chargement sophistiquées
- Effets hover et interactions
- Animations de liste avec stagger

### Responsive Design
- Mobile-first approach
- Grille adaptative (1/2/3 colonnes)
- Composants optimisés pour tous les écrans

### Thèmes
- Support automatique du thème sombre/clair
- Couleurs adaptatives selon `isOthersBGColors`
- Cohérence avec le design system existant

## Gestion des erreurs

### Types d'erreurs gérées
- Erreurs de réseau
- Erreurs Firestore
- Timeouts de chargement
- Erreurs de média (images/vidéos)

### Recovery
- Boutons de retry
- Fallback pour les médias
- Messages d'erreur localisés

## Performance

### Optimisations
- Écoute en temps réel avec `onSnapshot`
- Lazy loading des images
- Memoization avec `useMemo` et `useCallback`
- Pagination automatique si nécessaire

### Stockage local
- État des informations lues avec `react-secure-storage`
- Persistance sécurisée des préférences

## Maintenance

### Ajout de nouvelles langues
1. Modifier `informations_translator.js`
2. Ajouter les traductions pour chaque clé
3. Tester l'affichage dans tous les composants

### Modification du design
1. Les couleurs sont centralisées via `useTheme`
2. Les animations sont dans les variants Framer Motion
3. Le responsive utilise les classes Tailwind standard

### Debug
- Logs détaillés dans la console
- États d'erreur explicites
- Fallbacks pour tous les cas d'échec

## Sécurité

- Validation des données Firestore
- Sanitisation du contenu markdown
- Gestion sécurisée du stockage local
- Protection contre les injections XSS

## Tests recommandés

1. **Fonctionnels**
   - Affichage avec/sans informations
   - Notifications en temps réel
   - Recherche et filtres
   - Changement de langue

2. **Performance**
   - Chargement avec beaucoup d'informations
   - Gestion mémoire des listeners
   - Responsive sur différents appareils

3. **Erreurs**
   - Perte de connexion
   - Données corrompues
   - Médias inaccessibles