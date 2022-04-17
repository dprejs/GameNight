import React from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import styles from '../styles/Home.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Game Night</title>
        <meta name="description" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to Game Night
        </h1>

        {/* <div className={styles.grid}>
          <Link href="/library">
            <div className={styles.card}>
              <h2>Games</h2>
              <p>list of games</p>
            </div>
          </Link>

        </div> */}
        <div className={styles.grid}>
          <Link href="/login">
            <div className={styles.card}>
              <h2>Login / Sign up</h2>
            </div>
          </Link>

        </div>
      </main>
{/*
      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer> */}
    </div>
  )
}
