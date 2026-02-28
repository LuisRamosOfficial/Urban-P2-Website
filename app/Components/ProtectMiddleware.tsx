"use client";
import { useAuth } from "./AuthHandler";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Se terminou de carregar e não há user, manda para o login
    if (!loading && !user) {
      router.push("/login"); 
    }
  }, [user, loading, router]);

  // Enquanto verifica o estado, não mostra nada (ou um spinner)
  if (loading || !user) {
    return null; // Ou um ecrã de "A carregar..."
  }

  return <>{children}</>;
}