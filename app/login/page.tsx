"use client";
import styles from "./page.module.scss";
import Image from "next/image";
import { auth, db } from "@/app/Components/Firebase"; // Importa as instâncias do teu ficheiro de configuração
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useState } from "react";
import { useRouter } from "next/navigation";

const validateEmail = (email: string) => {
  return /\S+@\S+\.\S+/.test(email);
};

const validatePassword = (password: string) => {
  // Pelo menos 6 caracteres, uma letra e um número
  const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
  return regex.test(password);
};

const Login = () => {
  // Estados para capturar os inputs
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();



  const handleGoogleLogin = async () => {
    setError("");
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Verificar se o utilizador já existe no Firestore para não sobrescrever dados antigos
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        // Se for um novo utilizador, criamos o documento dele
        await setDoc(userRef, {
          username: user.displayName || "Google User",
          email: user.email,
          role: "reader",
          pfp: user.photoURL || "default",
          createdAt: new Date(),
        });
      }
    
      router.push("/");
    } catch (err: any) {
      if (err.code !== 'auth/cancelled-popup-request') {
        setError("Erro ao entrar com Google: " + err.message);
      }
    }
  };
  
 const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    try {
      // 1. Tentar autenticar no Firebase
      await signInWithEmailAndPassword(auth, email, password);

      // 2. Se o login for bem-sucedido, o AuthHandler vai detetar a mudança automaticamente
      router.push("/");
    } catch (err: any) {
      // Tratamento de erros comuns de login
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError("Email ou password incorretos.");
      } else {
        setError("Erro ao entrar: " + err.message);
      }
    }
  };

  return (
    <main className={styles.register}>
      <h1>Login</h1>
      <p>Please choose a way to login an account.</p>
      {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
      <div className={styles["register-box"]}>
        <div className={styles.esquerdo}>
          <h2>Login from an external platform</h2>
          <button onClick={handleGoogleLogin} className={styles.googlebtn}>
            <Image src="/google.png" alt="Google Logo" width={50} height={50} />
            Login with Google
          </button>
        </div>
        <div className={styles.central}></div>
        <div className={styles.direito}>
          <h2>Login with Email and Password</h2>

          <form className={styles.form} onSubmit={handleLogin}>
            <label htmlFor="email">
              Email:
              <input
                type="email"
                id="email"
                required
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>
            <label htmlFor="password">
              Password:
              <input
                type="password"
                id="password"
                required
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>
            <button type="submit">Login</button>
          </form>
        </div>
      </div>
    </main>
  );
};

export default Login;
