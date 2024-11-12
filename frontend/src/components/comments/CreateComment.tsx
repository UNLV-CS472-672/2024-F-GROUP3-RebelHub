"use client";

import { Post, PostComment } from "@/utils/posts/definitions";
import styles from "./SingleComment.module.css";
import AccountButton from "../navbar/AccountButton";
import CreateCommentForm from "./forms/CreateCommentForm";

interface ComponentProps {
    post: Post;
    onClose: () => void;
    commentReply: PostComment;
}

const CreateComment: React.FC<ComponentProps> = ({ post, onClose, commentReply=null }) => {
    return (
        <div className={styles.createCommentContainer}>
            <CreateCommentForm post={post} onClose={onClose} commentReply={commentReply}/>
        </div>
    );
}

export default CreateComment;
