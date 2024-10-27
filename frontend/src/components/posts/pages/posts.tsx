"use client";

import { useEffect, useState } from "react";
import { getPostListUrl } from "@/utils/posts/url-segments";
import CreatePostButton from "../buttons/create-post-button";
import PostList from "../post-list";

import styles from "../posts.module.css";
import api from "@/utils/api";

export default function PostsPage() {
    const [posts, setPosts] = useState(null);

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

    // Sometimes, the post tries to render before the api call is finished, so this
    // prevents the page from trying to load values from a null value.
    
    if (posts == null) {
        return <></>;
    }

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
