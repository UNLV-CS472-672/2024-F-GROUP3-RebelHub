"use client";

import clsx from "clsx";
import React from "react";

import { useState } from "react";

import styles from "../posts.module.css";
import api from "@/utils/api";

interface ComponentProps {
    objectId: number;
    voteCount: number
    isLikeButton: boolean;
    buttonTitle: string;
    likeUrlFunction: (objectId: number) => string;
    dislikeUrlFunction: (objectId: number) => string;
}

const LikeButton: React.FC<ComponentProps> = ({ objectId, voteCount, isLikeButton, buttonTitle, likeUrlFunction, dislikeUrlFunction }) => {
    const [data, setData] = useState(voteCount);

    // TODO: will also need to check if the user voted here to reduce the voteCount
    // parameter by 1. This will make the buttons light up correctly.

    const handlePost = async () => {
        // TODO: check if the post was already liked by the user
        // If it is, then subtract 1 from votecount and tell server to reduce by 1
        // Else, tell server to add 1.
        
        // This will make the likes/dislikes appear correct client-side,
        // but the database will still see multiple like/dislike posts.
        if (data === voteCount)
            setData(voteCount + 1);
        else 
            setData(voteCount);

        try {
            console.log("Like change for " + objectId);
            const response = await api.post(isLikeButton ? likeUrlFunction(objectId) : dislikeUrlFunction(objectId), {
                post_id: objectId,
            });

            if (response.status != 200) {
                throw new Error("Error when posting a vote");
            }
            
        } catch (error) {
            console.log("error posting a like: " + error);
        }
    };

    // Clsx is used to change the color of the button based on its status
    
    return (
        <>
            {data}{" "}
            <button onClick={handlePost} className={clsx(
                [styles.basicButton],
                {
                    [styles.likeButton]: isLikeButton && data === voteCount + 1,
                    [styles.dislikeButton]: !isLikeButton && data === voteCount + 1,
                },
            )}>
            {buttonTitle}
            </button>
        </>
    );
}

export default LikeButton;