"use client";

import Link from "next/link";
import styles from "../posts.module.css"
import { gotoCreatePostPage } from "@/utils/posts/url-segments";
import { FC } from "react";

const CreatePostButton: FC = () => {
    return (
        <>
            <Link href={gotoCreatePostPage()}>
                <button className={styles.basicButton} type="button">Create a Post</button>
            </Link>
        </>
    );
}

export default CreatePostButton;
