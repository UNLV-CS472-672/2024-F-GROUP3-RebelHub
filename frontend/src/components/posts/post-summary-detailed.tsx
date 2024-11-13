"use client";

import { Post } from "@/utils/posts/definitions";
import styles from "./post-summary-detailed.module.css";
import LikeDislikeButtons from "./buttons/like-dislike-buttons";
import { useEffect, useState } from "react";
import { checkAuthorPrivileges, checkHubPrivileges } from "@/utils/fetchPrivileges";
import DeletePostButton from "./buttons/delete-post-button";
import EditPostButton from "./buttons/edit-post-button";
import { getDislikePostUrl, getLikePostUrl } from "@/utils/url-segments";

interface ComponentProps {
    post: Post;
}

/*
    Post Summary Detailed
    
    This component displays detailed information about a post.

    post: a post object
*/

const PostSummaryDetailed: React.FC<ComponentProps> = ({ post }) => {
    const [isAuthor, setIsAuthor] = useState(false);
    const [isMod, setIsMod] = useState(false);

    useEffect(() => {
        const fetchPrivileges = async () => {
            const authorPrivileges = await checkAuthorPrivileges(post.author);
            
            if(authorPrivileges) {
                setIsAuthor(authorPrivileges);
                return;
            }

            const hubPrivileges = await checkHubPrivileges(post.hub);
            setIsMod(hubPrivileges);
        }
        fetchPrivileges();
    }, []);

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
                <br></br>
                <div className={styles.detailedPostButtonList}>
                    {isAuthor &&
                        <>
                            <DeletePostButton post={post} />
                            <EditPostButton post={post} />
                        </>
                    }
                    {!isAuthor && isMod &&
                        <>
                            <DeletePostButton post={post} />
                            <div></div>
                        </>
                    }
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
