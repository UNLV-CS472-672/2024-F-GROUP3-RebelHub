"use client";

import { Post, PostComment } from "@/utils/posts/definitions";
import SingleComment from "./SingleComment";
import styles from "./RecursiveComment.module.css";
import { useEffect, useState } from "react";
import { getReplyListUrl } from "@/utils/url-segments";
import api from "@/utils/api";
import React from "react";

interface ComponentProps {
    post: Post;
    currentComment: PostComment;
    parentUpdate: (update: PostComment) => void;
    parentDelete: (del: PostComment) => void;
}

/*
    RecursiveComment

    This component displays the comment, and then it fetches the replies to the current comment.
    If it finds replies, then it creates a list of recursive comments, one for each reply.

    The component uses its own reply functions to keep track of replies when the user
    changes things.

    post: the post of the comment
    currentComment: the comment/reply that is going to be displayed by the SingleComment
    parentUpdate: the replyUpdate from the parent. Since the current comment is a reply to a parent comment,
        we need to call the parent's update function as the parent has the list of replies that includes the current comment.
    parentDelete: the replyDelete from the parent. Since the current comment is a reply to a parent comment,
        we need to call the parent's function.
    
    We don't pass createReply recursively because the recursive comment, this component, is what keeps track of
    the replies. The single comment gets passed this function as it is the comment that will be replied to.
*/

const RecursiveComment: React.FC<ComponentProps> = ({ post, currentComment, parentDelete, parentUpdate }) => {
    const [repliesToCurrentComment, setReplies] = useState<PostComment[]>([]);

    useEffect(() => {
        const fetchReplies = async () => {
            try {
                const response = await api.get(getReplyListUrl(currentComment.id));

                if(response.status == 200) {
                    setReplies(response.data);
                }

            } catch (error) {
                alert(error);
            }
        }

        fetchReplies();
    }, []);

    // Function to update a reply to the current comment
    const updateReply = (updatedReply: PostComment) => {
        setReplies((previousReplies) => previousReplies.map((reply) => reply.id === updatedReply.id ? updatedReply : reply));
    }

    // Function to create a reply to the current comment
    const createReply = (newReply: PostComment) => {
        setReplies((previousReplies) => [newReply, ...previousReplies]);
    }

    // Function to delete a reply to the current comment
    const deleteReply = (deletedReply: PostComment) => {
        setReplies((previousReplies) => previousReplies.filter((reply) => reply.id !== deletedReply.id));
    }

    return (
        <div className={styles.container}>
            <SingleComment 
                comment={currentComment} 
                post={post} 
                parentCreate={createReply}
                parentDelete={parentDelete}
                parentUpdate={parentUpdate}
            />
            {repliesToCurrentComment.length > 0 && 
                repliesToCurrentComment.map((reply) => (
                    <div className={styles.recursiveContainer} key={reply.id}>
                        <div>
                        </div>
                        <RecursiveComment 
                            currentComment={reply}
                            post={post}
                            parentDelete={deleteReply}
                            parentUpdate={updateReply}
                        />
                    </div>
                ))        
            }
        </div>
    );
}

export default RecursiveComment;
