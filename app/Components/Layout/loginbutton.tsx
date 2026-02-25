"use client";
import { AuthHandler, useAuth } from "../AuthHandler";
import Image from "next/image";
import "./styles.scss";
import { useRouter } from "next/navigation";
import { useState } from "react";
const AuthButton = () => {
  const [showTooltip, setShowTooltip] = useState(false);
    const router = useRouter();
  const { user, loading, isAdmin } = useAuth();
  return (
    <>{!loading &&
    <span
    className="user-icon"
    onMouseEnter={() => setShowTooltip(true)}
    onMouseLeave={() => setShowTooltip(false)}
    >  
      <Image src="/profile.png" alt="User Icon" fill={true} />
         {showTooltip && <div className="user-tooltip">
            <button onClick={() => router.push("/login")}>Login</button>
            <button onClick={() => {router.push("/register")}}>Register</button>
            </div>}
    </span>
}
      </>
  );
};

export default AuthButton;
