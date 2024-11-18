"use client";

import api from "@/utils/api";
import { Post, PostComment } from "@/utils/posts/definitions";
import { getCommentsListUrl } from "@/utils/url-segments";
import { useEffect, useState } from "react";
import RecursiveComment from "./RecursiveComment";
import styles from "./RecursiveCommentList.module.css";
import CreateComment from "./CreateComment";
import ShowMoreButton from "./buttons/ShowMoreButton";

interface ComponentProps {
    post: Post;
    showCreateComment: boolean;
    setShowCreateComment: (state: boolean) => void;
    commentsToPrint?: number;
}

/*
    RecursiveCommentList

    This component displays all or some of the comments on a post. It requires a specific format to display correctly.

    post: the post of the comments that should be rendered
    showCreateComment: a state boolean that determines if the CreateComment component should be displayed
    setShowCreateComment: a hook function that determines when to close the CreateComment component
    commentsToPrint: a currently meaningless parameter that makes the list only show the first x base comments. The
        replies are not limited by this number.
    
    
    Unlike most components, this component needs some setup to work correctly. Here is an example of a correct
    way to use this component:

    const MyComponent = () => {
        const[showCreateComment, setShowCreateComment] = useState(false);

        ...

        return (
            ...
            <CreateCommentButton
                toggleReply={() => setShowCreateComment(!showCreateComment)}
                buttonMessage={"Create"}
            />
            <RecursiveCommentList
                post={post}
                showCreateComment={showCreateComment}
                setShowCreateComment={setShowCreateComment}
            />
        );
    }
    
    Basically, this component needs an outside hook and some kind of button to toggle the hook.
*/

const RecursiveCommentList: React.FC<ComponentProps> = ({ post, showCreateComment, setShowCreateComment, commentsToPrint=5 }) => {
    const [allComments, setAllComments] = useState<PostComment[]>([]);
    const [displayComments, setDisplayComments] = useState<PostComment[]>([]);

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const response = await api.get(getCommentsListUrl(post.id));

                if(response.status == 200) {
                    console.log("got comment list");

                    setAllComments(response.data);

                    // Decide whether to print all base comments or just a specific amount
                    if(response.data.length > commentsToPrint) {
                        setDisplayComments(response.data.slice(0, commentsToPrint));
                    } else {
                        setDisplayComments(response.data);
                    }
                    
                }

            } catch (error) {
                alert(error);
            }    
        }

        fetchComments();
    }, []);

    // Function to add a new comment to the list
    const newComment = (newComment: PostComment) => {
        setDisplayComments((previousComments) => [newComment, ...previousComments]);
        setAllComments((previousComments) => [newComment, ...previousComments]);
    }

    // Function to delete a comment in the list
    const deleteComment = (deletedComment: PostComment) => {
        setDisplayComments((previousComments) => previousComments.filter((comment) => comment.id !== deletedComment.id));
        setAllComments((previousComments) => previousComments.filter((comment) => comment.id !== deletedComment.id));
    }

    return (
        <div>
            {showCreateComment && 
                <div className={styles.createComment}>
                    <CreateComment 
                        post={post} 
                        onClose={() => setShowCreateComment(false)} 
                        commentReply={null} 
                        parentCreate={newComment}
                    />
                </div>
            }
            {
                displayComments.map((comment) => (
                    <div className={styles.listContainer} key={comment.id}>
                        <RecursiveComment 
                            post={post} 
                            currentComment={comment} 
                            parentDelete={deleteComment}
                        />
                    </div>
                ))
            }
            {displayComments.length < allComments.length &&
                <div className={styles.showMoreComments}>
                    <ShowMoreButton
                        displayList={displayComments}
                        fullList={allComments}
                        setDisplayList={setDisplayComments}
                        message="Show more comments..."
                        increment={3}
                    />
                </div>
            }
        </div>
    );
}

export default RecursiveCommentList;
