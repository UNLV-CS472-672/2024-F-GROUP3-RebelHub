"use client";

import React from "react";
import { Post } from "@/utils/posts/definitions";
import { useState, useEffect } from "react";
import LikeDislikeButtons from "./buttons/like-dislike-buttons";
import EditPostButton from "./buttons/edit-post-button";
import {
    displayPicture,
    getCurrentUserUrl,
    getDislikePostUrl,
    getLikePostUrl,
    gotoDetailedPostPage
} from "@/utils/url-segments";
import { displayPicture, getDislikePostUrl, getLikePostUrl, gotoDetailedPostPage, getPostTagUrl } from "@/utils/url-segments";
import Link from "next/link";
import DeletePostButton from "./buttons/delete-post-button";
import styles from "./post-summary.module.css";
import EditedHover from "./others/EditedHover";
import TagPostButton from "./buttons/tag-post-button";
import api from "@/utils/api";

import bStyles from "@/components/posts/buttons/post-buttons.module.css";


interface ComponentProps {
    post: Post;
    userId: number|null;
    moddedHubs: number[];
}

const noImagePath = "/default/No Post Image.png";

/*
    Post Summary

    This component displays some basic information about a post.

    post: a post object
*/

const PostSummary: React.FC<ComponentProps> = ({ post, userId, moddedHubs }) => {
    const [isAuthor, setIsAuthor] = useState(false);
    const [isMod, setIsMod] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const[username,setUsername]=useState("");
    const[hubName,setHubName]=useState("");
    const [postTag, setPostTag] = useState(null);



    useEffect(() => {
        if (userId != null) {
            console.log(userId);
            setIsAuthor(post.author == userId);
            const getUsername =async()=>{
                try{
                const response=await api.get(`api/users/${post.author}/info/`);
                console.log(response.data.username)
                setUsername(response.data.username)

            } catch(error){
                alert(error)
            }
            }
            const getHubName=async()=> {
                try {
                const response = await api.get(`api/hubs/${post.hub}`);
                console.log(response.data);
                setHubName(response.data.name)
            }catch(error)
            {
                alert(error)
            }

            }
            getUsername();
            getHubName();
            console.log(username)
        }

    }, [userId]);

    useEffect(() => {
        setIsMod(moddedHubs.includes(post.hub));
    }, [moddedHubs]);

    useEffect(() => {
        const fetchPostTag = async () => {
            if (post.tag != null) {
                const response = await api.get(getPostTagUrl(post.tag));
                setPostTag(response.data);
            } else {
                setPostTag(null);
            }
        };

        fetchPostTag();
    }, [post.tag]);

    const refreshComponent = () => {
        setRefresh(!refresh);
    }

    return (
        <div className={styles.postContainer}>

            <div>
                <Link href={gotoDetailedPostPage(post.id)}>
                    {post.pictures.length > 0 ? (
                        <img src={displayPicture(post.pictures[0][1])} className={styles.postThumbnail}/>
                    ) : (
                        <img src={noImagePath} className={styles.postThumbnail}/>
                    )
                    }
                </Link>
                <div className={styles.usernameContainer}>
                    {username}
                </div>

            </div>
            <div>
                <div className={styles.textContainer}>
                    <div className={styles.hubNameContainer}>
                        h/{hubName}
                    </div>
                    <div className={styles.postTitle}>
                        <div className={styles.postTitleComponent}>
                            <Link href={gotoDetailedPostPage(post.id)}>
                            <span>
                                {postTag && <h2 style={{backgroundColor:postTag.color}} className={styles.postTag}>{postTag.name}</h2>}
                                    <h2 className={styles.postTitle}>
                                        {post.title}
                                    </h2>
                            </span>
                            </Link>
                        </div>
                        <div className={styles.postTitleComponent}>
                            <EditedHover editedDate={post.last_edited}/>
                        </div>

                    </div>
                    <div className={bStyles.buttonHorizontalList}>
                        <div className={bStyles.buttonsLeft}>  
                            <LikeDislikeButtons 
                                postObject={post} 
                                likeUrlFunction={getLikePostUrl} 
                                dislikeUrlFunction={getDislikePostUrl}
                                containerClassName={styles.summaryVoteContainer}
                            />
                        </div>
                        {isAuthor &&
                            <div className={bStyles.buttonsRight}>
                                <EditPostButton post={post} refreshComponent={refreshComponent}/>
                                <DeletePostButton post={post}/>
                                <DeletePostButton post={post} />
                                <TagPostButton post={post} refreshComponent={refreshComponent}/>
                            </div>
                        }
                        {!isAuthor && isMod &&
                            <div className={bStyles.buttonsRight}>
                                <DeletePostButton post={post} />
                                <TagPostButton post={post} refreshComponent={refreshComponent}/>
                            </div>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PostSummary;