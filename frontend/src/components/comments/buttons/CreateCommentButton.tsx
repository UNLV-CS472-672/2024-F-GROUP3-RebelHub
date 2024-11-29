"use client";

import styles from "./CommentButtons.module.css";

interface ComponentProps {
    toggleReply: () => void;
    buttonMessage: string;
}

/*
    The CreateCommentButton component does not do anything by itself.
    It is merely a placeholder component to standardize how a create comment button should look.

    It needs to be connected using hooks and states to a CreateCommentForm in order for both components to work correctly.

    buttonMessage: the message displayed on the button
    toggleReply: the set... hook statement
*/

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
