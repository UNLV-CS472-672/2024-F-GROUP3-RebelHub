"use client";

import { Post, PostComment } from "@/utils/posts/definitions";
import SingleComment from "./SingleComment";
import styles from "./RecursiveComment.module.css";
import { useEffect, useState } from "react";
import { getReplyListUrl } from "@/utils/url-segments";
import api from "@/utils/api";
import React from "react";
import ShowMoreButton from "./buttons/ShowMoreButton";

interface ComponentProps {
    post: Post;
    currentComment: PostComment;
    parentDelete: (del: PostComment) => void;
    repliesToPrint?: number;
}

/*
    RecursiveComment

    This component displays the comment, and then it fetches the replies to the current comment.
    If it finds replies, then it creates a list of recursive comments, one for each reply.

    The component uses its own reply functions to keep track of replies when the user
    changes things.

    post: the post of the comment
    currentComment: the comment/reply that is going to be displayed by the SingleComment
    parentDelete: the replyDelete from the parent. Since the current comment is a reply to a parent comment,
        we need to call the parent's function.
    
    We don't pass createReply recursively because the recursive comment, this component, is what keeps track of
    the replies. The single comment gets passed this function as it is the comment that will be replied to.
*/

const RecursiveComment: React.FC<ComponentProps> = ({ post, currentComment, parentDelete, repliesToPrint=3 }) => {
    const [displayReplies, setDisplayReplies] = useState<PostComment[]>([]);
    const [allReplies, setAllReplies] = useState<PostComment[]>([]);

    useEffect(() => {
        const fetchReplies = async () => {
            try {
                const response = await api.get(getReplyListUrl(currentComment.id));

                if(response.status == 200) {
                    setAllReplies(response.data);

                    // Decide whether to print all replies or just a certain amount
                    if (response.data.length > repliesToPrint) {
                        setDisplayReplies(response.data.slice(0, repliesToPrint));
                    } else {
                        setDisplayReplies(response.data);
                    }

                }

            } catch (error) {
                alert(error);
            }
        }

        fetchReplies();
    }, []);

    // Function to create a reply to the current comment
    const createReply = (newReply: PostComment) => {
        setDisplayReplies((previousReplies) => [newReply, ...previousReplies]);
        setAllReplies((previousReplies) => [newReply, ...previousReplies]);
        
    }

    // Function to delete a reply to the current comment
    const deleteReply = (deletedReply: PostComment) => {
        setDisplayReplies((previousReplies) => previousReplies.filter((reply) => reply.id !== deletedReply.id));
        setAllReplies((previousReplies) => previousReplies.filter((reply) => reply.id !== deletedReply.id));
    }

    return (
        <div className={styles.container}>
            <SingleComment 
                comment={currentComment} 
                post={post} 
                parentCreate={createReply}
                parentDelete={parentDelete}
            />
            {
                displayReplies.map((reply) => (
                    <div className={styles.recursiveContainer} key={reply.id}>
                        <div>
                            {/* This is the empty div for the indentation. */}
                        </div>
                        <RecursiveComment 
                            currentComment={reply}
                            post={post}
                            parentDelete={deleteReply}
                        />
                    </div>
                ))        
            }
            {displayReplies.length < allReplies.length &&
                <div className={styles.recursiveContainer}>
                    <div>
                        {/* This is the empty div for the indentation. */}
                    </div>
                    <ShowMoreButton 
                        displayList={displayReplies}
                        fullList={allReplies}
                        setDisplayList={setDisplayReplies}
                        message="Show more replies..."
                        increment={3}
                    />
                </div>
            }
        </div>
    );
}

export default RecursiveComment;
