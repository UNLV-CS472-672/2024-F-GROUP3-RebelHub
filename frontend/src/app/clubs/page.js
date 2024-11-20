"use client";
import Clubs from "../../components/Clubs/Clubs";
import ProtectedRoute from '../../components/Accounts/ProtectedRoutes';
import styles from "../../components/Clubs/Clubs.module.css"
import SideBar from "../../components/sidebar.js"
import RebelHubNavBar from "../../components/navbar/RebelHubNavBar.js"

const Home = () => {
	return (
		<ProtectedRoute>
			<div className={styles.container}>
				<RebelHubNavBar/>
            	<SideBar />
				<main style={{ backgroundColor: '#0a0a0a'}}>
					<Clubs/>
				</main>
			</div>
		</ProtectedRoute>
	);
};

export default Home;
