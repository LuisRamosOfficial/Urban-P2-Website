"use client";
import styles from "./styles.module.scss";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {getPostById } from "@/app/Components/Services/postServices";
import type { Post as PostType } from "@/app/Components/Services/postServices";


const Post = () => {
    const params = useParams();
    const [post, setPost] = useState<PostType | null>(null);

     useEffect(() => {
        // Aqui você pode implementar a lógica para buscar os dados do post usando o ID da URL
        // Por exemplo, você pode usar o ID para fazer uma chamada de API e obter os detalhes do post

        if (params.post && typeof params.post === "string") {
            getPostById(params.post).then((data) => {
                if (data) {
                  console.log("Post encontrado: ", data);
                    setPost(data);
                } else {
                    console.error("Post não encontrado");
                }
            });
        }

    }, [params.post]);
  return (<div className={styles.mainframe}></div>);
}


export default Post;