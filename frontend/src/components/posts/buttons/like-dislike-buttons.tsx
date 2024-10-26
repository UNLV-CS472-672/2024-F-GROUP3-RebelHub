import React from "react";
import LikeButton from "./like-button";

import styles from "../posts.module.css";

interface ComponentProps {
    objectId: number;
    likes: number;
    dislikes: number;
    likeUrlFunction: (objectId: number) => string;
    dislikeUrlFunction: (objectId: number) => string;
}

const LikeDislikeButtons: React.FC<ComponentProps> = ({ objectId, likes, dislikes, likeUrlFunction, dislikeUrlFunction }) => {
    return (
        <>
            <div className={styles.postLikeCounter}>
                <LikeButton objectId={objectId} voteCount={likes} isLikeButton={true} buttonTitle="Like" likeUrlFunction={likeUrlFunction} dislikeUrlFunction={dislikeUrlFunction}/>
            </div>
            <br></br>
            <div className={styles.postDislikeCounter}>
                <LikeButton objectId={objectId} voteCount={dislikes} isLikeButton={false} buttonTitle="Dislike" likeUrlFunction={likeUrlFunction} dislikeUrlFunction={dislikeUrlFunction}/>
            </div>
        </>
    )
}

export default LikeDislikeButtons;