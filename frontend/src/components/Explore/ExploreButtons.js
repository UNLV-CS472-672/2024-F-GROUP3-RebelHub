import styles from "./Explore.module.css";
import { useState, useEffect } from "react";
import api from "../../utils/api";
import { getExploreListUrl } from "@/utils/url-segments";

const ExploreButtons = ({posts, setPosts}) => {
    const [sort, setSort] = useState('-likes'); // -likes = top, timestamp = old, -timestamp = new
    const [time, setTime] = useState('week');
    const [currentSortButton, setCurrentSortButton] = useState('-likes');
    const [currentTimeButton, setCurrentTimeButton] = useState('week');

    // Done so that we can change the sort all in the frontend (without api call)
    const changeSort = (newSort) => {
        if(sort === newSort && newSort != 'random') return;
        setSort(newSort);
        let sortedPosts = [...posts];
        if (newSort === '-likes') sortedPosts.sort((a, b) => b.likes.length - a.likes.length);
        else if (newSort === 'timestamp') sortedPosts.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        else if (newSort === '-timestamp') sortedPosts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        else if (newSort === 'random') sortedPosts.sort(() => Math.random() - 0.5);
        setPosts(sortedPosts); 
        setCurrentSortButton(newSort);
    };

    const changeTime = async (newTime) => {
        if(time === newTime) return;
        console.log("Fetching explore page posts...");
        try {
            const response = await api.get(getExploreListUrl(newTime, sort));
            setTime(newTime);
            setPosts(response.data);
            console.log(response.data);
            console.log("Successful fetch");
        } catch (error) { console.log("Error fetching explore page posts: ", error); }
        setCurrentTimeButton(newTime);
    }

    return(
        <div className={styles.buttons}>
            <button
                className={`${currentSortButton === 'random' ? styles.current : ''}`}
                onClick={() => changeSort('random')}
            >
                Random
            </button>
            <button
                className={`${currentSortButton === '-likes' ? styles.current : ''}`}
                onClick={() => changeSort('-likes')}
            >
                Top
            </button>
            <button
                className={`${currentSortButton === 'timestamp' ? styles.current : ''}`}
                onClick={() => changeSort('timestamp')}
            >
                Old
            </button>
            <button
                className={`${currentSortButton === '-timestamp' ? styles.current : ''}`}
                onClick={() => changeSort('-timestamp')}
            >
                New
            </button>
            <button
                className={`${currentTimeButton === '24_hours' ? styles.current : ''}`}
                onClick={() => changeTime('24_hours')}
            >
                24 Hours
            </button>
            <button
                className={`${currentTimeButton === 'week' ? styles.current : ''}`}
                onClick={() => changeTime('week')}
            >
                Week
            </button>
            <button
                className={`${currentTimeButton === 'month' ? styles.current : ''}`}
                onClick={() => changeTime('month')}
            >
                Month
            </button>
            <button
                className={`${currentTimeButton === 'year' ? styles.current : ''}`}
                onClick={() => changeTime('year')}
            >
                Year
            </button>
            <button
                className={`${currentTimeButton === 'all_time' ? styles.current : ''}`}
                onClick={() => changeTime('all_time')}
            >
                All Time
            </button>
        </div>
    );
}

export default ExploreButtons;