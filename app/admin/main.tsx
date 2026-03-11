import { useEffect, useState } from "react";
import { capitalizeFirstLetter } from "../Components/functions";
import styles from "./admin.module.scss";
import { getAllPosts, Post } from "../Components/Services/postServices";
import Image from "next/image";
import { useRouter } from "next/navigation";


interface Props {
  // Record<string, string> diz que é um objeto com chaves e valores de texto
  styles: Record<string, string>; 
  state: string;
  setState: (valor: string) => void;
}

const Main = ({styles, state, setState}: Props) => {
 

    return <section className={styles.main}>
        <h1>{capitalizeFirstLetter(state)}</h1>
        {state === "posts" && <Posts />}
        {state === "users" && <Users />}
        {state === "settings" && <Settings />}
    </section>;
  }

export default Main;


const Posts = () => {
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<Post[]>([]);
  const router = useRouter();

  useEffect(() => {
    // Simula uma chamada de API para buscar os posts
    const fetchPosts = async () => {
      try {

        const fetchedPosts = await getAllPosts();
        setPosts(fetchedPosts);
        setLoading(false);
      } catch (error) {
        console.error("Erro ao buscar posts: ", error);
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);
const listaVinte = Array.from({ length: 20 }, () => ({
  ...posts[0],
  id2: Math.random() // Gerar IDs diferentes para o React não reclamar da 'key'
}));


  const gotoPost = (id: string) => {
    // Aqui você pode implementar a navegação para a página de edição do post
    router.push(`/admin/posts/${id}`);
  }

  return (<div className={styles.mainframe}>
    {loading ? (
      <span><Image src="/spinner.svg" alt="Carregando..." fill={true}/></span>
    ) : listaVinte.map((post) => (
      <div key={post.id2}  className={styles.post} onClick={() => gotoPost(post.id)}>
        <h3>{post.title}</h3>
        <span><Image src={post.img} alt={post.title} fill={true}/></span>
      </div>
    ))}
  </div>);
}





const Users = () => {
  return (<div className={styles.mainframe}>Users</div>);
}

const Settings = () => {
  return (<div className={styles.mainframe}>Settings</div>);
}