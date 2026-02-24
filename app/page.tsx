'use client';

import { useEffect, useState } from 'react';
import AOS from 'aos';
import Image from 'next/image';
import styles from "./page.module.scss";
import "./Components/aos.css";

const Home = () => {

  const [isHovering, setIsHovering] = useState(false);


    useEffect(() => {
        AOS.init({
            duration: 1000,
            once: true,
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
            <Section title="My Projects" />
          </div>
    </main>
  );
};


const Section = ({ title }: { title: string; }) => {
  return (
    <div className={styles.section} data-aos="fade-up">
      <h2>{title} &gt;</h2>
    </div>)
}


export default Home;