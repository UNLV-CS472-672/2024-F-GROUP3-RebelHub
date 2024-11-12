"use client";

import api from "@/utils/api";
import { Post, PostComment } from "@/utils/posts/definitions";
import { getCommentsListUrl } from "@/utils/url-segments";
import { useEffect, useState } from "react";
import RecursiveComment from "./RecursiveComment";
import styles from "./RecursiveCommentList.module.css";

interface ComponentProps {
    post: Post;
    commentsToPrint?: number;
}

const RecursiveCommentList: React.FC<ComponentProps> = ({ post, commentsToPrint=null }) => {
    const [comments, setComments] = useState<PostComment[]>([]);

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const response = await api.get(getCommentsListUrl(post.id));

                if(response.status == 200) {
                    console.log("got comment list");

                    // Decide whether to print all base comments or just a specific amount
                    if(commentsToPrint == null || commentsToPrint >= response.data.length) {
                        setComments(response.data);
                    } else {
                        setComments(response.data.slice(0, commentsToPrint));
                    }
                    
                }

            } catch (error) {
                alert(error);
            }    
        }

        fetchComments();
    }, []);

    return (
        <div>
            {
                comments.map((comment) => (
                    <div className={styles.listContainer} key={comment.id}>
                        <RecursiveComment post={post} currentComment={comment} />
                    </div>
                ))
            }
        </div>
    );
}

export default RecursiveCommentList;
