"use client";
import { useState, useEffect } from "react";
import styles from "./Explore.module.css";
import api from "../../utils/api";
import { } from "../../utils/fetchPrivileges";
import { getExploreListUrl } from "@/utils/url-segments";

const Explore = () => {
    const [time, setTime] = useState('week');
    const [sort, setSort] = useState('-likes'); // -likes = top, timestamp = old, -timestamp = new
    const [posts, setPosts] = useState([]);


    // Fetches posts from API
    useEffect(() => {
        console.log("Fetching initial explore page posts...");
        const fetchInitialPosts = async () => {
            try {
                const response = await api.get(getExploreListUrl('all_time', '-likes')); // Week time range and sort by top are default
                setPosts(response.data);
                console.log(response.data);
                console.log("Successful fetch");
            } catch (error) { console.log("Error fetching initial explore page posts: ", error); }
        };
        fetchInitialPosts();
    }, []);

    // Done so that we can change the sort all in the frontend (without api call)
    const changeSort = (newSort) => {
        setSort(newSort);
        if(newSort === '-likes') setPosts(posts.sort((a, b) => b.likes.length - a.likes.length));
        else if(newSort === 'timestamp') setPosts(posts.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp)));
        else if(newSort === '-timestamp') setPosts(posts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)));
        // else if (sort === "hot") setPosts(posts.sort((a, b) => b.popularity - a.popularity);
    }

    const changeTime = async (newTime) => {
        console.log("Fetching explore page posts...");
        try {
            const response = await api.get(getExploreListUrl(newTime, sort));
            setPosts(response.data);
            console.log(response.data);
            console.log("Successful fetch");
        } catch (error) { console.log("Error fetching explore page posts: ", error); }
    }

    return (
        <div>
            <p style={{color: 'black'}}>This is the explore page for posts.</p>
            <button className={styles["top"]} onClick={() => { changeSort('-likes') }}>
                top
            </button>
            <button className={styles["old"]} onClick={() => { changeSort('timestamp') }}>
                old
            </button>
            <button className={styles["new"]} onClick={() => { changeSort('-timestamp') }}>
                new
            </button>
            <button className={styles["pastDay"]} onClick={() => { setTime('24_hours'); changeTime('24_hours'); }}>
                Past 24 Hours
            </button>
            <button className={styles["allTime"]} onClick={() => { setTime('all_time'); changeTime('all_time'); }}>
                All Time
            </button>
            <ul className={styles["posts"]}>
                {posts.map((post) => (
                  <p className={styles["post"]}>
                    {post.title}
                  </p> 
                ))}
            </ul>
            
        </div>
    );

};

export default Explore;
