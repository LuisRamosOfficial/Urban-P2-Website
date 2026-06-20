"use client";
import Image from "next/image";
import styles from "./styles.module.scss";
import { useState } from "react";
import ImageCropper from "./ImageCropper";
import React from "react";

// Imports do Firebase necessários para criar um documento novo
import { db, storage } from "@/app/Components/Firebase";
import { collection, doc, setDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadString, getDownloadURL } from "firebase/storage";

const CreatePost = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState<string | null>(null);
    const [ModelShow, setModelShow] = useState(false);
    
    // Status do upload
    const [saveStatus, setSaveStatus] = useState<"none" | "saving" | "success" | "error">("none");

    const handlePublish = async () => {
        // Validação básica
        if (!title || !description || !image) {
            alert("Por favor, preenche o título, descrição e escolhe uma imagem!");
            return;
        }

        try {
            setSaveStatus("saving");
            
            // 1. Prepara uma referência para o NOVO documento. 
            // Isto gera um ID único do Firebase antes de o guardarmos.
            const newPostRef = doc(collection(db, "posts"));
            
            // 2. Faz o upload da imagem para o Storage usando esse novo ID
            const storageRef = ref(storage, `posts/${newPostRef.id}`);
            await uploadString(storageRef, image, 'data_url');
            const downloadURL = await getDownloadURL(storageRef);

            // 3. Guarda todos os dados de uma vez no Firestore
            await setDoc(newPostRef, {
                title: title,
                conteudo: description,
                img: downloadURL,
                date: serverTimestamp(), // Regista a data exata da criação
                author: "Urban P2" // Aqui podes pôr o uid do user logado se preferires
            });

            setSaveStatus("success");

            // Limpa o formulário e a mensagem após 3 segundos
            setTimeout(() => {
                setTitle("");
                setDescription("");
                setImage(null);
                setSaveStatus("none");
            }, 3000);

        } catch (error) {
            console.error("Erro ao criar post: ", error);
            setSaveStatus("error");
        }
    };

    return (
        <div className={styles.mainframe}>
            
            {/* Mensagens de Feedback */}
            {saveStatus === "error" && (
                <div className={`${styles.message} ${styles.red}`}>Erro ao publicar o post!</div>
            )}
            {saveStatus === "success" && (
                <div className={`${styles.message} ${styles.green}`}>Post publicado com sucesso!</div>
            )}

            {ModelShow && <ProfileModel setImageShow={setImage} setModel={setModelShow} image={image} />}
            
            <h1>Create New Post</h1>
            
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
                    <button className={styles.uploadButton} onClick={() => document.getElementById("fileInput")?.click()}>Choose Image</button>
                    
                    <input type="file" accept="image/*" id="fileInput" style={{ display: "none" }} onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                            const reader = new FileReader();
                            reader.addEventListener("load", () => {
                                const imageUrl = reader.result as string;
                                setImage(imageUrl);
                                setModelShow(true); // Abre o Cropper
                            });
                            reader.readAsDataURL(file);
                        }
                    }} />
                </span>
                
                <span className={styles.postDescription}>
                    <h2>Description: </h2>
                    <textarea className={styles.TextArea} value={description} placeholder="Description" onChange={(e) => setDescription(e.target.value)} />
                </span>

                <button 
                    className={styles.saveActionBtn} 
                    onClick={handlePublish}
                    disabled={saveStatus === "saving"}
                >
                    {saveStatus === "saving" ? "A publicar..." : "Publicar Post"}
                </button>
            </div>
        </div>
    );
}

// O model agora não precisa da prop 'post' porque o post ainda não existe
const ProfileModel = ({ setModel, setImageShow, image }: { setModel: React.Dispatch<React.SetStateAction<boolean>>,setImageShow: React.Dispatch<React.SetStateAction<string | null>>, image: string | null }) => {
    return (
        <div onClick={() => setModel(false)} className={styles.profileModel }>
            <div onClick={(e) => e.stopPropagation()} className={styles.Content}>
                {image && <ImageCropper setImageShow={setImageShow} setModelShow={setModel} img={image} />}
            </div>
        </div>
    );
}

export default CreatePost;