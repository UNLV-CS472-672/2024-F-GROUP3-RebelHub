"use client";
import { getPostListUrl, gotoPostListPage } from "@/utils/posts/url-segments";
import { ACCESS_TOKEN } from '@/utils/constants';
import axios from 'axios';
import Link from 'next/link';
import { useEffect, useState } from 'react';

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
		<main>
			<h1>Rebel Hubs HOME</h1>
			<h2>Hub test:</h2>
			<ul>
				{dummyHubs.map((hub) => (<li key={hub.id}>{hub.name + hub.description}</li>))}
			</ul>
			<Link href={gotoPostListPage()}>
				[Go to posts]
			</Link>
		</main>
	);
};

export default Home;
