"use client";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { updatePfp } from "../Services/userServices";

interface Props {
  userId: string;
  currentPfp: string;
  styles: any; // Passamos os estilos para manter as classes iguais
}

export const AvatarSection = ({ userId, currentPfp, styles }: Props) => {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [displayPfp, setDisplayPfp] = useState(currentPfp);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const newUrl = await updatePfp(userId, file);
      setDisplayPfp(newUrl);
      alert("Foto atualizada!");
    } catch (error) {
      alert("Erro ao carregar imagem.");
    } finally {
      setUploading(false);
    }
  };

useEffect(() => {
    // Sempre que o pai atualizar o dado do Firestore, atualizamos a imagem aqui
    if (currentPfp) {
      setDisplayPfp(currentPfp);
    }
  }, [currentPfp]);

  
  return (
    <div className={styles.esquerdo}>
      <h2>Profile Picture:</h2>
      <input 
        type="file" 
        hidden 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="image/*"
      />
      <span>
        <Image 
        key={displayPfp} // Força o componente a remontar se o URL mudar
          src={displayPfp && displayPfp !== "default" ? displayPfp : "/profile.png"} 
          alt="Profile Picture" 
          fill={true} 
          priority // Carrega com prioridade máxima
          style={{ objectFit: "cover", borderRadius: "50%" }}
        />
      </span>
      <button onClick={() => fileInputRef.current?.click()} disabled={uploading}>
        {uploading ? "Updating..." : "Change Picture"}
      </button>
    </div>
  );
};