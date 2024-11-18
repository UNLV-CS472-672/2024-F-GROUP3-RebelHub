"use client";

import { Post, PostComment } from "@/utils/posts/definitions";
import styles from "./SingleComment.module.css";
import recursiveStyles from "./RecursiveComment.module.css";
import LikeDislikeButtons from "../posts/buttons/like-dislike-buttons";
import { getLikeCommentUrl, getDislikeCommentUrl } from "@/utils/url-segments";
import AccountButton from "@/components/navbar/AccountButton";
import { useEffect, useState } from "react";
import CreateCommentButton from "./buttons/CreateCommentButton";
import CreateComment from "./CreateComment";
import DeleteCommentButton from "./buttons/DeleteCommentButton";
import { checkAuthorPrivileges, checkHubPrivileges } from "@/utils/fetchPrivileges";

interface ComponentProps {
    post: Post;
    comment: PostComment;
    parentCreate: (create: PostComment) => void;
    parentDelete: (del: PostComment) => void;
    showButtons?: boolean;
}

/*
    SingleComment

    Displays a single comment along with all the necessary components.

    post: the post the comment is on
    comment: the comment that is being displayed
    parentUpdate: used to change the information in the current comment so the parent can render the changes
    parentCreate: used to create a reply to the current comment
    parentDelete: used to delete the current comment
    showButtons: used to show the likes/dislikes buttons or just show some text
*/

const SingleComment: React.FC<ComponentProps> = ({ post, comment, parentCreate, parentDelete, showButtons=true }) => {
    const [showCreateComment, setShowCreateComment] = useState(false);
    const [isAuthor, setIsAuthor] = useState(false);
    const [isMod, setIsMod] = useState(false);

    useEffect(() => {
        const fetchPrivileges = async () => {
            const authorPrivileges = await checkAuthorPrivileges(comment.author);
            
            if(authorPrivileges) {
                setIsAuthor(authorPrivileges);
                return;
            }

            const hubPrivileges = await checkHubPrivileges(post.hub);
            setIsMod(hubPrivileges);
        }

        fetchPrivileges();
    }, []);

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
                        {isAuthor &&  
                            <>
                                [Edit]
                                <DeleteCommentButton comment={comment} parentDelete={parentDelete} />
                            </>
                        }
                        {!isAuthor && isMod &&
                            <>
                                <div></div>
                                <DeleteCommentButton comment={comment} parentDelete={parentDelete} />
                            </>
                        }
                        <CreateCommentButton toggleReply={() => setShowCreateComment(!showCreateComment)} buttonMessage="Reply"/>
                    </div>
                </div>
                <div>
                    {comment.message}
                </div>
            </div>
            {showCreateComment &&
                <div className={recursiveStyles.recursiveContainer}>
                    <div></div>
                    <CreateComment 
                        post={post} 
                        onClose={() => setShowCreateComment(false)} 
                        commentReply={comment}
                        parentCreate={parentCreate}
                    />
                </div>
            }
        </div>
    );
}

export default SingleComment;
