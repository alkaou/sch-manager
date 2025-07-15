// Test de la persistance des notifications avec secureLocalStorage
import { 
  notificationManager, 
  createSystemNotification,
  createExternalNotification,
  markAsRead,
  markAllAsRead,
  removeNotification,
  clearAllNotifications,
  getAllNotifications,
  getUnreadCount
} from '../components/notifications/notifications.js';
import secureLocalStorage from "react-secure-storage";

// Test de la persistance des notifications
export const testNotificationPersistence = () => {
  console.log('🧪 Test de la persistance des notifications...');
  
  // Nettoyer le stockage pour commencer proprement
  secureLocalStorage.removeItem('notifications');
  secureLocalStorage.removeItem('lastNotificationId');
  
  console.log('✅ Stockage nettoyé');
  
  // Vérifier qu'il n'y a aucune notification au départ
  const initialNotifications = getAllNotifications();
  console.log('📊 Notifications initiales:', initialNotifications.length);
  console.log('📊 Non lues initiales:', getUnreadCount());
  
  // Créer quelques notifications de test
  const notif1 = createSystemNotification(
    'Test Notification 1',
    'Ceci est une notification de test système',
    'info',
    { priority: 'normal' }
  );
  
  const notif2 = createExternalNotification(
    'Test External Notification',
    'Ceci est une notification externe de test',
    { priority: 'high' }
  );
  
  console.log('✅ Notifications créées:', notif1.id, notif2.id);
  console.log('📊 Total après création:', getAllNotifications().length);
  console.log('📊 Non lues après création:', getUnreadCount());
  
  // Vérifier la persistance
  const storedNotifications = secureLocalStorage.getItem('notifications');
  console.log('💾 Notifications stockées:', storedNotifications ? JSON.parse(storedNotifications).length : 0);
  
  return { notif1, notif2 };
};

// Test du marquage comme lu
export const testMarkAsRead = (notificationId) => {
  console.log('🧪 Test du marquage comme lu...');
  
  const unreadBefore = getUnreadCount();
  console.log('📊 Non lues avant marquage:', unreadBefore);
  
  markAsRead(notificationId);
  
  const unreadAfter = getUnreadCount();
  console.log('📊 Non lues après marquage:', unreadAfter);
  console.log('✅ Différence:', unreadBefore - unreadAfter);
  
  // Vérifier la persistance
  const storedNotifications = JSON.parse(secureLocalStorage.getItem('notifications'));
  const markedNotification = storedNotifications.find(n => n.id === notificationId);
  console.log('💾 Notification marquée dans le stockage:', markedNotification?.read);
  
  return unreadAfter;
};

// Test du marquage de toutes comme lues
export const testMarkAllAsRead = () => {
  console.log('🧪 Test du marquage de toutes comme lues...');
  
  const unreadBefore = getUnreadCount();
  console.log('📊 Non lues avant marquage global:', unreadBefore);
  
  markAllAsRead();
  
  const unreadAfter = getUnreadCount();
  console.log('📊 Non lues après marquage global:', unreadAfter);
  console.log('✅ Toutes marquées comme lues:', unreadAfter === 0);
  
  // Vérifier la persistance
  const storedNotifications = JSON.parse(secureLocalStorage.getItem('notifications'));
  const allRead = storedNotifications.every(n => n.read);
  console.log('💾 Toutes marquées dans le stockage:', allRead);
  
  return unreadAfter;
};

// Test de la suppression
export const testRemoveNotification = (notificationId) => {
  console.log('🧪 Test de la suppression de notification...');
  
  const totalBefore = getAllNotifications().length;
  console.log('📊 Total avant suppression:', totalBefore);
  
  removeNotification(notificationId);
  
  const totalAfter = getAllNotifications().length;
  console.log('📊 Total après suppression:', totalAfter);
  console.log('✅ Notification supprimée:', totalBefore - totalAfter === 1);
  
  // Vérifier la persistance
  const storedNotifications = JSON.parse(secureLocalStorage.getItem('notifications'));
  const notificationExists = storedNotifications.some(n => n.id === notificationId);
  console.log('💾 Notification supprimée du stockage:', !notificationExists);
  
  return totalAfter;
};

// Test de la suppression de toutes les notifications
export const testClearAllNotifications = () => {
  console.log('🧪 Test de la suppression de toutes les notifications...');
  
  const totalBefore = getAllNotifications().length;
  console.log('📊 Total avant suppression globale:', totalBefore);
  
  clearAllNotifications();
  
  const totalAfter = getAllNotifications().length;
  console.log('📊 Total après suppression globale:', totalAfter);
  console.log('✅ Toutes supprimées:', totalAfter === 0);
  
  // Vérifier la persistance
  const storedNotifications = secureLocalStorage.getItem('notifications');
  const storageEmpty = !storedNotifications || JSON.parse(storedNotifications).length === 0;
  console.log('💾 Stockage vidé:', storageEmpty);
  
  return totalAfter;
};

// Test complet de la persistance
export const runPersistenceTests = () => {
  console.log('🚀 Démarrage des tests de persistance...');
  console.log('=' .repeat(50));
  
  // Test 1: Persistance de base
  const { notif1, notif2 } = testNotificationPersistence();
  
  console.log('\n' + '-'.repeat(30));
  
  // Test 2: Marquage comme lu
  testMarkAsRead(notif1.id);
  
  console.log('\n' + '-'.repeat(30));
  
  // Test 3: Créer une nouvelle notification pour tester le marquage global
  const notif3 = createSystemNotification(
    'Test Notification 3',
    'Pour tester le marquage global',
    'warning'
  );
  
  // Test 4: Marquage global
  testMarkAllAsRead();
  
  console.log('\n' + '-'.repeat(30));
  
  // Test 5: Suppression individuelle
  testRemoveNotification(notif2.id);
  
  console.log('\n' + '-'.repeat(30));
  
  // Test 6: Suppression globale
  testClearAllNotifications();
  
  console.log('\n' + '='.repeat(50));
  console.log('✨ Tous les tests de persistance terminés!');
  console.log('📝 Vérifiez les résultats dans la console.');
};

// Fonction pour tester depuis la console du navigateur
window.testPersistence = {
  runAll: runPersistenceTests,
  testPersistence: testNotificationPersistence,
  testMarkAsRead: testMarkAsRead,
  testMarkAllAsRead: testMarkAllAsRead,
  testRemove: testRemoveNotification,
  testClearAll: testClearAllNotifications
};

export default {
  testNotificationPersistence,
  testMarkAsRead,
  testMarkAllAsRead,
  testRemoveNotification,
  testClearAllNotifications,
  runPersistenceTests
};