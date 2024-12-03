"use client";

import { Post } from "@/utils/posts/definitions";
import styles from "./post-summary-detailed.module.css";
import LikeDislikeButtons from "./buttons/like-dislike-buttons";
import { useEffect, useState } from "react";
import { checkAuthorPrivileges, checkHubPrivileges } from "@/utils/fetchPrivileges";
import DeletePostButton from "./buttons/delete-post-button";
import EditPostButton from "./buttons/edit-post-button";
import { displayPicture, getDislikePostUrl, getHubUrl, getLikePostUrl, getPostTagUrl, gotoHubPage } from "@/utils/url-segments";
import RecursiveCommentList from "../comments/RecursiveCommentList";
import CreateCommentButton from "../comments/buttons/CreateCommentButton";
import  { formatDate } from "@/utils/datetime-conversion";
import EditedHover from "./others/EditedHover";
import TagPostButton from "./buttons/tag-post-button";
import api from "@/utils/api";
import AccountButton from "../navbar/AccountButton";
import Link from "next/link";

    interface ComponentProps {
        post: Post;
    }

    /*
        Post Summary Detailed
        
        This component displays detailed information about a post.

        post: a post object
    */

    const PostSummaryDetailed: React.FC<ComponentProps> = ({ post }) => {
        const [showCreateComment, setShowCreateComment] = useState(false);
    const [isAuthor, setIsAuthor] = useState(false);
        const [isMod, setIsMod] = useState(false);
        const [refresh, setRefresh] = useState(false);
        const [postTag, setPostTag] = useState(null);
    const [hubName, setHubName] = useState("");

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
    
        const fetchHubName = async () => {
            try {
                const response = await api.get(getHubUrl(post.hub));
            
                if (response.status == 200) {
                    setHubName(response.data.name);
                }
            } catch (error) {
                console.log("Failed to get hub info");
            }
        }

        fetchHubName();
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
                {postTag && <h2 style={{backgroundColor:postTag.color}} className={styles.postTag}>{postTag.name}</h2>}
                <h1>
                    {post.title}
                </h1>
                <div style={{'display': 'flex', 'gap': '10px'}}>
                    <div>
                        Posted on {formatDate(post.timestamp)}
                    </div>
                    {post.last_edited != null &&
                        <EditedHover editedDate={post.last_edited}/>
                    }
                    <div>
                        in
                    </div>
                    <Link href={gotoHubPage(post.hub)}>
                        {hubName != "" ? (
                            <div className={styles.hubLink}>
                                {hubName}
                            </div>
                        ) : (
                            <div className={styles.hubLink}>
                                Hub {post.hub}
                            </div>
                        )} 
                    </Link>
                </div>
                <AccountButton username={post.author} darkTheme={true} noBackground={true} />
                {post.pictures.length > 0 &&
                    <div className={styles.imageContainer}>
                        <img src={displayPicture(post.pictures[0][1])} className={styles.image}/>
                    </div>
                }
                <div>
                    {post.message}
                </div>
                <div className={styles.detailedPostButtonList}>
                    <div className={styles.buttonsLeft}>
                        <LikeDislikeButtons 
                            postObject={post}
                            likeUrlFunction={getLikePostUrl} 
                            dislikeUrlFunction={getDislikePostUrl}
                            containerClassName={styles.detailedVoteContainer}
                        />
                    </div>
                    <div className={styles.buttonsRight}>
                    {isAuthor &&
                        <>
                            <EditPostButton post={post} refreshComponent={refreshComponent} />
                            <DeletePostButton post={post} />
                            <TagPostButton post={post} refreshComponent={refreshComponent}/>
                        </>
                    }
                    {!isAuthor && isMod &&
                        <>
                            <DeletePostButton post={post} />
                            <TagPostButton post={post} refreshComponent={refreshComponent}/>
                        </>
                    }
                        <CreateCommentButton 
                            toggleReply={() => setShowCreateComment(!showCreateComment)}
                            buttonMessage={"Create Comment"}
                        />
                    </div>
                </div>
            </div>
            <div>
                <RecursiveCommentList 
                    post={post} 
                    showCreateComment={showCreateComment} 
                    setShowCreateComment={setShowCreateComment}
                />
            </div>
        </div>
    )
}

    export default PostSummaryDetailed;
