import React, { useState, useEffect } from "react";
import Bubble from "../components/bubble";

const Room: React.FC = () => {

	const test = async () => {
		try { 
			fetch('http://localhost:8000/log')
				.then(response => response.text())
				.then(data => console.log(data))
				.catch(error => console.error('Error:', error));
		} catch (error) {
			console.error('Error:', error);
		}
	}

	useEffect(() => {
		test();
	}, []);

	return <div>
		room
	</div>;
};

export default Room;
