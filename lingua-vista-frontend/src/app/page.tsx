"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import styles from "./page.module.css";

import UserForm from "./_components/UserForm";
import { useUser } from "./_context/UserContext";

export default function Home() {
  const router = useRouter();

  const { roomID } = useUser();

  useEffect(() => {
    if (roomID !== null) {
      router.push(`/room/${roomID}`);
    }
  }, [roomID, router]);

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <UserForm />
      </main>
      <footer className={styles.footer}>
        <a
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}
