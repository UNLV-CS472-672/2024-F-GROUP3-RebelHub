"use client";

import { Post } from "@/utils/posts/definitions";
import styles from "./posts.module.css";
import LikeDislikeButtons from "./buttons/like-dislike-buttons";
import { getDislikePostUrl, getLikePostUrl } from "@/utils/posts/url-segments";

interface ComponentProps {
    post: Post;
}

/*
    Post Summary Detailed
    
    This component displays detailed information about a post.

    post: a post object
*/

const PostSummaryDetailed: React.FC<ComponentProps> = ({ post }) => {
    if (post == null) {
        return <>No post.</>;
    }

    return (
        <div className={styles.detailedPostContainer}>
            <div className={styles.detailedPostElement}>
                <div>
                    <h1>{post.title}</h1>
                </div>
                <br></br>
                <div>
                    [Full post thumbnail or image]
                </div>
                <br></br>
                <div>
                    {post.message}
                </div>
            </div>
            <div className={styles.detailedPostFooterContainer}>
                <div className={styles.detailedPostElement}>
                    <div>
                        Posted
                    </div>
                    <div>
                        {post.timestamp.toString().slice(0, 10)}
                    </div>
                </div>
                <div className={styles.detailedPostElement}>
                    <div>
                        {post.author}
                    </div>
                    <div>
                        {post.hub}
                    </div>
                </div>
                <div className={styles.detailedPostElement}>
                    <LikeDislikeButtons 
                        postObject={post}
                        likeUrlFunction={getLikePostUrl} 
                        dislikeUrlFunction={getDislikePostUrl}
                        containerClassName={styles.detailedVoteContainer}/>
                </div>
                <div className={styles.detailedPostElement}>
                    [Create Comment]
                </div>
            </div>
            <div>
                [Comments]
            </div>
        </div>
    )
}

export default PostSummaryDetailed;
