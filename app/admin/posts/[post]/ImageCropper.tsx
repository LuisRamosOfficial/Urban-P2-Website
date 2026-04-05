'use client';
import React, { useState } from 'react';
import ReactCrop, { makeAspectCrop, Crop } from 'react-image-crop'
import 'react-image-crop/src/ReactCrop.scss'
import styles from "./styles.module.scss";
import { PostType } from '@/types';
import { storage, db } from '@/app/Components/Firebase';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';
import { doc, updateDoc } from 'firebase/firestore';

interface ImageCropperProps {
    img: string;
    post: PostType | null;
}
const ImageCropper = ({ img, post }: ImageCropperProps) => {
    const [crop, setCrop] = useState<Crop | undefined>();
    const [image, setImage] = useState<string>(img);
    const [croppedImage, setCroppedImage] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);


    const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
        const Newcrop = makeAspectCrop({
            unit: '%',
            width: 100,
        }, 1, e.currentTarget.naturalWidth , e.currentTarget.naturalHeight);
        setCrop(Newcrop);
    }

    const saveImage = async () => {
        const canvas = document.getElementById('imagecrop') as HTMLImageElement;
        if (canvas && crop?.width && crop?.height) {
            const scaleX = canvas.naturalWidth / canvas.width;
            const scaleY = canvas.naturalHeight / canvas.height;
            const ctx = document.createElement('canvas');
            ctx.width = crop.width * scaleX;
            ctx.height = crop.height * scaleY;
            const context = ctx.getContext('2d');
            if (context) {
                context.drawImage(
                    canvas,
                    crop.x * scaleX,
                    crop.y * scaleY,
                    crop.width * scaleX,
                    crop.height * scaleY,
                    0,
                    0,
                    crop.width * scaleX,
                    crop.height * scaleY
                );
                const dataUrl = ctx.toDataURL('image/jpeg');
                setCroppedImage(dataUrl);

                if (post?.id) {
                    setUploading(true);
                    try {
                        const storageRef = ref(storage, `posts/${post.id}`);
                        
                        await uploadString(storageRef, dataUrl, 'data_url');
                        console.log("Image uploaded successfully");
                        const downloadURL = await getDownloadURL(storageRef);
                        await updateDoc(doc(db, 'posts', post.id), { img: downloadURL });
                        console.log("Firestore updated successfully");
                        setImage(downloadURL);
                    } finally {
                        setUploading(false);
                    }
                }


            }
        }
    };
    return (
        <>
        {img && <div className={styles.ImgCropper}>
            <h2>Crop your image</h2>
            <ReactCrop className={styles.parent} crop={crop} circularCrop keepSelection aspect={1} minWidth={150} onChange={(newCrop) => setCrop(newCrop)}>

                <img style={{ width: '100%', height: '100%', maxHeight: '60vh', borderRadius: '10%' }} alt="Crop me" id='imagecrop' src={image} onLoad={onImageLoad}/>
            </ReactCrop>

            <button onClick={() => saveImage()} className={styles.saveButton} disabled={uploading}>
                {uploading ? 'Uploading...' : 'Save'}
            </button>

        </div>}
        </>
    );
}


export default ImageCropper;