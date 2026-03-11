import { db } from "@/app/Components/Firebase";
import { collection, getDocs, getDoc, doc, query, orderBy } from "firebase/firestore";
import { format, formatDistanceToNow } from 'date-fns';
import { pt } from 'date-fns/locale';


// Interface para saberes exatamente o que um Post contém
export interface Post {
  id: string;      // Nome do documento
  author: string;  // ID do autor
  conteudo: string;
  date: any;       // Timestamp do Firebase
  img: string;     // URL da imagem
  title: string;
}

// Fetches a single post by its document ID
export const getPostById = async (id: string): Promise<Post | null> => {
  try {
    // Create a reference to the specific document in the "posts" collection
    const docRef = doc(db, "posts", id);
    // Retrieve the document snapshot
    const docSnap = await getDoc(docRef);

    // Check if the document exists
    if (docSnap.exists()) {
      // Map the document data to a Post object and return it
      return {
        id: docSnap.id,
        author: docSnap.data().author,
        conteudo: docSnap.data().conteudo,
        date: docSnap.data().date,
        img: docSnap.data().img,
        title: docSnap.data().title,
      } as Post;
    }

    // Return null if the document doesn't exist
    return null;
  } catch (e) {
    // Log any errors that occur during the fetch
    console.error("Erro ao buscar post por ID: ", e);
    return null;
  }
};


export const getAllPosts = async (): Promise<Post[]> => {
  try {
    const postsRef = collection(db, "posts");
    // Ordenamos pelo campo 'date' que escolheste
    const q = query(postsRef, orderBy("date", "desc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,               // O ID é o nome do documento
      author: doc.data().author,
      conteudo: doc.data().conteudo,
      date: doc.data().date,
      img: doc.data().img,
      title: doc.data().title,
    })) as Post[];
  } catch (e) {
    console.error("Erro ao buscar posts: ", e);
    return [];
  }
};

export const formatDate = (dateInput: any) => {
  if (!dateInput) return "";

  // Converte o Timestamp do Firebase para um objeto Date do JS
  const date = dateInput.toDate ? dateInput.toDate() : new Date(dateInput);

  // Se o post foi há menos de 7 dias, mostra "há X dias"
  // Se foi há mais tempo, mostra a data fixa "14 de Mar"
  const diffInDays = (new Date().getTime() - date.getTime()) / (1000 * 3600 * 24);

  if (diffInDays < 7) {
    return formatDistanceToNow(date, { addSuffix: true, locale: pt });
  }

  return format(date, "d 'de' MMM", { locale: pt });
};
