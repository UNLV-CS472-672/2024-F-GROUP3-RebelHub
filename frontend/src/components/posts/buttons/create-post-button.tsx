import { gotoCreatePostPage } from "@/utils/posts/url-segments";
import Link from "next/link";
import { FC } from "react";
import styles from "../posts.module.css"

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