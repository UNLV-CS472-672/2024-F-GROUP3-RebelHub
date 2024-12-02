"use client";

import CreatePostForm from "@/components/posts/forms/create-post-form";
import RebelHubNavBar from "@/components/navbar/RebelHubNavBar";
import Sidebar from "@/components/sidebar/sidebar";
import styles from "./post-pages.module.css";

export default function CreatePostPage() {
    return (
        <div className={styles.body}>
            <RebelHubNavBar/>
            <Sidebar/>
            <div className={styles.margins}>
                <CreatePostForm/>
            </div>
        </div>
    );
}
