"use client";
import styles from "./page.module.scss";
import Image from "next/image";
import { auth, db } from "@/app/Components/Firebase"; // Importa as instâncias do teu ficheiro de configuração
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
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

const Register = () => {
  // Estados para capturar os inputs
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    // Validação do Username
    if (username.length < 3) {
      setError("O username deve ter pelo menos 3 caracteres.");
      return;
    }

    // Validação do Email
    if (!validateEmail(email)) {
      setError("Por favor, introduz um email válido.");
      return;
    }

    // Validação da Password
    if (!validatePassword(password)) {
      setError(
        "A password deve ter pelo menos 6 caracteres, incluindo uma letra e um número.",
      );
      return;
    }

    try {
      // 1. Criar utilizador no Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const user = userCredential.user;

      // 2. Criar documento do utilizador no Firestore
      // Guardamos o 'role' como 'reader' por padrão para segurança
      await setDoc(doc(db, "users", user.uid), {
        username: username,
        email: email,
        role: "reader",
        createdAt: new Date(),
      });

      // 3. Redirecionar para a Home após sucesso
      router.push("/");
    } catch (err: any) {
      // Tratamento básico de erros (ex: email já em uso)
      setError("Erro ao criar conta: " + err.message);
    }
  };

  return (
    <main className={styles.register}>
      <h1>Register</h1>
      <p>Please choose a way to register an account.</p>
      {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
      <div className={styles["register-box"]}>
        <div className={styles.esquerdo}>
          <h2>Register from an external platform</h2>
          <button className={styles.googlebtn}>
            <Image src="/google.png" alt="Google Logo" width={50} height={50} />
            Register with Google
          </button>
        </div>
        <div className={styles.central}></div>
        <div className={styles.direito}>
          <h2>Register with Email and Password</h2>

          <form className={styles.form} onSubmit={handleRegister}>
            <label htmlFor="username">
              Username:
              <input
                type="text"
                id="username"
                required
                onChange={(e) => setUsername(e.target.value)}
              />
            </label>
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
            <button type="submit">Register</button>
          </form>
        </div>
      </div>
    </main>
  );
};

export default Register;
