"use client";
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import RebelHubNavBar from '../components/navbar/RebelHubNavBar';
import ProtectedRoute from '../components/Accounts/ProtectedRoutes'
import './home.css'
import Sidebar from "@/components/sidebar/sidebar";
import api from "@/utils/api";
import PostList from '@/components/posts/post-list';
import styles from "@/components/hubs/HubPage.module.css";
import {getJoinedHubsUrl, getPostsHubUrl} from "@/utils/url-segments";


const Home = () => {
	const[joinedHubs,setJoinedHubs]=useState([]);
	const [hubPosts, setHubPosts] = useState([]);
	const[ids,setIds]=useState([]);

	const allHubsJoinedPosts = async () => {
    try {
		const response = await api.get(getJoinedHubsUrl());
			const hubIds = response.data.map(hub => hub.id);
			// Map to get all IDs
			if (hubIds.length > 0) {
			const postRequests = hubIds.map(id => api.get(getPostsHubUrl(id)));

        // Wait for all API calls to finish using Promise.all
        const postResponses = await Promise.all(postRequests);

        // Extract the posts from the responses and flatten the array
        const allPosts = postResponses.map(response => response.data).flat();

        // Set the posts to the state
        setHubPosts(allPosts);
				console.log(allPosts);
			}
		}catch(error){
		alert(error)
		}
	}
	useEffect(() => {
	allHubsJoinedPosts();
	}, []);

	return (

			<main>
				<RebelHubNavBar></RebelHubNavBar>
				<div className="background">
					<Sidebar/>
					<PostList className={styles.postsList} posts={hubPosts}/>




				</div>
			</main>

	);
};
function ProtectedHome(){
	return (
		<ProtectedRoute>
			<Home/>
		</ProtectedRoute>
	)
}
export default ProtectedHome;
