"use client";

import PostSummary from "@/components/posts/post-summary";
import { getDetailedPostUrl, URL_SEGMENTS } from "@/utils/posts/url-segments";

import styles from "../posts.module.css";
import { useEffect, useState } from "react";
import api from "@/utils/api";
import { useRouter } from "next/navigation";

export default function DetailedPostPage({ id, }: { id: number|string }) {
    const [post, setPost] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const getPost = async () => {
            try {
                const response = await api.get(getDetailedPostUrl(id));

                if (response.status == 200) {
                    console.log("got post list");
                    setPost(response.data);
                }

            } catch (error) {
                
                if (error.status == 404) {
                    alert("This post does not exist.");

                    // It would probably be a better idea to redirect the user to wherever they were
                    // before visiting the detailed post, but this should be fine for now.

                    router.push(URL_SEGMENTS.FRONTEND + URL_SEGMENTS.POSTS_HOME);
                }
            }
        }

        getPost();
    }, []);

    // Sometimes, the post tries to render before the api call is finished, so this
    // prevents the page from trying to load values from a null value.
    
    if (post == null) {
        return <></>;
    }

    return (
        <div className={styles.detailedPostContainer}>
            <div>
                <PostSummary post={post}/>
            </div>
            <div>
                <p>Posted on {post.timestamp.toString().slice(0, 10)} by {post.author}</p>
            </div>
            <div>
                {post.message}
            </div>
            <div>
                <h1>Comments Placeholder</h1>
            </div>
        </div>
    );
}
