"use client";

import PostSummary from "@/components/posts/post-summary";
import { getDetailedPostUrl, URL_SEGMENTS } from "@/utils/url-segments";

import styles from "@/components/posts/pages/post-pages.module.css";
import { useEffect, useState } from "react";
import api from "@/utils/api";
import { useRouter } from "next/navigation";
import PostSummaryDetailed from "../post-summary-detailed";
import RebelHubNavBar from "@/components/navbar/RebelHubNavBar";
import Sidebar from "@/components/sidebar/sidebar";

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

                    router.push("/profile/");
                }
            }
        }

        getPost();
    }, []);

    if (post == null) {
        return <>Could not find post.</>;
    }

    return (
        <div className={styles.body}>
            <RebelHubNavBar/>
            <Sidebar/>
            <div className={styles.margins}>
                <PostSummaryDetailed post={post} />
            </div>
        </div>
    );
}
