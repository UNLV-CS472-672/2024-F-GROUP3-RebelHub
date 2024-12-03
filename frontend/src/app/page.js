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

	const allHubsJoined = async () => {
    try {
      const response = await api.get(getJoinedHubsUrl());
      if (response.data.length > 0) {
        const hubIds = response.data.map(hub => hub.id); // Map to get all IDs
        setIds(hubIds); // Set the array of IDs
        console.log("Joined hubs IDs:", hubIds);
      }
    } catch (error) {
      console.log("Error fetching joined hubs:", error);
    }
  }
	const getPostsHub = async (hubId) => {
    try {
      const response = await api.get(getPostsHubUrl(hubId));
      if (response.status === 200) {
        // Use functional setState to append posts to previous posts
        setHubPosts(prevPosts => [
          ...prevPosts,
          ...response.data, // Append new posts to the existing posts
        ]);
        console.log("Fetched posts for hub:", hubId, response.data);
      }
    } catch (error) {
      console.log("Error fetching post info:", error);
    }
  };
	useEffect(() => {
    allHubsJoined();
  }, []);

  // Run getPostsHub whenever the 'id' state changes
  useEffect(() => {
    if (ids.length > 0) {
      ids.forEach(id => {
        getPostsHub(id); // Fetch posts for each hub ID
      });
    }
  }, [ids]);

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
