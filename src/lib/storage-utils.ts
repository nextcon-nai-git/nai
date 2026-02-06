
import { ref, uploadBytes, getDownloadURL, FirebaseStorage } from "firebase/storage";
import { doc, updateDoc, Firestore } from "firebase/firestore";

/**
 * Faz upload da Logo e atualiza o cadastro da empresa no Firestore.
 * O caminho é padronizado como clients/{userId}/logos/{companyId} para facilitar a gestão.
 */
export async function uploadCompanyLogo(
  storage: FirebaseStorage, 
  db: Firestore, 
  file: File, 
  userId: string,
  companyId: string
) {
  try {
    const fileExtension = file.name.split('.').pop();
    const storagePath = `clients/${userId}/logos/${companyId}.${fileExtension}`;
    
    const storageRef = ref(storage, storagePath);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);

    // Atualiza o documento da empresa dentro da subcoleção managedCompanies do cliente
    const companyRef = doc(db, "clients", userId, "managedCompanies", companyId);
    await updateDoc(companyRef, {
      logoUrl: downloadURL,
      updatedAt: new Date().toISOString()
    });

    return downloadURL;
  } catch (error) {
    console.error("Erro ao fazer upload da logo:", error);
    throw error;
  }
}
