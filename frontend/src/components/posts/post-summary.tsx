"use client";

import React from "react";
import { Post } from "@/utils/posts/definitions";

import LikeDislikeButtons from "./buttons/like-dislike-buttons";
import { getDislikePostUrl, getLikePostUrl, gotoDetailedPostPage } from "@/utils/posts/url-segments";
import Link from "next/link";
import DeletePostButton from "./buttons/delete-post-button";

import styles from "./posts.module.css";

interface ComponentProps {
    post: Post;
}

/*
    Post Summary

    This component displays some basic information about a post.

    post: a post object
*/

const PostSummary: React.FC<ComponentProps> = ({ post }) => {
    if (post == null) {
        return <>No post.</>;
    }

    return (
        <div className={styles.postContainer}>
            <div className={styles.postElementColumn}>
                <LikeDislikeButtons 
                    objectId={post.id} 
                    likes={post.likes} 
                    dislikes={post.dislikes} 
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
                <div>
                    <DeletePostButton id={post.id} />
                </div>
            </div>
        </div>
    )
}

export default PostSummary;