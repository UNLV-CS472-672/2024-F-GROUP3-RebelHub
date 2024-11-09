"use client";

import { useEffect, useState } from "react";
import { getPostListUrl } from "@/utils/url-segments";
import CreatePostButton from "../buttons/create-post-button";
import PostList from "../post-list";

import styles from "./post-pages.module.css";
import api from "@/utils/api";

export default function PostsPage() {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const getPosts = async () => {
            try {
                const response = await api.get(getPostListUrl());

                if(response.status == 200) {
                    console.log("got post list");
                    setPosts(response.data);
                }

            } catch (error) {
                alert(error);
            }
        }

        getPosts();
    }, []);

    return (
    <div className={styles.postsPageContainer}>
        <div className={styles.header}>
            <h1>Posts</h1>
            <CreatePostButton/>
        </div>
        <div className={styles.hubsAndPostsContainer}>
            <div>
                Hubs Area Placeholder
            </div>
            <PostList posts={posts}/>
        </div>
    </div>
    );
}
