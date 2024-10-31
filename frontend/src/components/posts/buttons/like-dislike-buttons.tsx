"use client";

import React, { useState } from "react";

import styles from "../posts.module.css";
import api from "@/utils/api";
import clsx from "clsx";

interface ComponentProps {
    objectId: number;
    likes: number;
    dislikes: number;
    likeUrlFunction: (objectId: number) => string;
    dislikeUrlFunction: (objectId: number) => string;
    containerClassName: string;
}

const LikeDislikeButtons: React.FC<ComponentProps> = ({ objectId, likes, dislikes, likeUrlFunction, dislikeUrlFunction, containerClassName }) => {
    const [displayedLikes, setLikes] = useState(likes);
    const [displayedDislikes, setDislikes] = useState(dislikes);

    // TODO: will also need to check if the user voted here to reduce the likes/dislikes
    // parameter by 1. This will make the buttons light up correctly.

    const handleLike = async () => {
        // TODO: check if the post was already liked by the user.
        // If it is, then undo the addition and tell server to reduce by 1
        // Else, tell server to add 1.
        
        // This will make the likes/dislikes appear correct client-side,
        // but the database will still see multiple like/dislike posts.

        // Check if dislike is pressed
        if (displayedDislikes == dislikes + 1)
            setDislikes(dislikes);

        if (displayedLikes == likes)
            setLikes(likes + 1);
        else
            setLikes(likes);

        try {
            console.log("Like change for " + objectId);

            const response = await api.post(likeUrlFunction(objectId), {
                post_id: objectId,
            });

            if (response.status != 200) {
                throw new Error("Error when posting a vote");
            }
            
        } catch (error) {
            console.log("Error posting a like: " + error);
        }
    }

    const handleDislike = async () => {
        // TODO: check if the post was already disliked by the user.
        // If it is, then undo the addition and tell server to reduce by 1
        // Else, tell server to add 1.
        
        // This will make the likes/dislikes appear correct client-side,
        // but the database will still see multiple like/dislike posts.

        // Check if like is pressed
        if (displayedLikes == likes + 1)
            setLikes(likes);

        if (displayedDislikes == dislikes)
            setDislikes(dislikes + 1);
        else
            setDislikes(dislikes);

        try {
            console.log("Dislike change for " + objectId);

            const response = await api.post(dislikeUrlFunction(objectId), {
                post_id: objectId,
            });

            if (response.status != 200) {
                throw new Error("Error when posting a vote");
            }
            
        } catch (error) {
            console.log("Error posting a dislike: " + error);
        }
    }
    
    return (
        <div className={containerClassName}>
            <div className={styles.postLikeContainer}>
                <div>
                    {displayedLikes}
                </div>
                <div>
                    <button onClick={handleLike} className={clsx(
                        [styles.basicButton],
                        {
                            [styles.likeButton]: displayedLikes == likes + 1,
                        }
                    )}>
                        Like
                    </button>
                </div>
            </div>
            <div className={styles.postDislikeContainer}>
                <div>
                    {displayedDislikes}
                </div>
                <div>
                    <button onClick={handleDislike} className={clsx(
                        [styles.basicButton],
                        {
                            [styles.dislikeButton]: displayedDislikes == dislikes + 1,
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
