import React, { useEffect, useState } from "react";
import PostSummary from "./post-summary";
import { Post } from "@/utils/posts/definitions";

import styles from "./post-list.module.css";
import { getCurrentUserUrl } from "@/utils/url-segments";
import api from "@/utils/api";
import { fetchHubsIDs } from "@/utils/fetchPrivileges";

interface ComponentProps {
    posts: Post[];
}

/*
    PostList

    This component displays a list of posts that were passed to the component.

    posts: an array or iterable of post objects

    The component displays all posts in the list, so any filtering has to be done
    by the page using the component.
*/

const PostList: React.FC<ComponentProps> = ({ posts }) => {
    const [userId, setUserId] = useState(null);
    const [moddedHubs, setModdedHubs] = useState([]);

    useEffect(() => {
        const getPrivileges = async () => {
            try {
                const response1 = await api.get(getCurrentUserUrl());

                if (response1.status == 200) {
                    setUserId(response1.data.id);
                }

                const response2 = await fetchHubsIDs();

                setModdedHubs(response2);

            } catch (error) {
                alert("Error while looking for user: " + error);
            }
        }

        getPrivileges();
    }, []);

    if (posts == null || posts.length == 0) {
        return <>No posts.</>;
    }

    return (
        <div>
            {
                posts.map((post) => (
                    <div key={post.id} className={styles.postListContainer}>
                        <PostSummary 
                            post={post} 
                            userId={userId} 
                            moddedHubs={moddedHubs}    
                        />
                    </div>
                ))
            }
        </div>
    );
}

export default PostList;
