"use client";

import Link from "next/link";
import styles from "./post-buttons.module.css"
import { gotoCreatePostPage } from "@/utils/url-segments";
import { FC } from "react";

const CreatePostButton: FC = () => {
    return (
        <div>
            <Link href={gotoCreatePostPage()}>
                <button className={styles.basicButton} type="button">Create a Post</button>
            </Link>
        </div>
    );
}

export default CreatePostButton;
