'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import styles from './comments.module.scss';
import { getCommentsForPost, addComment, toggleCommentLike, Comment } from '@/app/Components/Services/commentServices';

interface CommentsSectionProps {
    postId: string;
    user: any; // O utilizador logado passado da page.tsx
}

export default function CommentsSection({ postId, user }: CommentsSectionProps) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState("");
    const [replyingTo, setReplyingTo] = useState<Comment | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadComments();
    }, [postId]);

    const loadComments = async () => {
        const fetchedComments = await getCommentsForPost(postId);
        setComments(fetchedComments);
        setLoading(false);
    };

    const handleSendComment = async () => {
        if (!newComment.trim() || !user) return;

        // Lógica do SneakPeak (corta aos 15 caracteres + "...")
        let snippet = null;
        let parentId = null;
        let username = null;

        if (replyingTo) {
            // Se estamos a responder a uma Resposta, o parentId continua a ser o do Comentário Principal
            parentId = replyingTo.parentId ? replyingTo.parentId : replyingTo.id;
            username = replyingTo.authorName || "Utilizador";
            snippet = replyingTo.text.length > 15 
                ? replyingTo.text.substring(0, 15) + "..." 
                : replyingTo.text;
        }

        try {
            await addComment(postId, user.uid, newComment, parentId, username, snippet);
            setNewComment("");
            setReplyingTo(null);
            loadComments(); // Recarrega para mostrar o novo
        } catch (error) {
            alert("Erro ao enviar comentário.");
        }
    };

    const handleLike = async (commentId: string, isCurrentlyLiked: boolean) => {
        if (!user) return alert("Faz login para dar like!");
        
        // Optimistic UI update (Muda visualmente logo antes do Firebase)
        setComments(comments.map(c => {
            if (c.id === commentId) {
                const newLikedBy = isCurrentlyLiked 
                    ? c.likedBy.filter(uid => uid !== user.uid)
                    : [...c.likedBy, user.uid];
                return { ...c, likedBy: newLikedBy };
            }
            return c;
        }));

        await toggleCommentLike(postId, commentId, user.uid, !isCurrentlyLiked);
    };

    // Filtra e organiza os comentários (Principais vs Respostas)
    const mainComments = comments.filter(c => !c.parentId);
    const replies = comments.filter(c => c.parentId);

    return (
        <section className={styles.commentsSection}>
            <h3>Comentários ({comments.length})</h3>

            {/* Input para Comentar */}
            <div className={styles.commentInputBox}>
                {!user ? (
                    <p className={styles.loginAviso}>Inicia sessão para participares na conversa.</p>
                ) : (
                    <>
                        {replyingTo && (
                            <div className={styles.replyingToBanner}>
                                A responder a <strong>@{replyingTo.authorName}</strong> 
                                <span> ({replyingTo.text.substring(0, 20)}...)</span>
                                <button onClick={() => setReplyingTo(null)}>✕</button>
                            </div>
                        )}
                        <div className={styles.inputFlex}>
                            <textarea 
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Escreve a tua opinião..."
                                rows={2}
                            />
                            <button onClick={handleSendComment} disabled={!newComment.trim()}>
                                Enviar
                            </button>
                        </div>
                    </>
                )}
            </div>

            {/* Lista de Comentários */}
            {loading ? <p>A carregar comentários...</p> : (
                <div className={styles.commentsList}>
                    {mainComments.map(mainComment => (
                        <div key={mainComment.id} className={styles.commentThread}>
                            {/* Comentário Principal */}
                            <CommentCard 
                                comment={mainComment} 
                                user={user} 
                                onLike={handleLike} 
                                onReply={() => setReplyingTo(mainComment)} 
                            />

                            {/* Respostas Aninhadas (Debaixo do Principal) */}
                            <div className={styles.repliesContainer}>
                                {replies
                                    .filter(reply => reply.parentId === mainComment.id)
                                    .map(reply => (
                                        <CommentCard 
                                            key={reply.id} 
                                            comment={reply} 
                                            user={user} 
                                            onLike={handleLike} 
                                            onReply={() => setReplyingTo(reply)} 
                                            isReply 
                                        />
                                    ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}

// Sub-Componente Visual de um único Cartão de Comentário
const CommentCard = ({ comment, user, onLike, onReply, isReply = false }: any) => {
    const hasLiked = user && comment.likedBy.includes(user.uid);

    return (
        <div className={`${styles.commentCard} ${isReply ? styles.isReply : ''}`}>
            <Image src={comment.authorPfp || '/default-avatar.png'} alt="PFP" width={40} height={40} className={styles.pfp} />
            
            <div className={styles.commentContent}>
                <div className={styles.commentHeader}>
                    <span className={styles.author}>{comment.authorName}</span>
                    {/* A MAGIA ACONTECE AQUI: Em resposta a @Nome em "Sneakpeak" */}
                    {isReply && comment.replyingToUsername && (
                        <span className={styles.replyingToText}>
                            (em resposta a @{comment.replyingToUsername} em <i>"{comment.replyingToSnippet}"</i>)
                        </span>
                    )}
                </div>
                
                <p className={styles.text}>{comment.text}</p>
                
                <div className={styles.commentActions}>
                    <button onClick={() => onLike(comment.id, hasLiked)} className={hasLiked ? styles.liked : ''}>
                        {hasLiked ? '❤️' : '🤍'} {comment.likedBy.length}
                    </button>
                    {user && <button onClick={onReply}>Responder</button>}
                </div>
            </div>
        </div>
    );
};