"use client";

import Link from "next/link";
import styles from "./post-buttons.module.css"
import { gotoCreatePostPage } from "@/utils/url-segments";

interface ComponentProps {
    hubId: number|null;
}

const CreatePostButton: React.FC<ComponentProps> = ({ hubId=null }) => {
    const addHubId = () => {
        if (hubId != null) {
            localStorage.setItem("hubId", hubId.toString());
        }
    }

    return (
        <div>
            <Link href={gotoCreatePostPage()} onClick={addHubId}>
                <button className={styles.basicButton} type="button">Create a Post</button>
            </Link>
        </div>
    );
}

export default CreatePostButton;
