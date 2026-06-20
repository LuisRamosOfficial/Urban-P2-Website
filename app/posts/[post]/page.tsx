'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import styles from './post.module.scss';
import CommentsSection from './CommentsSection';
// Importamos a Autenticação do Firebase
import { auth } from '@/app/Components/Firebase';
import { onAuthStateChanged } from 'firebase/auth';

import { getPostById, formatDate, likePost, unlikePost } from '@/app/Components/Services/postServices';
import type { Post as PostType } from '@/app/Components/Services/postServices';

const PostPage = () => {
    const params = useParams();
    const postId = params.post as string; 
    
    const [post, setPost] = useState<PostType | null>(null);
    const [loading, setLoading] = useState(true);
    
    // Estados do Auth e Mensagens
    const [user, setUser] = useState<any>(null);
    const [authMessage, setAuthMessage] = useState(false);

    // Estados para os botões de ação
    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0); 

    // Efeito para verificar quem está logado
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        return () => unsubscribe(); // Limpa o "espião" quando sais da página
    }, []);

    useEffect(() => {
        if (postId) {
            getPostById(postId).then((data) => {
                if (data) {
                    setPost(data);
                    setLikeCount(data.likes || 0);
                    
                    const hasLikedLocally = localStorage.getItem(`liked_post_${postId}`);
                    if (hasLikedLocally === 'true') {
                        setLiked(true);
                    }
                }
                setLoading(false);
            });
        }
    }, [postId]);

    const handleShare = async () => {
        const url = window.location.href;
        if (navigator.share) {
            try {
                await navigator.share({
                    title: post?.title,
                    text: 'Lê este post no Urban P2!',
                    url: url,
                });
            } catch (error) {
                console.log('Partilha cancelada', error);
            }
        } else {
            navigator.clipboard.writeText(url);
            alert('Link copiado para a área de transferência! 🔗');
        }
    };

    const handleLike = async () => {
        if (!postId) return;

        // VERIFICAÇÃO DE LOGIN
        if (!user) {
            setAuthMessage(true);
            // Esconde a mensagem após 3 segundos
            setTimeout(() => {
                setAuthMessage(false);
            }, 7000);
            return; // Impede que o código de like abaixo seja executado
        }

        if (liked) {
            setLiked(false);
            setLikeCount((prev) => prev - 1);
            localStorage.setItem(`liked_post_${postId}`, 'false');
            await unlikePost(postId);
        } else {
            setLiked(true);
            setLikeCount((prev) => prev + 1);
            localStorage.setItem(`liked_post_${postId}`, 'true');
            await likePost(postId);
        }
    };

    if (loading) return <div className={styles.loadingMessage}>A carregar o post...</div>;
    if (!post) return <div className={styles.errorMessage}>Post não encontrado. 😢</div>;

    return (
        <main className={styles.postContainer}>
            
            {/* MENSAGEM FLUTUANTE DE ERRO */}
            {authMessage && (
                <div className={`${styles.message} ${styles.red}`}>
                    Tens de ter sessão iniciada para dar gosto!
                </div>
            )}

            <article>
                <header className={styles.postHeader}>
                    <h1>{post.title}</h1>
                    <div className={styles.meta}>
                        <span className={styles.author}>Por {post.author || "Urban P2"}</span>
                        <span className={styles.dot}>•</span>
                        <span className={styles.date}>{formatDate(post.date)}</span>
                    </div>
                </header>

                {post.img && (
                    <div className={styles.imageWrapper}>
                        <Image src={post.img} alt={`Capa do post ${post.title}`} fill priority />
                    </div>
                )}

                <div className={styles.content}>
                    {post.conteudo.split('\n').map((paragraph, index) => (
                        <p key={index}>{paragraph}</p>
                    ))}
                </div>
            </article>

            <div className={styles.actionsBox}>
                <button 
                    onClick={handleLike} 
                    className={`${styles.actionBtn} ${liked ? styles.likedBtn : ''}`}
                >
                    {liked ? '❤️' : '🤍'} {likeCount > 0 ? likeCount : 'Gosto'}
                </button>
                
                <button onClick={handleShare} className={styles.actionBtn}>
                    <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path></svg>
                    Partilhar
                </button>
            </div>
            <CommentsSection postId={postId} user={user} />
        </main>
    );
};

export default PostPage;