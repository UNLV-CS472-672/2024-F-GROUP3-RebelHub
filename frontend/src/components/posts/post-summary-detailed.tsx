"use client";

import { Post } from "@/utils/posts/definitions";
import styles from "./post-summary-detailed.module.css";
import LikeDislikeButtons from "./buttons/like-dislike-buttons";
import { useEffect, useState } from "react";
import { checkAuthorPrivileges, checkHubPrivileges } from "@/utils/fetchPrivileges";
import DeletePostButton from "./buttons/delete-post-button";
import EditPostButton from "./buttons/edit-post-button";
import { getDislikePostUrl, getLikePostUrl } from "@/utils/url-segments";
import RecursiveCommentList from "../comments/RecursiveCommentList";
import CreateComment from "../comments/CreateComment";
import CreateCommentButton from "../comments/buttons/CreateCommentButton";

interface ComponentProps {
    post: Post;
}

/*
    Post Summary Detailed
    
    This component displays detailed information about a post.

    post: a post object
*/

const PostSummaryDetailed: React.FC<ComponentProps> = ({ post }) => {
    const [showButton, setShowButton] = useState(false);
    const [showCreateComment, setShowCreateComment] = useState(false);

    useEffect(() => {
        const fetchPrivileges = async () => {
            const authorPrivileges = await checkAuthorPrivileges(post.author);
            const hubPrivileges = await checkHubPrivileges(post.hub);
            setShowButton(authorPrivileges || hubPrivileges);
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
                    {showButton && 
                        <>
                            <DeletePostButton post={post} />
                            <EditPostButton post={post} />
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
                        Author: {post.author}
                    </div>
                    <div>
                        Hub: {post.hub}
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
                    <CreateCommentButton 
                        toggleReply={() => setShowCreateComment(!showCreateComment)}
                        buttonMessage={"Create Comment"}
                    />
                </div>
            </div>
            <div>
                {showCreateComment && 
                    <div className={styles.detailedCreateComment}>
                        <CreateComment 
                            post={post} 
                            onClose={() => setShowCreateComment(false)} 
                            commentReply={null} 
                        />
                    </div>
                }
                <RecursiveCommentList post={post} />
            </div>
        </div>
    )
}

export default PostSummaryDetailed;
