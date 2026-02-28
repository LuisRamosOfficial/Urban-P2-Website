import { storage, db } from "@/app/Components/Firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, updateDoc } from "firebase/firestore";

// Função para mudar a foto
export const updatePfp = async (userId: string, file: File): Promise<string> => {
  const storageRef = ref(storage, `profile_pictures/${userId}`);
  await uploadBytes(storageRef, file);
  const downloadURL = await getDownloadURL(storageRef);
  
  await updateDoc(doc(db, "users", userId), { pfp: downloadURL });
  return downloadURL;
};

// Função para mudar o username
export const updateUsername = async (userId: string, newName: string): Promise<void> => {
  await updateDoc(doc(db, "users", userId), { username: newName });
};