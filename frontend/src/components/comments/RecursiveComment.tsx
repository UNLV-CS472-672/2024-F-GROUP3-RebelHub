"use client";

import { PostComment } from "@/utils/posts/definitions";
import SingleComment from "./SingleComment";
import styles from "./RecursiveComment.module.css";
import { useEffect, useState } from "react";
import { getReplyListUrl } from "@/utils/url-segments";
import api from "@/utils/api";

interface ComponentProps {
    currentComment: PostComment;
}

const RecursiveComment: React.FC<ComponentProps> = ({ currentComment }) => {
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
            <SingleComment comment={currentComment} />
            {repliesToCurrentComment.length > 0 && 
                repliesToCurrentComment.map((reply) => (
                    <div className={styles.recursiveContainer} key={reply.id}>
                        <div>
                        </div>
                        <RecursiveComment 
                            currentComment={reply}
                        />
                    </div>
                ))        
            }
        </div>
    );
}

export default RecursiveComment;
