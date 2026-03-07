
const { onDocumentWritten } = require("firebase-functions/v2/firestore");
const { getAuth } = require("firebase-admin/auth");
const admin = require("firebase-admin");

// Inicializa o admin SDK
admin.initializeApp();

/**
 * Função para sincronizar Custom Claims do Firebase Auth 
 * baseadas no documento do usuário no Firestore.
 */
exports.syncUserClaims = onDocumentWritten("users/{userId}", async (event) => {
  const userId = event.params.userId;
  const snapshot = event.data.after; // Dados após a gravação
  
  // Se o documento foi deletado, removemos as claims
  if (!snapshot.exists) {
    await getAuth().setCustomUserClaims(userId, null);
    console.log(`Claims removidas para o usuário ${userId}`);
    return;
  }

  const userData = snapshot.data();
  const userRole = userData.role || 'USER'; 
  const userCompanyId = userData.companyId || null;

  // Montamos o objeto de claims (Limite de 1000 bytes do Firebase)
  const claims = {
    role: userRole,
    companyId: userCompanyId
  };

  try {
    // Injeta as claims no Auth do usuário para validação via Security Rules e Server-side
    await getAuth().setCustomUserClaims(userId, claims);
    console.log(`Claims atualizadas para ${userId}:`, claims);
  } catch (error) {
    console.error("Erro ao atualizar claims:", error);
  }
});
