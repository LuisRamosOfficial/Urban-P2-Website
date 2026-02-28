"use client";
import { useState, useEffect } from "react";
import { useAuth } from "../Components/AuthHandler";
import { db } from "@/app/Components/Firebase";
import { doc, getDoc } from "firebase/firestore";
import styles from "./styles.module.scss";
import ProtectedRoute from "../Components/ProtectMiddleware";
import { AvatarSection } from "../Components/Manage/IconChanger";
import { updateUsername } from "../Components/Services/userServices";

const Manage = () => {
  const { user } = useAuth();
  const [userDoc, setUserDoc] = useState<any>(null);
  const [newName, setNewName] = useState("");


  
  useEffect(() => {
    if (user) {
      const docRef = doc(db, "users", user.uid);
      getDoc(docRef).then((snap) => {
        if (snap.exists()) {
          setUserDoc(snap.data());
          setNewName(snap.data().username);
        } else {
          // Define um estado vazio mas não nulo para "acordar" os filhos
        setNewName("");
        setUserDoc({ pfp: "default" });
      }
    });
  }
}, [user]);

  const handleUsernameUpdate = async () => {
    if (!user || newName.length < 3) return alert("Username muito curto!");
    try {
      await updateUsername(user.uid, newName);
      alert("Username atualizado!");
    } catch (e) {
      alert("Erro ao atualizar username.");
    }
  };
  
  return (
    <ProtectedRoute>
      <main className={styles["manage"]}>
        <h1>Manage Page</h1>
        <div className={styles["manage-box"]}>
          
          {user && (
            <AvatarSection 
              userId={user.uid} 
              currentPfp={userDoc?.pfp || "default"} 
              styles={styles} 
            />
          )}

          <div className={styles.central}></div>

          <div className={styles.direito}>
            <h2>Account Details</h2>
            <div className={styles.formGroup}>
              <label>Username:</label>
              <input 
                type="text" 
                value={newName || ""} 
                onChange={(e) => setNewName(e.target.value)} 
              />
              <button onClick={handleUsernameUpdate}>Update Name</button>
            </div>
            <p>Email: {user?.email}</p>
          </div>

        </div>
      </main>
    </ProtectedRoute>
  );
};

export default Manage;