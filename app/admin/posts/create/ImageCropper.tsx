'use client';
import React, { useState } from 'react';
import ReactCrop, { makeAspectCrop, Crop } from 'react-image-crop'
import 'react-image-crop/src/ReactCrop.scss'
import styles from "./styles.module.scss";

interface ImageCropperProps {
    img: string;
    setModelShow: (show: boolean) => void;
    setImageShow: (show: string) => void; 
}

const ImageCropper = ({ img, setModelShow, setImageShow }: ImageCropperProps) => {
    const [crop, setCrop] = useState<Crop | undefined>();
    const [image, setImage] = useState<string>(img);

    const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
        const Newcrop = makeAspectCrop({
            unit: '%',
            width: 100,
        }, 1, e.currentTarget.naturalWidth , e.currentTarget.naturalHeight);
        setCrop(Newcrop);
    }

    const saveImage = () => {
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
                    crop.x * scaleX, crop.y * scaleY, crop.width * scaleX, crop.height * scaleY,
                    0, 0, crop.width * scaleX, crop.height * scaleY
                );
                
                const dataUrl = ctx.toDataURL('image/jpeg');
                
                // Em vez de enviar para o Firebase, apenas enviamos a imagem 
                // cortada de volta para a página principal (page.tsx)
                setImageShow(dataUrl);
                setModelShow(false); // Fecha o Pop-up
            }
        }
    };

    return (
        <>
        {img && <div className={styles.ImgCropper}>
            <h2>Crop your image</h2>
            <ReactCrop className={styles.parent} crop={crop} circularCrop keepSelection aspect={1} minWidth={150} onChange={(newCrop) => setCrop(newCrop)}>
                <img 
                    style={{ width: '100%', height: '100%', maxHeight: '60vh', borderRadius: '10%' }} 
                    alt="Crop me" 
                    id='imagecrop' 
                    src={image} 
                    onLoad={onImageLoad}
                    crossOrigin="anonymous" 
                />
            </ReactCrop>

            <button onClick={saveImage} className={styles.saveButton}>
                Save Crop
            </button>
        </div>}
        </>
    );
}

export default ImageCropper;