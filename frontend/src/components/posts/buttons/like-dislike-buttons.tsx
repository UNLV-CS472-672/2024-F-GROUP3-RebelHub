"use client";

import React, { useState } from "react";

import styles from "./post-buttons.module.css";
import api from "@/utils/api";
import clsx from "clsx";
import { Post } from "@/utils/posts/definitions";

interface ComponentProps {
    postObject: Post;
    likeUrlFunction: (objectId: number) => string;
    dislikeUrlFunction: (objectId: number) => string;
    containerClassName: string;
}

const LikeDislikeButtons: React.FC<ComponentProps> = ({ postObject, likeUrlFunction, dislikeUrlFunction, containerClassName }) => {
    const [displayedLikes, setLikes] = useState(postObject.likes.length);
    const [displayedDislikes, setDislikes] = useState(postObject.dislikes.length);
    const [postLiked, setPostLiked] = useState(postObject.is_liked);
    const [postDisliked, setPostDisliked] = useState(postObject.is_disliked);

    const handleLike = async () => {
        // Check if the post was liked before clicking like
        if (postLiked) {
            setLikes(displayedLikes - 1);
        } else {
            setLikes(displayedLikes + 1);
        }

        setPostLiked(!postLiked);

        // Check if the post was disliked before clicking like
        if (postDisliked) {
            setDislikes(displayedDislikes - 1);
            setPostDisliked(!postDisliked);
        }

        try {
            console.log("Like change for " + postObject.id);

            const response = await api.patch(likeUrlFunction(postObject.id));

            if (response.status != 200) {
                throw new Error("Error when posting a vote");
            }
            
        } catch (error) {
            console.log("Error posting a like: " + error);
        }
    }

    const handleDislike = async () => {
        // Check if the post was disliked before clicking disliked
        if (postDisliked) {
            setDislikes(displayedDislikes - 1);
        } else {
            setDislikes(displayedDislikes + 1);
        }

        setPostDisliked(!postDisliked);

        // Check if the post was liked before clicking dislike
        if (postLiked) {
            setLikes(displayedLikes - 1);
            setPostLiked(!postLiked);
        }

        try {
            console.log("Dislike change for " + postObject.id);

            const response = await api.patch(dislikeUrlFunction(postObject.id));

            if (response.status != 200) {
                throw new Error("Error when posting a vote");
            }
            
        } catch (error) {
            console.log("Error posting a dislike: " + error);
        }
    }
    
    return (
        <div className={containerClassName}>
            <div className={styles.voteContainer}>
                <div>
                    {displayedLikes}
                </div>
                <div>
                    <button onClick={handleLike} className={clsx(
                        [styles.basicButton],
                        {
                            [styles.likeButton]: postLiked,
                        }
                    )}>
                        Like
                    </button>
                </div>
            </div>
            <div className={styles.voteContainer}>
                <div>
                    {displayedDislikes}
                </div>
                <div>
                    <button onClick={handleDislike} className={clsx(
                        [styles.basicButton],
                        {
                            [styles.dislikeButton]: postDisliked,
                        }
                    )}>
                        Dislike
                    </button>
                </div>
            </div>
        </div>
    )
}

export default LikeDislikeButtons;
