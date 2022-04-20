import React, { useContext } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import styles from '../styles/Home.module.css';
import { AuthContext } from '../contexts/AuthContext';

export default function Home() {
  const user = useContext(AuthContext);
  const backgroundStyle = {
    backgroundImage: `url('glen-carrie-jiUNAQb6Cfk-unsplash.jpg')`,
    width: "100%",
    heigth: "100%",
    backgroundPosition: "-150px -200px",
  }

  return (
    <div className={styles.container} style={backgroundStyle}>
      <Head>
        <title>Game Night</title>
        <meta name="description" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to Game Night!
        </h1>
        {user ? <><div className={styles.grid}>
          <Link href="/library">
            <div className={styles.card}>
              <h2>Library</h2>
              <p>My games</p>
            </div>
          </Link>
        </div>
          <div className={styles.grid}>
            <Link href="/profile">
              <div className={styles.card}>
                <h2>Profile</h2>
                <p>User data / Logout</p>
              </div>
            </Link>
          </div>
        </>
          :
          <div className={styles.grid}>
            <Link href="/login">
              <div className={styles.card}>
                <h2>Login / Sign up</h2>
              </div>
            </Link>

          </div>}

      </main>

    </div>
  )
}
