    "use client";

    import { Post } from "@/utils/posts/definitions";
    import styles from "./post-summary-detailed.module.css";
    import LikeDislikeButtons from "./buttons/like-dislike-buttons";
    import { useEffect, useState } from "react";
    import { checkAuthorPrivileges, checkHubPrivileges } from "@/utils/fetchPrivileges";
    import DeletePostButton from "./buttons/delete-post-button";
    import EditPostButton from "./buttons/edit-post-button";
    import { getDislikePostUrl, getLikePostUrl, getPostTagUrl } from "@/utils/url-segments";
    import  { formatDate } from "@/utils/datetime-conversion";
    import EditedHover from "./others/EditedHover";
    import TagPostButton from "./buttons/tag-post-button";
    import api from "@/utils/api";

    interface ComponentProps {
        post: Post;
    }

    /*
        Post Summary Detailed
        
        This component displays detailed information about a post.

        post: a post object
    */

    const PostSummaryDetailed: React.FC<ComponentProps> = ({ post }) => {
        const [isAuthor, setIsAuthor] = useState(false);
        const [isMod, setIsMod] = useState(false);
        const [refresh, setRefresh] = useState(false);
        const [postTag, setPostTag] = useState(null);

        useEffect(() => {
            const fetchPrivileges = async () => {
                const authorPrivileges = await checkAuthorPrivileges(post.author);
                
                if(authorPrivileges) {
                    setIsAuthor(authorPrivileges);
                    return;
                }

                const hubPrivileges = await checkHubPrivileges(post.hub);
                setIsMod(hubPrivileges);
            }
            fetchPrivileges();

            const fetchPostTag = async () => {
                if(post.tag != null){
                    const response = await api.get(getPostTagUrl(post.tag));
                    setPostTag(response.data);
                } 
            }
            fetchPostTag();
        }, []);

        // Function to refresh the component but not reload the page
        const refreshComponent = () => {
            setRefresh(!refresh);
        };

        return (
            <div className={styles.detailedPostContainer}>
                <div className={styles.detailedPostElement}>
                    <div>
                        {postTag && <h2 style={{backgroundColor:postTag.color}} className={styles.postTag}>{postTag.name}</h2>}
                        <h1>
                            {post.title}
                        </h1>
                        <EditedHover editedDate={post.last_edited}/>
                    </div>
                    <br></br>
                    <div>
                        [Full post thumbnail or image]
                    </div>
                    <br></br>
                    <div>
                        {post.message}
                    </div>
                    <br></br>
                    <div className={styles.detailedPostButtonList}>
                        {isAuthor &&
                            <>
                                <DeletePostButton post={post} />
                                <EditPostButton post={post} refreshComponent={refreshComponent}/>
                                <TagPostButton post={post} setPostTag={setPostTag}/>
                            </>
                        }
                        {!isAuthor && isMod &&
                            <>
                                <DeletePostButton post={post} />
                                <TagPostButton post={post} setPostTag={setPostTag}/>
                                <div></div>
                            </>
                        }
                    </div>
                </div>
                <div className={styles.detailedPostFooterContainer}>
                    <div className={styles.detailedPostElement}>
                        <div>
                            Posted
                        </div>
                        <div>
                            {formatDate(post.timestamp)}
                        </div>
                    </div>
                    <div className={styles.detailedPostElement}>
                        <div>
                            {post.author}
                        </div>
                        <div>
                            {post.hub}
                        </div>
                    </div>
                    <div className={styles.detailedPostElement}>
                        <LikeDislikeButtons 
                            postObject={post}
                            likeUrlFunction={getLikePostUrl} 
                            dislikeUrlFunction={getDislikePostUrl}
                            containerClassName={styles.detailedVoteContainer}/>
                    </div>
                    <div className={styles.detailedPostElement}>
                        [Create Comment]
                    </div>
                </div>
                <div>
                    [Comments]
                </div>
            </div>
        )
    }

    export default PostSummaryDetailed;
