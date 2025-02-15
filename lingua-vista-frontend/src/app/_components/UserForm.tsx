import styles from "../_styles/UserForm.module.css";
import { LANGUAGE_OPTIONS } from "../_utils/Lang";
import { useUser } from "../_context/UserContext";
import { Button } from "@chakra-ui/react";

const UserForm = () => {
	const { userName, primaryLang, learningLang, setUserName, setPrimaryLang, setLearningLang, queueUser } = useUser();

	const handleSubmit = async (event) => {
		event.preventDefault();

		await queueUser();

		setUserName("");
		setPrimaryLang("");
		setLearningLang("");
	};

	return (
		<form onSubmit={handleSubmit} className={styles.form}>
			<label>
				Enter User Name:
				<input
					type="text"
					value={userName}
					onChange={(e) => setUserName(e.target.value)}
					placeholder="Enter User Name"
					className={styles.input}
				/>
			</label>
			<label>
				Primary Language:
				<select className={styles.input} value={primaryLang} onChange={(e) => setPrimaryLang(e.target.value)}>
					{LANGUAGE_OPTIONS.map((lang, index) => (
						<option key={index} value={lang}>
							{lang}
						</option>
					))}
				</select>
			</label>
			<label>
				Learning Language:
				<select className={styles.input} value={learningLang} onChange={(e) => setLearningLang(e.target.value)}>
					{LANGUAGE_OPTIONS.map((lang, index) => (
						<option key={index} value={lang}>
							{lang}
						</option>
					))}
				</select>
			</label>

			<Button type="submit" className={styles.button}>
				Go
			</Button>
		</form>
	);
};

export default UserForm;
