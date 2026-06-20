import { db } from "@/app/Components/Firebase";
import { 
    collection, addDoc, getDocs, doc, updateDoc, 
    query, orderBy, arrayUnion, arrayRemove, getDoc, serverTimestamp 
} from "firebase/firestore";

export interface Comment {
    id: string;
    text: string;
    authorId: string;
    createdAt: any;
    likedBy: string[]; 
    parentId: string | null; 
    replyingToUsername?: string | null; 
    replyingToSnippet?: string | null; // NOVO: O "Sneakpeak" do comentário
    
    authorName?: string;
    authorPfp?: string;
}

export const getCommentsForPost = async (postId: string): Promise<Comment[]> => {
    try {
        const commentsRef = collection(db, `posts/${postId}/comments`);
        const q = query(commentsRef, orderBy("createdAt", "asc"));
        const snapshot = await getDocs(q);

        const comments: Comment[] = [];
        const userCache = new Map<string, any>();

        for (const document of snapshot.docs) {
            const data = document.data();
            let authorName = "Utilizador Desconhecido";
            let authorPfp = "/default-avatar.png"; 

            if (data.authorId) {
                if (userCache.has(data.authorId)) {
                    const cachedUser = userCache.get(data.authorId);
                    authorName = cachedUser.username;
                    authorPfp = cachedUser.pfp;
                } else {
                    const userSnap = await getDoc(doc(db, "users", data.authorId));
                    if (userSnap.exists()) {
                        const userData = userSnap.data();
                        authorName = userData.username || authorName;
                        authorPfp = userData.pfp || authorPfp;
                        userCache.set(data.authorId, userData); 
                    }
                }
            }

            comments.push({
                id: document.id,
                text: data.text,
                authorId: data.authorId,
                createdAt: data.createdAt,
                likedBy: data.likedBy || [],
                parentId: data.parentId || null,
                replyingToUsername: data.replyingToUsername || null,
                replyingToSnippet: data.replyingToSnippet || null,
                authorName,
                authorPfp
            });
        }
        return comments;
    } catch (error) {
        console.error("Erro ao buscar comentários: ", error);
        return [];
    }
};

export const addComment = async (
    postId: string, 
    userId: string, 
    text: string, 
    parentId: string | null = null,
    replyingToUsername: string | null = null,
    replyingToSnippet: string | null = null // NOVO CAMPO AQUI
) => {
    try {
        const commentsRef = collection(db, `posts/${postId}/comments`);
        const newComment = {
            text,
            authorId: userId,
            createdAt: serverTimestamp(),
            likedBy: [],
            parentId,
            replyingToUsername,
            replyingToSnippet
        };
        const docRef = await addDoc(commentsRef, newComment);
        return docRef.id;
    } catch (error) {
        console.error("Erro ao adicionar comentário: ", error);
        throw error;
    }
};

export const toggleCommentLike = async (postId: string, commentId: string, userId: string, isLiking: boolean) => {
    try {
        const commentRef = doc(db, `posts/${postId}/comments/${commentId}`);
        if (isLiking) {
            await updateDoc(commentRef, { likedBy: arrayUnion(userId) });
        } else {
            await updateDoc(commentRef, { likedBy: arrayRemove(userId) });
        }
    } catch (error) {
        console.error("Erro ao dar toggle no like: ", error);
        throw error;
    }
};