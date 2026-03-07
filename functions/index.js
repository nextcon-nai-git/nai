const { onDocumentWritten } = require("firebase-functions/v2/firestore");
const { getAuth } = require("firebase-admin/auth");
const admin = require("firebase-admin");

// Inicializa o admin SDK
admin.initializeApp();

/**
 * Cloud Function para sincronizar Custom Claims do Firebase Auth 
 * baseadas no documento do usuário no Firestore.
 * Garante que role e companyId estejam no token para Security Rules eficientes.
 */
exports.syncUserClaims = onDocumentWritten("users/{userId}", async (event) => {
  const userId = event.params.userId;
  const snapshot = event.data.after; 
  
  if (!snapshot.exists) {
    await getAuth().setCustomUserClaims(userId, null);
    console.log(`Claims removidas para o usuário ${userId}`);
    return;
  }

  const userData = snapshot.data();
  const userRole = userData.role || 'USER'; 
  const userCompanyId = userData.companyId || null;

  const claims = {
    role: userRole,
    companyId: userCompanyId
  };

  try {
    await getAuth().setCustomUserClaims(userId, claims);
    console.log(`Claims atualizadas para ${userId}:`, claims);
  } catch (error) {
    console.error("Erro ao atualizar claims:", error);
  }
});