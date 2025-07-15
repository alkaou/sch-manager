// Test du système de surveillance des événements
import { 
  notificationManager,
  createSystemNotification 
} from '../components/notifications/notifications.js';

// Fonction pour créer des événements de test
function createTestEvents() {
  console.log('🧪 Création d\'événements de test...');
  
  const now = new Date();
  
  // Événement dans 25 minutes (doit déclencher une notification)
  const event1 = {
    id: 'test-event-25min',
    title: 'Réunion importante dans 25 min',
    description: 'Réunion avec l\'équipe de développement',
    type: 'conference',
    startDate: new Date(now.getTime() + 25 * 60 * 1000).toISOString().split('T')[0],
    startTime: new Date(now.getTime() + 25 * 60 * 1000).toTimeString().slice(0, 5),
    endDate: new Date(now.getTime() + 85 * 60 * 1000).toISOString().split('T')[0],
    endTime: new Date(now.getTime() + 85 * 60 * 1000).toTimeString().slice(0, 5),
    status: 'pending',
    notificationsIsSended: false,
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
    validation: null
  };
  
  // Événement dans 15 minutes (doit déclencher une notification)
  const event2 = {
    id: 'test-event-15min',
    title: 'Cours de mathématiques dans 15 min',
    description: 'Cours de mathématiques avancées',
    type: 'exam_period',
    startDate: new Date(now.getTime() + 15 * 60 * 1000).toISOString().split('T')[0],
    startTime: new Date(now.getTime() + 15 * 60 * 1000).toTimeString().slice(0, 5),
    endDate: new Date(now.getTime() + 75 * 60 * 1000).toISOString().split('T')[0],
    endTime: new Date(now.getTime() + 75 * 60 * 1000).toTimeString().slice(0, 5),
    status: 'pending',
    notificationsIsSended: false,
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
    validation: null
  };
  
  // Événement dans 45 minutes (ne doit PAS déclencher de notification)
  const event3 = {
    id: 'test-event-45min',
    title: 'Événement dans 45 min',
    description: 'Événement qui ne doit pas encore notifier',
    type: 'workshop',
    startDate: new Date(now.getTime() + 45 * 60 * 1000).toISOString().split('T')[0],
    startTime: new Date(now.getTime() + 45 * 60 * 1000).toTimeString().slice(0, 5),
    endDate: new Date(now.getTime() + 105 * 60 * 1000).toISOString().split('T')[0],
    endTime: new Date(now.getTime() + 105 * 60 * 1000).toTimeString().slice(0, 5),
    status: 'pending',
    notificationsIsSended: false,
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
    validation: null
  };
  
  // Événement avec notification déjà envoyée (ne doit PAS déclencher de notification)
  const event4 = {
    id: 'test-event-already-sent',
    title: 'Événement notification déjà envoyée',
    description: 'Cet événement a déjà envoyé sa notification',
    type: 'meeting',
    startDate: new Date(now.getTime() + 20 * 60 * 1000).toISOString().split('T')[0],
    startTime: new Date(now.getTime() + 20 * 60 * 1000).toTimeString().slice(0, 5),
    endDate: new Date(now.getTime() + 80 * 60 * 1000).toISOString().split('T')[0],
    endTime: new Date(now.getTime() + 80 * 60 * 1000).toTimeString().slice(0, 5),
    status: 'pending',
    notificationsIsSended: true, // Déjà envoyée
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
    validation: null
  };
  
  return [event1, event2, event3, event4];
}

// Fonction pour sauvegarder les événements de test dans la base de données
async function saveTestEventsToDatabase(events) {
  try {
    if (window.electron && window.electron.loadDatabase && window.electron.saveDatabase) {
      const database = await window.electron.loadDatabase();
      
      // Initialiser le tableau events s'il n'existe pas
      if (!database.events) {
        database.events = [];
      }
      
      // Supprimer les anciens événements de test
      database.events = database.events.filter(event => 
        !event.id.startsWith('test-event-')
      );
      
      // Ajouter les nouveaux événements de test
      database.events.push(...events);
      
      await window.electron.saveDatabase(database);
      console.log('✅ Événements de test sauvegardés dans la base de données');
      
      return true;
    } else {
      console.warn('⚠️ API Electron non disponible, utilisation du localStorage');
      localStorage.setItem('events', JSON.stringify(events));
      return true;
    }
  } catch (error) {
    console.error('❌ Erreur lors de la sauvegarde des événements de test:', error);
    return false;
  }
}

// Fonction pour tester le système de surveillance
async function testEventMonitoring() {
  console.log('🚀 Début du test de surveillance des événements');
  
  // Créer les événements de test
  const testEvents = createTestEvents();
  
  // Sauvegarder dans la base de données
  const saved = await saveTestEventsToDatabase(testEvents);
  
  if (!saved) {
    console.error('❌ Impossible de sauvegarder les événements de test');
    return;
  }
  
  // Afficher les événements créés
  console.log('📋 Événements de test créés:');
  testEvents.forEach(event => {
    const eventTime = new Date(`${event.startDate}T${event.startTime}`);
    const now = new Date();
    const minutesDiff = Math.floor((eventTime.getTime() - now.getTime()) / (1000 * 60));
    
    console.log(`  - ${event.title}: dans ${minutesDiff} minutes (notification envoyée: ${event.notificationsIsSended})`);
  });
  
  // Démarrer la surveillance
  console.log('🔄 Démarrage de la surveillance...');
  notificationManager.initializeEventMonitoring();
  
  // Créer une notification système pour informer
  createSystemNotification(
    'Test de surveillance démarré',
    'Le système de surveillance des événements a été démarré avec des événements de test.',
    'info',
    { priority: 'normal', icon: 'info' }
  );
  
  console.log('✅ Test de surveillance des événements terminé');
  console.log('ℹ️ Vérifiez la console dans les prochaines minutes pour voir les notifications automatiques');
}

// Fonction pour arrêter la surveillance
function stopEventMonitoring() {
  if (notificationManager.eventCheckInterval) {
    clearInterval(notificationManager.eventCheckInterval);
    notificationManager.eventCheckInterval = null;
    console.log('🛑 Surveillance des événements arrêtée');
    
    createSystemNotification(
      'Surveillance arrêtée',
      'Le système de surveillance des événements a été arrêté.',
      'warning',
      { priority: 'normal', icon: 'warning' }
    );
  }
}

// Fonction pour nettoyer les événements de test
async function cleanupTestEvents() {
  try {
    if (window.electron && window.electron.loadDatabase && window.electron.saveDatabase) {
      const database = await window.electron.loadDatabase();
      
      if (database.events) {
        const originalCount = database.events.length;
        database.events = database.events.filter(event => 
          !event.id.startsWith('test-event-')
        );
        
        await window.electron.saveDatabase(database);
        const removedCount = originalCount - database.events.length;
        console.log(`🧹 ${removedCount} événement(s) de test supprimé(s)`);
        
        createSystemNotification(
          'Nettoyage terminé',
          `${removedCount} événement(s) de test supprimé(s) de la base de données.`,
          'success',
          { priority: 'normal', icon: 'success' }
        );
      }
    }
  } catch (error) {
    console.error('❌ Erreur lors du nettoyage:', error);
  }
}

// Exporter les fonctions pour utilisation dans la console
window.testEventMonitoring = testEventMonitoring;
window.stopEventMonitoring = stopEventMonitoring;
window.cleanupTestEvents = cleanupTestEvents;

// Démarrer automatiquement le test
testEventMonitoring();

export {
  testEventMonitoring,
  stopEventMonitoring,
  cleanupTestEvents,
  createTestEvents,
  saveTestEventsToDatabase
};