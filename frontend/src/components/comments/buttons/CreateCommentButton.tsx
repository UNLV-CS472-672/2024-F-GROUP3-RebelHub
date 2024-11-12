"use client";

import styles from "./CommentButtons.module.css";

interface ComponentProps {
    toggleReply: () => void;
    buttonMessage: string;
}

const CreateCommentButton: React.FC<ComponentProps> = ({ buttonMessage, toggleReply }) => {
    return (
        <div>
            <button className={styles.basicButton} onClick={toggleReply}>
                {buttonMessage}
            </button>
        </div>
    );
}

export default CreateCommentButton;
