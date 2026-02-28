"use client";
import { useAuth, getUserDoc } from "../AuthHandler";
import Image from "next/image";
import "./styles.scss";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../Firebase";


const AuthButton = () => {
  const [showTooltip, setShowTooltip] = useState(false);
    const router = useRouter();
  const { user, loading, isAdmin } = useAuth();
  const [userDoc, setUserDoc] = useState<any>(null);
  
const handleLogout = async () => {
  try {
    await signOut(auth);
    // Opcional: Redirecionar para a home ou login após sair
    window.location.href = "/"; 
  } catch (error) {
    console.error("Erro ao sair:", error);
  }
};

  // Atualiza o userDoc sempre que o user muda
  if (user && !userDoc) {
    getUserDoc(user.uid).then((doc) => {
      setUserDoc(doc);
    });
  }

  return (
    <>{!loading &&
    <span
    className="user-icon"
    onMouseEnter={() => setShowTooltip(true)}
    onMouseLeave={() => setShowTooltip(false)}
    >  
      <Image src={userDoc && userDoc.pfp == "default" ? "/profile.png" : userDoc?.pfp || "/profile.png"} alt="User Icon" fill={true} />
         {showTooltip && <div className="user-tooltip">
          {user ? <>
            <button onClick={() => router.push("/manage")}>Manage</button>
            <button onClick={() => handleLogout()}>Logout</button>
          
          </> : <>
            <button onClick={() => router.push("/login")}>Login</button>
            <button onClick={() => {router.push("/register")}}>Register</button>
          </>}
            </div>}
    </span>
}
      </>
  );
};

export default AuthButton;
