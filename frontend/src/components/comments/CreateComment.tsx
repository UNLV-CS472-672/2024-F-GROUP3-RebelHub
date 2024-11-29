"use client";

import { Post, PostComment } from "@/utils/posts/definitions";
import styles from "./SingleComment.module.css";
import CreateCommentForm from "./forms/CreateCommentForm";

interface ComponentProps {
    post: Post;
    onClose: () => void;
    commentReply: PostComment;
    parentCreate: (create: PostComment) => void;
}

/*
    CreateComment

    This is a dummy component that renders when a user tries to create a comment.
    Rather than using a modal, this is used to give more context as to where the comment is being posted.

    post: the post the comment is being made to
    onClose: the function that will hide this component in the parent
    commentReply: the comment that this comment is replying to. By default, it is null if the comment is directly on a post
    parentCreate: the function that will be called if the comment is created. It should display the new comment without a page refresh
*/

const CreateComment: React.FC<ComponentProps> = ({ post, onClose, commentReply=null, parentCreate }) => {
    return (
        <div className={styles.createCommentContainer}>
            <CreateCommentForm 
                post={post} 
                onClose={onClose} 
                commentReply={commentReply}
                parentCreate={parentCreate}
            />
        </div>
    );
}

export default CreateComment;
