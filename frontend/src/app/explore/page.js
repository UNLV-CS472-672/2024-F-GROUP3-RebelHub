"use client";
import {useState } from 'react';
import Posts from "../../components/Explore/Posts";
import ProtectedRoute from '../../components/Accounts/ProtectedRoutes';
import styles from "../../components/Explore/Explore.module.css";
import Hubs from "../../components/Explore/Hubs.js";

const Home = () => {
	const [isPostPage, setIsPostPage] = useState(true);

	return (
		<ProtectedRoute>
			<div className={styles.container}>
				<button className={styles.switchbutton} onClick={() => setIsPostPage(previous => !previous)}>
					{isPostPage ? "Click Here To Explore Hubs!" : "Click Here To Explore Posts!"}
				</button>
				<main style={{ backgroundColor: '#0a0a0a'}}>
					{isPostPage && <Posts/>}
					{!isPostPage && <Hubs/>}
				</main>
			</div>
		</ProtectedRoute>
	);
};

export default Home;
