// Test pour vérifier le tri des notifications et l'unicité des IDs
import {
  notificationManager,
  createSystemNotification,
  getAllNotifications,
  clearAllNotifications,
} from "../components/notifications/notifications.js";

// Fonction de test pour le tri des notifications
export function testNotificationSorting() {
  console.log("=== Test du tri des notifications ===");
  
  // Nettoyer les notifications existantes
  clearAllNotifications();
  
  // Créer des notifications avec des timestamps différents
  const now = new Date();
  
  // Notification 1 (la plus ancienne)
  const notification1 = {
    id: 1,
    title: "Notification Ancienne",
    message: "Cette notification est la plus ancienne",
    time: new Date(now.getTime() - 3600000).toISOString(), // 1 heure avant
    read: false,
  };
  
  // Notification 2 (moyenne)
  const notification2 = {
    id: 2,
    title: "Notification Moyenne",
    message: "Cette notification est au milieu",
    time: new Date(now.getTime() - 1800000).toISOString(), // 30 minutes avant
    read: false,
  };
  
  // Notification 3 (la plus récente)
  const notification3 = {
    id: 3,
    title: "Notification Récente",
    message: "Cette notification est la plus récente",
    time: now.toISOString(), // maintenant
    read: false,
  };
  
  // Ajouter les notifications dans le désordre
  notificationManager.notifications.push(notification1);
  notificationManager.notifications.push(notification3);
  notificationManager.notifications.push(notification2);
  
  // Sauvegarder
  notificationManager.saveNotificationsToStorage();
  
  // Récupérer les notifications triées
  const sortedNotifications = getAllNotifications();
  
  console.log("Notifications triées (plus récente en premier):");
  sortedNotifications.forEach((notif, index) => {
    console.log(`${index + 1}. ${notif.title} - ${notif.time}`);
  });
  
  // Vérifier l'ordre
  const isCorrectOrder = 
    sortedNotifications[0].id === 3 && // Plus récente
    sortedNotifications[1].id === 2 && // Moyenne
    sortedNotifications[2].id === 1;   // Plus ancienne
  
  console.log("Ordre correct:", isCorrectOrder ? "✅ OUI" : "❌ NON");
  
  return isCorrectOrder;
}

// Fonction de test pour l'unicité des IDs
export function testUniqueIds() {
  console.log("\n=== Test de l'unicité des IDs ===");
  
  // Nettoyer les notifications existantes
  clearAllNotifications();
  
  // Créer plusieurs notifications
  createSystemNotification("Test 1", "Message 1", "info");
  createSystemNotification("Test 2", "Message 2", "info");
  createSystemNotification("Test 3", "Message 3", "info");
  createSystemNotification("Test 4", "Message 4", "info");
  createSystemNotification("Test 5", "Message 5", "info");
  
  const notifications = getAllNotifications();
  const ids = notifications.map(n => n.id);
  const uniqueIds = [...new Set(ids)];
  
  console.log("IDs des notifications:", ids);
  console.log("IDs uniques:", uniqueIds);
  console.log("Tous les IDs sont uniques:", ids.length === uniqueIds.length ? "✅ OUI" : "❌ NON");
  
  // Vérifier que les IDs sont séquentiels
  const isSequential = ids.every((id, index) => {
    if (index === 0) return true;
    return id === ids[index - 1] + 1;
  });
  
  console.log("IDs séquentiels:", isSequential ? "✅ OUI" : "❌ NON");
  
  return ids.length === uniqueIds.length && isSequential;
}

// Fonction de test pour la suppression
export function testClearNotifications() {
  console.log("\n=== Test de suppression des notifications ===");
  
  // Créer quelques notifications
  createSystemNotification("Test Clear 1", "Message 1", "info");
  createSystemNotification("Test Clear 2", "Message 2", "info");
  
  let notifications = getAllNotifications();
  console.log("Notifications avant suppression:", notifications.length);
  
  // Supprimer toutes les notifications
  clearAllNotifications();
  
  notifications = getAllNotifications();
  console.log("Notifications après suppression:", notifications.length);
  
  const isCleared = notifications.length === 0;
  console.log("Suppression réussie:", isCleared ? "✅ OUI" : "❌ NON");
  
  return isCleared;
}

// Exécuter tous les tests
export function runAllTests() {
  console.log("🧪 Démarrage des tests de notifications\n");
  
  const test1 = testNotificationSorting();
  const test2 = testUniqueIds();
  const test3 = testClearNotifications();
  
  console.log("\n📊 Résultats des tests:");
  console.log("- Tri des notifications:", test1 ? "✅ PASSÉ" : "❌ ÉCHOUÉ");
  console.log("- Unicité des IDs:", test2 ? "✅ PASSÉ" : "❌ ÉCHOUÉ");
  console.log("- Suppression:", test3 ? "✅ PASSÉ" : "❌ ÉCHOUÉ");
  
  const allPassed = test1 && test2 && test3;
  console.log("\n🎯 Résultat global:", allPassed ? "✅ TOUS LES TESTS PASSÉS" : "❌ CERTAINS TESTS ONT ÉCHOUÉ");
  
  return allPassed;
}

// Auto-exécution si le fichier est importé
if (typeof window !== 'undefined') {
  window.testNotifications = {
    runAllTests,
    testNotificationSorting,
    testUniqueIds,
    testClearNotifications,
  };
}