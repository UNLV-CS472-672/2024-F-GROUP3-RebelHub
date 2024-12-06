"use client";
import { useState, useEffect } from "react";
import styles from "./Explore.module.css";
import api from "../../utils/api.js";
import { } from "../../utils/fetchPrivileges.js";
import { getExploreListUrl } from "@/utils/url-segments";
import PostList from "../posts/post-list.tsx";
import FilterPostButtons from "../FilterButtons/FilterPostButtons.js";

const Posts = () => {
    const [posts, setPosts] = useState([]);

    // Fetches posts from API
    useEffect(() => {
        console.log("Fetching initial explore page posts...");
        const fetchInitialPosts = async () => {
            try {
                const response = await api.get(getExploreListUrl(null, 'week', 'top')); 
                setPosts(response.data);
                console.log(response.data);
                console.log("Successful fetch");
            } catch (error) { console.log("Error fetching initial explore page posts: ", error); }
        };
        fetchInitialPosts();
    }, []);

    return (
        <main>
            <header className={styles.header}>
                <h1 style={{ marginBottom: '2vh' }}>Posts</h1>
                <FilterPostButtons posts={posts} setPosts={setPosts} postsUrl={getExploreListUrl}/>
            </header>
            <section className={styles.postsContainer}>
                <PostList posts={posts} />
            </section>
        </main>
    );
};

export default Posts;
