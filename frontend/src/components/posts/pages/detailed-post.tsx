"use client";

import PostSummary from "@/components/posts/post-summary";
import { getDetailedPostUrl, URL_SEGMENTS } from "@/utils/url-segments";

import styles from "../posts.module.css";
import { useEffect, useState } from "react";
import api from "@/utils/api";
import { useRouter } from "next/navigation";
import PostSummaryDetailed from "../post-summary-detailed";

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

    return (
        <PostSummaryDetailed post={post} />
    );
}
