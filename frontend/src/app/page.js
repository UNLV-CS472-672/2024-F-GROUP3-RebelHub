"use client";
import axios from 'axios';
import { useEffect, useState } from 'react';
import RebelHubNavBar from '../components/navbar/RebelHubNavBar';
import ProtectedRoute from '../components/Accounts/ProtectedRoutes'



const Home = () => {
	const [dummyHubs, setDummyHubs] = useState([]);

	useEffect(() => {
		console.log("fetching...");
		const fetchDummyHubs = async () => {
			try{
				const response = await axios.get('http://localhost:8000/api/dummyhubs/'); 
				setDummyHubs(response.data);
			} catch (error) {
				console.log("error fetching data: ", error);
			}
		};
		fetchDummyHubs();
	}, []);

	return (
		<ProtectedRoute>
			<main>
				<RebelHubNavBar></RebelHubNavBar>
				<h1>Rebel Hubs HOME</h1>
				<h2>Hub test:</h2>
				<ul>
					{dummyHubs.map((hub) => (<li key={hub.id}>{hub.name + hub.description}</li>))}
				</ul>
			</main>
		</ProtectedRoute>
		
	);
};

export default Home;
