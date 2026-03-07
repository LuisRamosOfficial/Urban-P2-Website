"use client";
import { useAuth } from "./AuthHandler";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
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

export function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, isAdmin, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Só redireciona se o carregamento terminar E (não houver user OU não for admin)
    if (!loading) {
      if (!user || !isAdmin) {
        router.push("/"); // Expulsa para a Home
      }
    }
  }, [user, isAdmin, loading, router]);

  // Enquanto verifica ou se não tiver permissão, não renderiza nada
  if (loading || !user || !isAdmin) {
    return null; 
  }

  return <>{children}</>;
}

export function GuestRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Se o carregamento terminou e JÁ existe um utilizador logado
    if (!loading && user) {
      router.push("/manage"); // Redireciona para a Home (ou para /manage)
    }
  }, [user, loading, router]);

  // Se estiver a carregar ou se já houver user (enquanto o router.push não atua), não mostra nada
  if (loading || user) {
    return null; 
  }

  // Só renderiza os filhos (Login/Register) se NÃO houver utilizador
  return <>{children}</>;
}