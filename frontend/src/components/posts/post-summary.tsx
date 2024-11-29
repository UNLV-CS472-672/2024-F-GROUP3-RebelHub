"use client";

import React from "react";
import { Post } from "@/utils/posts/definitions";
import { useState, useEffect } from "react";
import LikeDislikeButtons from "./buttons/like-dislike-buttons";
import EditPostButton from "./buttons/edit-post-button";
import { displayPicture, getDislikePostUrl, getLikePostUrl, gotoDetailedPostPage } from "@/utils/url-segments";
import Link from "next/link";
import DeletePostButton from "./buttons/delete-post-button";
import {checkHubPrivileges, checkAuthorPrivileges} from "../../utils/fetchPrivileges";
import styles from "./post-summary.module.css";
import EditedHover from "./others/EditedHover";

interface ComponentProps {
    post: Post;
}

const noImagePath = "/default/No Post Image.png";

/*
    Post Summary

    This component displays some basic information about a post.

    post: a post object
*/

const PostSummary: React.FC<ComponentProps> = ({ post }) => {
    const [isAuthor, setIsAuthor] = useState(false);
    const [isMod, setIsMod] = useState(false);
    const [refresh, setRefresh] = useState(false);

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

    const refreshComponent = () => {
        setRefresh(!refresh);
    }

    return (
        <div className={styles.postContainer}>
            <div>
                <Link href={gotoDetailedPostPage(post.id)}>
                    {post.pictures.length > 0 ? (
                        <img src={displayPicture(post.pictures[0])} className={styles.postThumbnail}/>
                    ) : (
                        <img src={noImagePath} className={styles.postThumbnail}/>
                    )
                    }
                </Link>
            </div>
            <div>
                <div className={styles.textContainer}>
                    <div className={styles.postTitle}>
                        <div className={styles.postTitleComponent}>
                            <Link href={gotoDetailedPostPage(post.id)}>
                                <h2 className={styles.postTitle}>
                                    {post.title}
                                </h2>
                            </Link>
                        </div>
                        <div className={styles.postTitleComponent}>
                            <EditedHover editedDate={post.last_edited}/>
                        </div>
                    </div>
                    <div className={styles.postButtonList}>
                        <LikeDislikeButtons 
                            postObject={post} 
                            likeUrlFunction={getLikePostUrl} 
                            dislikeUrlFunction={getDislikePostUrl}
                            containerClassName={styles.summaryVoteContainer}
                        />
                        <div></div>
                        {isAuthor &&
                            <>
                                <EditPostButton post={post} refreshComponent={refreshComponent}/>
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
            </div>
        </div>
    )
}

export default PostSummary;