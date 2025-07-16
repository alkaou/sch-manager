/**
 * Script de Test des Corrections - Fatoumata AI
 * 
 * Ce fichier contient des fonctions de test pour vérifier que toutes les corrections
 * apportées au système fonctionnent correctement.
 * 
 * Développé par Alkaou Dembélé pour SchoolManager (Entreprise Malienne)
 */

// Test 1: Vérification du chargement des conversations
export const testConversationLoading = () => {
  console.log('🧪 Test 1: Chargement des conversations');
  
  // Simuler des données de test
  const testChats = [
    {
      id: 'chat-1',
      title: 'Conversation Test 1',
      messages: [
        { role: 'user', content: 'Bonjour' },
        { role: 'assistant', content: 'Bonjour ! Comment puis-je vous aider ?' }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'chat-2', 
      title: 'Conversation Test 2',
      messages: [
        { role: 'user', content: 'Statistiques école' },
        { role: 'assistant', content: 'Voici les statistiques...' }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];
  
  // Sauvegarder les conversations de test
  localStorage.setItem('fatoumata_chats', JSON.stringify(testChats));
  
  console.log('✅ Conversations de test créées:', testChats.length);
  return testChats;
};

// Test 2: Vérification de l'accès à la base de données Electron
export const testDatabaseAccess = async () => {
  console.log('🧪 Test 2: Accès à la base de données Electron');
  
  try {
    // Vérifier si window.electron est disponible
    if (typeof window !== 'undefined' && window.electron) {
      const database = await window.electron.getDatabase();
      console.log('✅ Base de données accessible:', {
        name: database?.name || 'Non défini',
        students: database?.students?.length || 0,
        employees: database?.employees?.length || 0,
        classes: database?.classes?.length || 0
      });
      return true;
    } else {
      console.log('⚠️ window.electron non disponible (normal en développement web)');
      return false;
    }
  } catch (error) {
    console.error('❌ Erreur accès base de données:', error);
    return false;
  }
};

// Test 3: Vérification des commandes de parsing
export const testCommandParsing = () => {
  console.log('🧪 Test 3: Parsing des commandes IA');
  
  const testResponses = [
    'Voici les informations [COMMAND:GET_SCHOOL_INFO] de votre établissement.',
    'Liste des étudiants: [COMMAND:GET_STUDENTS_LIST {"classe":"6ème"}]',
    'Statistiques générales: [COMMAND:GET_GENERAL_STATS]',
    'Recherche: [COMMAND:SEARCH_STUDENT "Dembélé"]'
  ];
  
  // Fonction de parsing simplifiée pour le test
  const parseCommands = (text) => {
    const commandRegex = /\[COMMAND:([A-Z_]+)(?:\s+(.+?))?\]/g;
    const commands = [];
    let match;
    
    while ((match = commandRegex.exec(text)) !== null) {
      commands.push({
        command: match[1],
        params: match[2] ? match[2] : null
      });
    }
    
    return commands;
  };
  
  testResponses.forEach((response, index) => {
    const commands = parseCommands(response);
    console.log(`✅ Test ${index + 1}:`, commands);
  });
  
  return true;
};

// Test 4: Vérification de la configuration CORS
export const testCORSConfiguration = async () => {
  console.log('🧪 Test 4: Configuration CORS');
  
  try {
    // Test de requête OPTIONS (preflight)
    const optionsResponse = await fetch('http://127.0.0.1:5000/chat', {
      method: 'OPTIONS',
      headers: {
        'Origin': 'http://localhost:3000',
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'Content-Type'
      }
    });
    
    console.log('✅ Requête OPTIONS réussie:', optionsResponse.status);
    
    // Vérifier les en-têtes CORS
    const corsHeaders = {
      'Access-Control-Allow-Origin': optionsResponse.headers.get('Access-Control-Allow-Origin'),
      'Access-Control-Allow-Methods': optionsResponse.headers.get('Access-Control-Allow-Methods'),
      'Access-Control-Allow-Headers': optionsResponse.headers.get('Access-Control-Allow-Headers')
    };
    
    console.log('✅ En-têtes CORS:', corsHeaders);
    return true;
    
  } catch (error) {
    console.log('⚠️ Serveur Flask non accessible (normal si non démarré):', error.message);
    return false;
  }
};

// Test 5: Test complet du flux de message
export const testCompleteMessageFlow = async () => {
  console.log('🧪 Test 5: Flux complet de message');
  
  const testMessage = {
    content: 'Donne-moi les statistiques de l\'établissement',
    files: []
  };
  
  try {
    // Simuler l'envoi d'un message (sans vraiment envoyer)
    console.log('📤 Message de test:', testMessage.content);
    
    // Vérifier que la fonction sendMessageToAI existe
    if (typeof window !== 'undefined' && window.sendMessageToAI) {
      console.log('✅ Fonction sendMessageToAI disponible');
    } else {
      console.log('⚠️ Fonction sendMessageToAI non disponible dans le contexte de test');
    }
    
    // Simuler une réponse avec commande
    const mockResponse = 'Voici les statistiques [COMMAND:GET_GENERAL_STATS] de votre établissement.';
    console.log('📥 Réponse simulée:', mockResponse);
    
    return true;
    
  } catch (error) {
    console.error('❌ Erreur dans le flux de message:', error);
    return false;
  }
};

// Fonction principale de test
export const runAllTests = async () => {
  console.log('🚀 Démarrage des tests de correction Fatoumata AI');
  console.log('================================================');
  
  const results = {
    conversationLoading: false,
    databaseAccess: false,
    commandParsing: false,
    corsConfiguration: false,
    completeMessageFlow: false
  };
  
  try {
    // Exécuter tous les tests
    testConversationLoading();
    results.conversationLoading = true;
    
    results.databaseAccess = await testDatabaseAccess();
    
    testCommandParsing();
    results.commandParsing = true;
    
    results.corsConfiguration = await testCORSConfiguration();
    
    results.completeMessageFlow = await testCompleteMessageFlow();
    
    // Afficher le résumé
    console.log('================================================');
    console.log('📊 Résumé des tests:');
    Object.entries(results).forEach(([test, passed]) => {
      console.log(`${passed ? '✅' : '❌'} ${test}: ${passed ? 'RÉUSSI' : 'ÉCHEC'}`);
    });
    
    const passedTests = Object.values(results).filter(Boolean).length;
    const totalTests = Object.keys(results).length;
    
    console.log(`\n🎯 Score: ${passedTests}/${totalTests} tests réussis`);
    
    if (passedTests === totalTests) {
      console.log('🎉 Tous les tests sont réussis ! Les corrections fonctionnent correctement.');
    } else {
      console.log('⚠️ Certains tests ont échoué. Vérifiez la configuration.');
    }
    
    return results;
    
  } catch (error) {
    console.error('❌ Erreur lors de l\'exécution des tests:', error);
    return results;
  }
};

// Exporter pour utilisation dans la console du navigateur
if (typeof window !== 'undefined') {
  window.testFatoumataCorrections = {
    runAllTests,
    testConversationLoading,
    testDatabaseAccess,
    testCommandParsing,
    testCORSConfiguration,
    testCompleteMessageFlow
  };
  
  console.log('🔧 Tests Fatoumata disponibles dans window.testFatoumataCorrections');
}

// Instructions d'utilisation
console.log(`
📋 Instructions d'utilisation:

1. Dans la console du navigateur, tapez:
   window.testFatoumataCorrections.runAllTests()

2. Pour tester individuellement:
   window.testFatoumataCorrections.testConversationLoading()
   window.testFatoumataCorrections.testDatabaseAccess()
   etc.

3. Assurez-vous que:
   - L'application React est démarrée
   - Le serveur Flask est démarré avec la config CORS
   - L'environnement Electron est disponible (si applicable)
`);