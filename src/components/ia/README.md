# Fatoumata IA - Assistant Intelligent pour SchoolManager

## Vue d'ensemble

Fatoumata est l'assistante IA spécialisée dans la gestion d'établissements scolaires, développée par Alkaou Dembélé pour SchoolManager (Entreprise Malienne). Elle offre une interface de chat moderne et intuitive, similaire à ChatGPT, avec des fonctionnalités avancées adaptées aux besoins de gestion scolaire.

## Architecture du Système

### Structure des Fichiers

```
src/components/ia/
├── ia.jsx                 # Composant principal de l'interface IA
├── Sidebar.jsx            # Barre latérale avec historique des chats
├── ChatMessage.jsx        # Composant d'affichage des messages
├── ChatInput.jsx          # Zone de saisie avancée avec upload
├── HelpModal.jsx          # Modal d'aide et documentation
├── command.js             # Méthodes d'accès à la base de données
├── ai_methodes.js         # Utilitaires et fonctions IA
├── ia_translator.js       # Système de traduction multilingue
└── README.md              # Documentation (ce fichier)
```

### Composants Principaux

#### 1. **ia.jsx** - Interface Principale
- Gestion de l'état global du chat
- Coordination entre tous les composants
- Gestion des messages et de l'historique
- Intégration avec l'API Flask

#### 2. **Sidebar.jsx** - Barre Latérale
- Historique des conversations
- Création de nouveaux chats
- Chats éphémères
- Recherche dans l'historique
- Suppression des conversations

#### 3. **ChatMessage.jsx** - Affichage des Messages
- Rendu des messages utilisateur et IA
- Support du Markdown
- Actions sur les messages (copier, lire, régénérer)
- Animation de frappe en temps réel
- Gestion des fichiers attachés

#### 4. **ChatInput.jsx** - Zone de Saisie
- Saisie de texte avec auto-resize
- Upload de fichiers (PDF, DOCX, DOC, TXT, images)
- Drag & drop
- Raccourcis clavier
- Validation des fichiers

#### 5. **HelpModal.jsx** - Aide Interactive
- Guide d'utilisation complet
- Explication des fonctionnalités
- Raccourcis clavier
- Types de fichiers supportés

### Modules Utilitaires

#### **command.js** - Accès aux Données
```javascript
// Méthodes disponibles pour l'IA
- getActiveDatabase()      // Informations sur la base active
- getSchoolInfo()          // Données de l'établissement
- getStudentsList()        // Liste des étudiants
- getEmployeesList()       // Liste des employés
- getClassesList()         // Liste des classes
- getStudentsByClass()     // Étudiants par classe
- searchStudent()          // Recherche d'étudiant
- getPaymentInfo()         // Informations de paiement
- getBulletinInfo()        // Informations des bulletins
- getExpenseInfo()         // Informations des dépenses
- getGeneralStats()        // Statistiques générales
```

#### **ai_methodes.js** - Fonctions Utilitaires
```javascript
// Gestion des chats
- saveChatToStorage()      // Sauvegarde locale sécurisée
- getChatsFromStorage()    // Récupération des chats
- deleteChatFromStorage()  // Suppression d'un chat
- deleteAllChatsFromStorage() // Suppression complète

// Communication IA
- sendMessageToAI()        // Envoi vers l'API Flask
- processAIResponse()      // Traitement des réponses
- createSystemPrompt()     // Prompt système personnalisé
- parseAICommands()        // Analyse des commandes IA

// Interface utilisateur
- createTypingAnimation()  // Animation de frappe
- copyToClipboard()        // Copie de texte
- readTextAloud()          // Lecture vocale
- formatMessage()          // Formatage Markdown
- validateFile()           // Validation des fichiers
```

## Fonctionnalités Principales

### 🎯 **Intelligence Contextuelle**
- Accès direct aux données de l'établissement
- Réponses personnalisées selon le contexte
- Exécution de commandes automatiques
- Analyse intelligente des requêtes

### 💬 **Interface de Chat Moderne**
- Design inspiré de ChatGPT
- Animation de frappe en temps réel
- Support complet du Markdown
- Messages avec horodatage
- Indicateurs de statut

### 📁 **Gestion des Fichiers**
- Upload par glisser-déposer
- Support PDF, DOCX, DOC, TXT, images
- Validation automatique
- Prévisualisation des fichiers
- Traitement intelligent du contenu

### 🗂️ **Historique et Persistance**
- Sauvegarde locale sécurisée
- Historique illimité
- Recherche dans les conversations
- Chats éphémères
- Génération automatique de titres

### 🌍 **Multilingue**
- Français (langue principale)
- Bambara (langue locale malienne)
- Anglais (langue internationale)
- Traduction dynamique de l'interface
- Adaptation culturelle

### ⌨️ **Raccourcis Clavier**
- `Enter` : Envoyer le message
- `Ctrl + Enter` : Nouvelle ligne
- `Ctrl + C` : Copier le message sélectionné
- `Esc` : Fermer l'interface

### 🎨 **Thèmes et Accessibilité**
- Mode sombre/clair automatique
- Animations fluides avec Framer Motion
- Interface responsive
- Accessibilité optimisée

## Configuration et Utilisation

### Prérequis
- React 18+
- Framer Motion
- Lucide React (icônes)
- React Secure Storage
- API Flask configurée

### Variables d'Environnement
```javascript
// Développement
const DEV_API_URL = "http://127.0.0.1:5000/chat";

// Production
const PROD_API_URL = "https://api.schoolmanager.com/chat";
```

### Intégration
```jsx
import IA from "./components/ia/ia.jsx";

function App() {
  const [showIA, setShowIA] = useState(false);
  
  return (
    <div>
      <button onClick={() => setShowIA(true)}>
        Ouvrir Fatoumata
      </button>
      
      <IA 
        isOpen={showIA} 
        onClose={() => setShowIA(false)} 
      />
    </div>
  );
}
```

## Système de Commandes IA

### Prompt Système
Fatoumata utilise un prompt système spécialisé qui lui permet de :
- Comprendre le contexte scolaire malien
- Identifier les besoins en données
- Exécuter les bonnes commandes
- Fournir des réponses pertinentes

### Détection Automatique
L'IA analyse automatiquement les requêtes pour détecter :
- Les besoins en informations d'étudiants
- Les demandes de statistiques
- Les requêtes sur les classes
- Les informations financières
- Les données administratives

### Exécution Transparente
Les commandes sont exécutées en arrière-plan :
1. Analyse de la requête utilisateur
2. Identification des commandes nécessaires
3. Exécution des requêtes base de données
4. Intégration des données dans la réponse
5. Présentation formatée à l'utilisateur

## Sécurité et Performance

### Sécurité
- Stockage local chiffré avec react-secure-storage
- Validation stricte des fichiers uploadés
- Sanitisation des entrées utilisateur
- Gestion sécurisée des erreurs

### Performance
- Lazy loading des composants
- Optimisation des re-rendus React
- Gestion efficace de la mémoire
- Animations optimisées
- Compression des données stockées

### Gestion d'Erreurs
- Retry automatique pour les requêtes échouées
- Messages d'erreur contextuels
- Fallback gracieux
- Logging détaillé pour le debug

## Développement et Maintenance

### Standards de Code
- Documentation JSDoc complète
- Commentaires en français
- Nommage explicite des variables
- Architecture modulaire
- Tests unitaires recommandés

### Extensibilité
- Architecture en composants réutilisables
- Système de plugins pour nouvelles fonctionnalités
- API standardisée pour les commandes
- Thèmes personnalisables

### Débogage
```javascript
// Activer les logs détaillés
localStorage.setItem('fatoumata_debug', 'true');

// Vider le cache des chats
localStorage.removeItem('fatoumata_chats');

// Réinitialiser les paramètres
localStorage.removeItem('fatoumata_settings');
```

## Support et Contact

**Développeur Principal :** Alkaou Dembélé  
**Entreprise :** SchoolManager (Mali)  
**Version :** 1.0.0  
**Dernière mise à jour :** Décembre 2024  

---

*Fatoumata IA - Votre assistante intelligente pour une gestion scolaire moderne et efficace.*