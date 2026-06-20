"use client";
import Image from "next/image";
import styles from "./styles.module.scss";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getPostById } from "@/app/Components/Services/postServices";
import type { Post as PostType } from "@/app/Components/Services/postServices";
import ImageCropper from "./ImageCropper";
import React from "react";

// Adicionamos os imports do Firebase para o botão Guardar funcionar
import { db } from "@/app/Components/Firebase";
import { doc, updateDoc } from "firebase/firestore";

const Post = () => {
    const params = useParams();
    const [post, setPost] = useState<PostType | null>(null);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState<string | null>(null);
    const [ModelShow, setModelShow] = useState(false);
    
    // Novo estado para controlar as mensagens
    const [saveStatus, setSaveStatus] = useState<"none" | "unsaved" | "saving" | "success">("none");

    useEffect(() => {
        if (params.post && typeof params.post === "string") {
            getPostById(params.post).then((data) => {
                if (data) {
                    console.log("Post encontrado: ", data);
                    setPost(data);
                    setTitle(data.title);
                    setDescription(data.conteudo);
                    setImage(data.img || null);
                } else {
                    console.error("Post não encontrado");
                }
            });
        }
    }, [params.post]);

    // Este useEffect "espia" as mudanças. Se o título ou descrição atuais 
    // forem diferentes dos originais, mostra a mensagem vermelha.
    useEffect(() => {
        if (post) {
            if (title !== post.title || description !== post.conteudo) {
                setSaveStatus("unsaved");
            } else if (saveStatus === "unsaved") {
                // Se o user voltar a colocar o texto original, a mensagem desaparece
                setSaveStatus("none");
            }
        }
    }, [title, description, post]);

    // Função para guardar no Firebase
    const handleSave = async () => {
        if (!post?.id) return;

        try {
            setSaveStatus("saving");
            
            const postRef = doc(db, "posts", post.id);
            await updateDoc(postRef, {
                title: title,
                conteudo: description
            });

            // Atualizamos o estado "post" com os novos dados para reiniciar a deteção de mudanças
            setPost({ ...post, title: title, conteudo: description });
            
            setSaveStatus("success");

            // Esconde a mensagem de sucesso (verde) após 3 segundos
            setTimeout(() => {
                setSaveStatus("none");
            }, 3000);

        } catch (error) {
            console.error("Erro ao atualizar post: ", error);
            alert("Erro ao guardar alterações!");
            setSaveStatus("unsaved");
        }
    };

    return (
        <div className={styles.mainframe}>
            
            {/* Renderização Condicional das Mensagens */}
            {saveStatus === "unsaved" && (
                <div className={`${styles.message} ${styles.red}`}>Alterações não guardadas!</div>
            )}
            {saveStatus === "success" && (
                <div className={`${styles.message} ${styles.green}`}>Alterações guardadas com sucesso!</div>
            )}

            {ModelShow && <ProfileModel setImageShow={setImage} setModel={setModelShow} post={post} image={image} />}
            <h1>Manage Post</h1>
            
            <div className={styles.postDetails}>
                <span className={styles.postTitle}>
                    <h2>Title: </h2>
                    <input className={styles.TextInput} type="text" value={title} placeholder="Title" onChange={(e) => setTitle(e.target.value)} />
                </span>
                
                <span className={styles.postImage}>
                    <h2>Cover Image: </h2>
                    {image ? (
                        <span className={styles.postImageContainer}>
                            <Image src={image} alt="Post Image" onClick={() => document.getElementById("fileInput")?.click()} className={styles.postImagePreview} fill={true} />
                        </span>
                    ) : (
                        <p>No image available</p>
                    )}
                    <button className={styles.uploadButton} onClick={() => document.getElementById("fileInput")?.click()}>Upload Image</button>
                    <input type="file" accept="image/*" id="fileInput" style={{ display: "none" }} onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                            const reader = new FileReader();
                            reader.addEventListener("load", () => {
                                const imageUrl = reader.result as string;
                                setImage(imageUrl);
                                console.log("Selected file: " + imageUrl);
                                setModelShow(true);
                            });
                            reader.readAsDataURL(file);
                        }
                    }} />
                </span>
                
                <span className={styles.postDescription}>
                    <h2>Description: </h2>
                    <textarea className={styles.TextArea} value={description} placeholder="Description" onChange={(e) => setDescription(e.target.value)} />
                </span>

                {/* Novo Botão de Guardar */}
                <button 
                    className={styles.saveActionBtn} 
                    onClick={handleSave}
                    disabled={saveStatus !== "unsaved"} // Só permite clicar se houver alterações
                >
                    {saveStatus === "saving" ? "A guardar..." : "Guardar Alterações"}
                </button>
            </div>
        </div>
    );
}

const ProfileModel = ({ setModel, setImageShow, post, image }: { setModel: React.Dispatch<React.SetStateAction<boolean>>,setImageShow: React.Dispatch<React.SetStateAction<string | null>>, post: PostType | null, image: string | null }) => {
    return (
        <div onClick={() => setModel(false)} className={styles.profileModel }>
            <div onClick={(e) => e.stopPropagation()} className={styles.Content}>
                {image && <ImageCropper setImageShow={setImageShow} setModelShow={setModel} img={image} post={post} />}
            </div>
        </div>
    );
}

export default Post;