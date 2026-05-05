'use server';

import { adminAuth, adminDb } from '@/lib/firebase-admin';

/**
 * Ação chamada pelo celular (depois de logado) para autorizar a TV.
 * Recebe o código da TV e o ID Token do usuário do celular para provar identidade.
 */
export async function approveTvSession(code: string, userIdToken: string) {
  try {
    // 1. Verifica se o usuário que está fazendo o request realmente está logado
    const decodedToken = await adminAuth.verifyIdToken(userIdToken);
    const uid = decodedToken.uid;

    if (!uid) {
      throw new Error("Usuário não autenticado");
    }

    // 2. Gera um Custom Token para esse usuário (A TV vai usar isso para logar sem senha)
    const customToken = await adminAuth.createCustomToken(uid);

    // 3. Verifica se a sessão da TV existe
    const sessionRef = adminDb.collection('tv_auth_sessions').doc(code);
    const sessionDoc = await sessionRef.get();

    if (!sessionDoc.exists) {
      throw new Error("Código da TV inválido ou expirado.");
    }

    if (sessionDoc.data()?.status === 'authenticated') {
      throw new Error("Esta TV já foi autorizada.");
    }

    // 4. Salva o Custom Token no banco para a TV capturar
    await sessionRef.update({
      status: 'authenticated',
      customToken: customToken,
      authorizedByUid: uid,
      authorizedAt: new Date().toISOString(),
    });

    return { success: true };
  } catch (error: any) {
    console.error("Erro ao aprovar TV Session:", error);
    return { success: false, error: error.message };
  }
}
