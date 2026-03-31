"use client";
import styles from "./styles.module.scss";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {getPostById } from "@/app/Components/Services/postServices";
import type { Post as PostType } from "@/app/Components/Services/postServices";
import { set } from "date-fns";


const Post = () => {
    const params = useParams();
    const [post, setPost] = useState<PostType | null>(null);
    let titleInputRef: HTMLInputElement | null = null;



     useEffect(() => {
        
        if (params.post && typeof params.post === "string") {
            getPostById(params.post).then((data) => {
                if (data) {
                  console.log("Post encontrado: ", data);
                    setPost(data);
                    setTitle(data.title);
                } else {
                    console.error("Post não encontrado");
                }
            });

        }

    }, [params.post]);


    const [title, setTitle] = useState(post?.title || "");

  return (<div className={styles.mainframe}>
            <h1>Manage Post</h1>
            <div className={styles.postDetails}>
                <span className={styles.postTitle}>
                <h2>Title: </h2>
                <input className={styles.TextInput} type="text" value={title} placeholder="Title" onChange={(e) => setTitle(e.target.value)} />
                </span>
                <span className={styles.postImage}>
                <h2>Cover Image: </h2>
                {post?.img ? (
                    <img src={post.img} alt="Post Image" className={styles.postImagePreview} />
                ) : (
                    <p>No image available</p>
                )}
                </span>
            </div>
        </div>);
}


export default Post;