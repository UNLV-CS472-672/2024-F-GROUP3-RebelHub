"use client";

import React from "react";
import { Post } from "@/utils/posts/definitions";
import { useState, useEffect } from "react";
import LikeDislikeButtons from "./buttons/like-dislike-buttons";
import EditPostButton from "./buttons/edit-post-button";
import { getDislikePostUrl, getLikePostUrl, gotoDetailedPostPage } from "@/utils/url-segments";
import Link from "next/link";
import DeletePostButton from "./buttons/delete-post-button";
import {checkHubPrivileges, checkAuthorPrivileges} from "../../utils/fetchPrivileges";
import styles from "./post-summary.module.css";

interface ComponentProps {
    post: Post;
}

/*
    Post Summary

    This component displays some basic information about a post.

    post: a post object
*/

const PostSummary: React.FC<ComponentProps> = ({ post }) => {
    const [showButton, setShowButton] = useState(false);

    useEffect(() => {
        const fetchPrivileges = async () => {
            const authorPrivileges = await checkAuthorPrivileges(post.author);
            const hubPrivileges = await checkHubPrivileges(post.hub);
            setShowButton(authorPrivileges || hubPrivileges);
        }
        fetchPrivileges();
    }, []);

    return (
        <div className={styles.postContainer}>
            <div className={styles.postElementColumn}>
                <LikeDislikeButtons 
                    postObject={post} 
                    likeUrlFunction={getLikePostUrl} 
                    dislikeUrlFunction={getDislikePostUrl}
                    containerClassName={styles.summaryVoteContainer}/>
            </div>
            <div className={styles.postElementColumn}>
                <Link href={gotoDetailedPostPage(post.id)}>
                    <p>Post Thumbnail Placeholder</p>
                </Link>
            </div>
            <div className={styles.postElementColumn}>
                <Link href={gotoDetailedPostPage(post.id)}>
                    <h2 className={styles.postTitle}>
                        {post.title}
                    </h2>
                </Link>
                <div className={styles.postButtonList}>
                    {showButton &&
                    <>
                        <DeletePostButton post={post} />
                        <EditPostButton post={post} />
                    </>
                    }
                </div>
            </div>
        </div>
    )
}

export default PostSummary;