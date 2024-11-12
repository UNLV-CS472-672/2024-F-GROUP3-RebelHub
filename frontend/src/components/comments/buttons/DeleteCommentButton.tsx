"use client";

import { useState } from "react";
import styles from "./CommentButtons.module.css";
import DeleteModal from "@/components/posts/modals/delete-modal";
import { getDeleteCommentUrl } from "@/utils/url-segments";
import { PostComment } from "@/utils/posts/definitions";
import api from "@/utils/api";

interface ComponentProps {
    comment: PostComment;
    parentDelete: (del: PostComment) => void;
}

/*
    DeleteCommentButton

    Used to delete a comment from the database and update the hooks that show the comments on a post.

    comment: the comment that is being deleted
    parentDelete: the function that should call the set... hook function in the parent of the comment
*/

const DeleteCommentButton: React.FC<ComponentProps> = ({ comment, parentDelete }) => {
    const [showModal, setShowModal] = useState(false);

    const deleteComment = async (commentId: number|string) => {
        try {
            console.log("Deleting comment");

            const response = await api.delete(getDeleteCommentUrl(commentId));

            if(response.status == 204) {
                setShowModal(false);
                parentDelete(comment);
            }

        } catch (error) {
            alert(error);
        }
    }

    return (
        <div>
            <button className={styles.basicButton} onClick={() => setShowModal(true)}>
                Delete
            </button>
            {
                showModal && 
                <DeleteModal
                    warningMessage={"Are you sure you want to delete this comment?"}
                    deleteButtonName={"Delete Comment"}
                    cancelButtonName={"Cancel"}
                    id={comment.id}
                    deleteFunction={() => deleteComment(comment.id)}
                    onClose={() => setShowModal(false)}
                />
            }
        </div>
    );
}

export default DeleteCommentButton;
