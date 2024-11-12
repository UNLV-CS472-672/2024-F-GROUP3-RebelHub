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
}

const RecursiveComment: React.FC<ComponentProps> = ({ post, currentComment }) => {
    const [repliesToCurrentComment, setReplies] = useState<PostComment[]>([]);

    useEffect(() => {
        const fetchReplies = async () => {
            try {
                const response = await api.get(getReplyListUrl(currentComment.id));

                if(response.status == 200) {
                    console.log("got replies to " + currentComment.id);
                    setReplies(response.data);
                }

            } catch (error) {
                alert(error);
            }
        }

        fetchReplies();
    }, []);

    return (
        <div className={styles.container}>
            <SingleComment comment={currentComment} post={post}/>
            {repliesToCurrentComment.length > 0 && 
                repliesToCurrentComment.map((reply) => (
                    <div className={styles.recursiveContainer} key={reply.id}>
                        <div>
                        </div>
                        <RecursiveComment 
                            currentComment={reply}
                            post={post}
                        />
                    </div>
                ))        
            }
        </div>
    );
}

export default RecursiveComment;
