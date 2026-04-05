"use client";
import Image from "next/image";
import styles from "./styles.module.scss";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {getPostById } from "@/app/Components/Services/postServices";
import type { Post as PostType } from "@/app/Components/Services/postServices";
import ImageCropper from "./ImageCropper";
import React from "react";


const Post = () => {
    const params = useParams();
    const [post, setPost] = useState<PostType | null>(null);
    const [title, setTitle] = useState(post?.title || "");
    const [image, setImage] = useState<string | null>(null);
    const [ModelShow, setModelShow] = useState(false);


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



  return (<div className={styles.mainframe}>
            {ModelShow && <ProfileModel setModel={setModelShow} post={post} image={image} />}
            <h1>Manage Post</h1>
            <div className={styles.postDetails}>
                <span className={styles.postTitle}>
                <h2>Title: </h2>
                <input className={styles.TextInput} type="text" value={title} placeholder="Title" onChange={(e) => setTitle(e.target.value)} />
                </span>
                <span className={styles.postImage}>
                <h2>Cover Image: </h2>
                {post?.img ? (
                    <span className={styles.postImageContainer}>
                        <Image src={post.img} alt="Post Image" onClick={() => document.getElementById("fileInput")?.click()} className={styles.postImagePreview} fill={true} />
                    </span>
                ) : (
                    <p>No image available</p>
                )}
                <button className={styles.uploadButton} onClick={() => document.getElementById("fileInput")?.click()}>Upload Image</button>
                <input type="file" accept="image/*" id="fileInput"  style={{ display: "none" }} onChange={(e) => {
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
            </div>
        </div>);
}


const ProfileModel = ({ setModel, post, image }: { setModel: React.Dispatch<React.SetStateAction<boolean>>, post: PostType | null, image: string | null }) => {

    

    return (<div onClick={() => setModel(false)} className={styles.profileModel }>
        <div onClick={(e) => e.stopPropagation()} className={styles.Content}>
            {image && <ImageCropper img={image} post={post} />}
        </div>
    </div>);
}

export default Post;
