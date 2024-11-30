"use client";

import { Post } from "@/utils/posts/definitions";
import styles from "./post-summary-detailed.module.css";
import LikeDislikeButtons from "./buttons/like-dislike-buttons";
import { useEffect, useState } from "react";
import { checkAuthorPrivileges, checkHubPrivileges } from "@/utils/fetchPrivileges";
import DeletePostButton from "./buttons/delete-post-button";
import EditPostButton from "./buttons/edit-post-button";
import { displayPicture, getDislikePostUrl, getLikePostUrl } from "@/utils/url-segments";
import RecursiveCommentList from "../comments/RecursiveCommentList";
import CreateCommentButton from "../comments/buttons/CreateCommentButton";
import  { formatDate } from "@/utils/datetime-conversion";
import EditedHover from "./others/EditedHover";

interface ComponentProps {
    post: Post;
}

/*
    Post Summary Detailed
    
    This component displays detailed information about a post.

    post: a post object
*/

const PostSummaryDetailed: React.FC<ComponentProps> = ({ post }) => {
    const [showCreateComment, setShowCreateComment] = useState(false);
    const [isAuthor, setIsAuthor] = useState(false);
    const [isMod, setIsMod] = useState(false);
    const [refresh, setRefresh] = useState(false);

    useEffect(() => {
        const fetchPrivileges = async () => {
            console.log(post.pictures[0])
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

    // Function to refresh the component but not reload the page
    const refreshComponent = () => {
        setRefresh(!refresh);
    };

    return (
        <div className={styles.detailedPostContainer}>
            <div className={styles.detailedPostElement}>
                <div>
                    <h1>
                        {post.title}
                    </h1>
                    <EditedHover editedDate={post.last_edited}/>
                </div>
                <div className={styles.imageContainer}>
                    {post.pictures.length > 0 &&
                        <img src={displayPicture(post.pictures[0][1])} className={styles.image}/>
                    } 
                </div>
                <div>
                    {post.message}
                </div>
                <div className={styles.detailedPostButtonList}>
                    <div></div>
                    {isAuthor &&
                        <>
                            <EditPostButton post={post} refreshComponent={refreshComponent} />
                            <DeletePostButton post={post} />
                        </>
                    }
                    {!isAuthor && isMod &&
                        <>
                            <div></div>
                            <DeletePostButton post={post} />
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
                        {formatDate(post.timestamp)}
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
                <RecursiveCommentList 
                    post={post} 
                    showCreateComment={showCreateComment} 
                    setShowCreateComment={setShowCreateComment}
                />
            </div>
        </div>
    )
}

export default PostSummaryDetailed;
