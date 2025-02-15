"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

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
			<footer className={styles.footer}></footer>
		</div>
	);
}
