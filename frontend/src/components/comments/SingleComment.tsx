"use client";

import { Post, PostComment } from "@/utils/posts/definitions";
import styles from "./SingleComment.module.css";
import recursiveStyles from "./RecursiveComment.module.css";
import LikeDislikeButtons from "../posts/buttons/like-dislike-buttons";
import { getLikeCommentUrl, getDislikeCommentUrl } from "@/utils/url-segments";
import AccountButton from "@/components/navbar/AccountButton";
import { useState } from "react";
import CreateCommentButton from "./buttons/CreateCommentButton";
import CreateComment from "./CreateComment";
import DeleteCommentButton from "./buttons/DeleteCommentButton";

interface ComponentProps {
    post: Post;
    comment: PostComment;
    showButtons?: boolean;
}

const SingleComment: React.FC<ComponentProps> = ({ post, comment, showButtons=true }) => {
    const [showCreateComment, setShowCreateComment] = useState(false);

    return (
        <div>
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
                        [Edit]
                        <DeleteCommentButton comment={comment}/>
                        <CreateCommentButton toggleReply={() => setShowCreateComment(!showCreateComment)} buttonMessage="Reply"/>
                    </div>
                </div>
                <div className={styles.commentMessageContainer}>
                    <div>
                        {comment.message}
                    </div>
                </div>
            </div>
            {showCreateComment &&
                <div className={recursiveStyles.recursiveContainer}>
                    <div></div>
                    <CreateComment post={post} onClose={() => setShowCreateComment(false)} commentReply={comment} />
                </div>
            }
        </div>
    );
}

export default SingleComment;
