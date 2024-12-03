"use client";

import React from "react";
import { Post } from "@/utils/posts/definitions";
import { useState, useEffect } from "react";
import LikeDislikeButtons from "./buttons/like-dislike-buttons";
import EditPostButton from "./buttons/edit-post-button";
import { displayPicture, getDislikePostUrl, getLikePostUrl, gotoDetailedPostPage, getPostTagUrl } from "@/utils/url-segments";
import Link from "next/link";
import DeletePostButton from "./buttons/delete-post-button";
import styles from "./post-summary.module.css";
import EditedHover from "./others/EditedHover";
import TagPostButton from "./buttons/tag-post-button";
import api from "@/utils/api";

interface ComponentProps {
    post: Post;
    userId: number|null;
    moddedHubs: number[];
}

const noImagePath = "/default/No Post Image.png";

/*
    Post Summary

    This component displays some basic information about a post.

    post: a post object
*/

const PostSummary: React.FC<ComponentProps> = ({ post, userId, moddedHubs }) => {
    const [isAuthor, setIsAuthor] = useState(false);
    const [isMod, setIsMod] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const [postTag, setPostTag] = useState(null);

    

    useEffect(() => {
        if (userId != null) {
            setIsAuthor(post.author == userId);
        }
    }, [userId]);

    useEffect(() => {
        setIsMod(moddedHubs.includes(post.hub));
    }, [moddedHubs]);

    useEffect(() => {
        const fetchPostTag = async () => {   
            if (post.tag != null) {
                const response = await api.get(getPostTagUrl(post.tag));
                setPostTag(response.data);   
            }  
        };
        fetchPostTag();
    }, [post.tag]);

    const refreshComponent = () => {
        setRefresh(!refresh);
    }

    return (
        <div className={styles.postContainer}>
            <div>
                <Link href={gotoDetailedPostPage(post.id)}>
                    {post.pictures.length > 0 ? (
                        <img src={displayPicture(post.pictures[0][1])} className={styles.postThumbnail}/>
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
                            <span>
                                {postTag && <h2 style={{backgroundColor:postTag.color}} className={styles.postTag}>{postTag.name}</h2>}
                                    <h2 className={styles.postTitle}>
                                        {post.title}
                                    </h2>
                            </span>
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
                            <TagPostButton post={post} refreshComponent={refreshComponent}/>
                            </>
                        }
                        {!isAuthor && isMod &&
                            <>
                                <div></div>
                                <DeletePostButton post={post} />
                            <TagPostButton post={post} refreshComponent={refreshComponent}/>
                            
                            </>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PostSummary;