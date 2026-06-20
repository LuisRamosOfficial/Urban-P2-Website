'use client';

import { useEffect, useState } from 'react';
import AOS from 'aos';
import Image from 'next/image';
import Link from 'next/link'; // Importante para a navegação
import styles from "./page.module.scss";
import "./Components/aos.css";

// Importa a tua função de buscar posts (Ajusta o caminho se for diferente)
import { getAllPosts } from "@/app/Components/Services/postServices";
import type { Post as PostType } from "@/app/Components/Services/postServices";

const Home = () => {
    const [isHovering, setIsHovering] = useState(false);
    const [posts, setPosts] = useState<PostType[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        AOS.init({
            duration: 1000,
            once: true,
        });

        // Vai buscar os posts quando a página carrega
        getAllPosts().then((data) => {
            setPosts(data);
            setLoading(false);
        });
    }, []);

    return (
        <main className={styles.main}>
            <span 
                className={styles.logo} 
                data-aos="fade-up"
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
            >
                <Image src="/urbanp2.jpeg" alt="Logo" fill={true} />
                {isHovering && <div className={styles.tooltip}><p>Urban P2: The biggest, the largest</p></div>}
            </span>
            
            <h1 data-aos="fade-up" className={styles.title}>Welcome to my Blog!</h1>
            <p data-aos="fade-up" data-aos-delay="200" className={styles.description}>
                Explore my projects and experiences with urbanism in Lisbon and more.
            </p>
            
            <div className={styles.Sections}>
                {/* Passamos os posts e o loading para o componente Section */}
                <Section title="Recent Posts" posts={posts} loading={loading} />
            </div>
        </main>
    );
};

// Atualizamos a Section para receber as novas props
const Section = ({ title, posts, loading }: { title: string; posts: PostType[], loading: boolean }) => {
    return (
        <div className={styles.section} data-aos="fade-up">
            <h2>{title} &gt;</h2>
            
            <div className={styles.postsGrid}>
                {loading ? (
                    <p className={styles.loadingText}>A carregar ficheiros do arquivo...</p>
                ) : posts.length > 0 ? (
                    // Mapeia apenas os 4 primeiros posts (ou tira o slice para mostrar todos)
                    posts.slice(0, 4).map((post) => (
                        <Link href={`/posts/${post.id}`} key={post.id} className={styles.postCard}>
                            {post.img && (
                                <div className={styles.imageWrapper}>
                                    <Image src={post.img} alt={post.title} fill sizes="(max-width: 768px) 100vw, 300px" />
                                </div>
                            )}
                            <div className={styles.postInfo}>
                                <h3>{post.title}</h3>
                                {/* Mostra o início do conteúdo ou um excerto, limitado pelo CSS */}
                                <p>{post.conteudo}</p> 
                            </div>
                        </Link>
                    ))
                ) : (
                    <p className={styles.noPosts}>Nenhum post encontrado.</p>
                )}
            </div>
        </div>
    );
}

export default Home;