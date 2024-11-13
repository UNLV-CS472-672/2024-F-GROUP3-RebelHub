"use client";
import axios from 'axios';
import { useEffect, useState } from 'react';
import Explore from "../../components/Explore/Explore";
import ProtectedRoute from '../../components/Accounts/ProtectedRoutes';
import styles from "../../components/Explore/Explore.module.css"
import SideBar from "../../components/sidebar.js"
import RebelHubNavBar from "../../components/navbar/RebelHubNavBar.js"

const Home = () => {
	return (
		<ProtectedRoute>
			<div className={styles.container}>
				<RebelHubNavBar/>
            	<SideBar />
				<main style={{ backgroundColor: '#0a0a0a'}}>
					<Explore/>
				</main>
			</div>
		</ProtectedRoute>
	);
};

export default Home;
