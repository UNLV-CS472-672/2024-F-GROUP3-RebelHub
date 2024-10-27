import React from "react";
import PostSummary from "./post-summary";
import { Post } from "@/utils/posts/definitions";

import styles from "./posts.module.css";

interface ComponentProps {
    posts: Post[];
}

/*
    PostList

    This component displays a list of posts that were passed to the component.

    posts: an array or iterable of post objects

    The component displays all posts in the list, so any filtering has to be done
    by the page using the component.
*/

const PostList: React.FC<ComponentProps> = ({ posts }) => {
    if (posts.length == 0) {
        return <>No posts found.</>;
    }

    return (
        <div>
            {
                posts.map((post) => (
                    <div key={post.id} className={styles.postListContainer}>
                        <PostSummary post={post} />
                    </div>
                ))
            }
        </div>
    );
}

export default PostList;
