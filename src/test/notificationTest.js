// Test du système de notifications
import { 
  notificationManager, 
  createEventReminder, 
  createExternalNotificationFromURL,
  speakEventReminder 
} from '../components/notifications/notifications.js';
import { sendTestNotification, sendMaintenanceNotification } from '../api/notificationAPI.js';

// Test des notifications d'événements
export const testEventNotifications = () => {
  console.log('🧪 Test des notifications d\'événements...');
  
  // Créer un événement de test qui commence dans 30 minutes
  const testEvent = {
    id: 'test-event-1',
    title: 'Réunion importante',
    startDate: new Date(Date.now() + 30 * 60 * 1000), // Dans 30 minutes
    description: 'Réunion avec l\'équipe de développement'
  };
  
  // Créer une notification de rappel
  const reminder = createEventReminder(testEvent, 'fr');
  console.log('✅ Notification de rappel créée:', reminder);
  
  // Tester la synthèse vocale
  speakEventReminder(testEvent, 'fr');
  console.log('🔊 Message vocal lu en français');
  
  // Tester en anglais
  setTimeout(() => {
    speakEventReminder(testEvent, 'en');
    console.log('🔊 Message vocal lu en anglais');
  }, 3000);
};

// Test des notifications externes
export const testExternalNotifications = () => {
  console.log('🧪 Test des notifications externes...');
  
  // Test notification simple
  const result1 = sendTestNotification();
  console.log('✅ Notification de test:', result1);
  
  // Test notification de maintenance
  const result2 = sendMaintenanceNotification('14:00', '16:00');
  console.log('✅ Notification de maintenance:', result2);
  
  // Test notification via URL (simulation)
  const externalNotif = createExternalNotificationFromURL({
    title: 'Nouvelle politique de sécurité',
    message: 'Veuillez consulter la nouvelle politique de sécurité dans votre espace personnel.',
    type: 'warning',
    priority: 'high',
    icon: 'shield'
  });
  console.log('✅ Notification externe créée:', externalNotif);
};

// Test du gestionnaire de notifications
export const testNotificationManager = () => {
  console.log('🧪 Test du gestionnaire de notifications...');
  
  // Écouter les changements
  const unsubscribe = notificationManager.addListener((notifications) => {
    console.log('📢 Notifications mises à jour:', notifications.length, 'notifications');
    console.log('📊 Non lues:', notificationManager.getUnreadCount());
  });
  
  // Créer quelques notifications de test
  testEventNotifications();
  testExternalNotifications();
  
  // Nettoyer après 10 secondes
  setTimeout(() => {
    unsubscribe();
    console.log('🧹 Test terminé, listeners supprimés');
  }, 10000);
};

// Test complet du système
export const runAllTests = () => {
  console.log('🚀 Démarrage des tests du système de notifications...');
  console.log('=' .repeat(50));
  
  testNotificationManager();
  
  console.log('=' .repeat(50));
  console.log('✨ Tous les tests sont en cours d\'exécution!');
  console.log('📝 Vérifiez la console et les notifications dans l\'interface.');
};

// Fonction pour tester depuis la console du navigateur
window.testNotifications = {
  runAll: runAllTests,
  testEvents: testEventNotifications,
  testExternal: testExternalNotifications,
  testManager: testNotificationManager
};

export default {
  testEventNotifications,
  testExternalNotifications,
  testNotificationManager,
  runAllTests
};