'use client';

import { useEffect } from 'react';
import AOS from 'aos';
import styles from "./page.module.scss";
import "./Components/aos.css";

const Home = () => {

    useEffect(() => {
        AOS.init({
            duration: 1000,
            once: true,
        });
    }, []);


  return (
    <main className={styles.main}>
          <h1 data-aos="fade-up" className={styles.title}>Welcome to My Portfolio</h1>

    </main>
  );
};

export default Home;