"use client";

import { useState } from "react";
import styles from "./CommentButtons.module.css";
import DeleteModal from "@/components/posts/modals/delete-modal";
import { getDeleteCommentUrl } from "@/utils/url-segments";
import { PostComment } from "@/utils/posts/definitions";
import api from "@/utils/api";

interface ComponentProps {
    comment: PostComment;
}

const DeleteCommentButton: React.FC<ComponentProps> = ({ comment }) => {
    const [showModal, setShowModal] = useState(false);

    const deleteComment = async (commentId: number|string) => {
        try {
            console.log("Deleting comment");

            const response = await api.delete(getDeleteCommentUrl(commentId));

            if(response.status == 204) {
                setShowModal(false);
                window.location.reload();
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
