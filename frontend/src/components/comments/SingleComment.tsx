"use client";

import { PostComment } from "@/utils/posts/definitions";
import styles from "./SingleComment.module.css";
import LikeDislikeButtons from "../posts/buttons/like-dislike-buttons";
import { getLikeCommentUrl, getDislikeCommentUrl } from "@/utils/url-segments";
import AccountButton from "@/components/navbar/AccountButton";

interface ComponentProps {
    comment: PostComment;
    showButtons?: boolean;
}

const SingleComment: React.FC<ComponentProps> = ({ comment, showButtons=true }) => {

    return (
        <div className={styles.container}>
            <div className={styles.headerContainer}>
                <div className={styles.profileBackground}>
                    <AccountButton username={comment.author} darkTheme={true}/>    
                </div>
                <LikeDislikeButtons 
                    postObject={comment} 
                    likeUrlFunction={getLikeCommentUrl} 
                    dislikeUrlFunction={getDislikeCommentUrl}
                    containerClassName={styles.voteContainer}
                    showButtons={showButtons}
                />
                <div className={styles.buttonList}>
                    [Edit] [Delete] [Reply]
                </div>
            </div>
            <div className={styles.commentMessageContainer}>
                <div>
                    {comment.message}
                </div>
                
            </div>
        </div>
    );
}

export default SingleComment;
