import styles from "./FilterButtons.module.css";
import { useState } from "react";
import api from "../api";
import set_hot_score from "./set-hot-score.js";

const FilterButtons = ({posts, setPosts, postsUrl}) => {
    const [time, setTime] = useState('week');
    const [sort, setSort] = useState('top'); 
    const [currentTimeButton, setCurrentTimeButton] = useState('week');
    const [currentSortButton, setCurrentSortButton] = useState('top');
    const allowed_sorts = ['hot', 'top', 'old', 'new', 'random'];
    const allowed_times = ['24_hours', 'week', 'month', 'year', 'all_time'];
    
    const changeTime = async (newTime) => {
        if(time === newTime) return;
        console.log("Fetching explore page posts...");
        try {
            const response = await api.get(postsUrl(newTime, sort));
            setTime(newTime);
            setPosts(response.data);
            console.log(response.data);
            console.log("Successful fetch");
        } catch (error) { console.log("Error fetching explore page posts: ", error); }
        setCurrentTimeButton(newTime);
    }

    // Done so that we can change the sort all in the frontend (without api call)
    const changeSort = (newSort) => {
        if(sort === newSort && newSort != 'random') return;
        setSort(newSort);
        let sortedPosts = [...posts];
        if (newSort === 'top') sortedPosts.sort((a, b) => b.likes.length - a.likes.length);
        else if (newSort === 'old') sortedPosts.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        else if (newSort === 'new') sortedPosts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        else if (newSort === 'random') sortedPosts.sort(() => Math.random() - 0.5);
        else if (newSort === 'hot'){
            set_hot_score(sortedPosts);
            sortedPosts.sort((a, b) => b.hot_score - a.hot_score);
        } 
        setPosts(sortedPosts); 
        setCurrentSortButton(newSort);
    };

    return(
        <div className={styles.buttons}>
            {allowed_sorts.map((current_sort) => (
                <button
                    key={current_sort}
                    className={`${currentSortButton === current_sort ? styles.current : ''}`}
                    onClick={() => changeSort(current_sort)}
                >
                    {current_sort[0].toUpperCase() + current_sort.slice(1)}
                </button>
            ))}
            {allowed_times.map((current_time) => (
                <button
                    key={current_time}
                    className={`${currentTimeButton === current_time ? styles.current : ''}`}
                    onClick={() => changeTime(current_time)}
                >
                    {current_time.split(' ').map(word => word[0].toUpperCase() + word.slice(1)).join(' ')}
                </button>
            ))}
        </div>
    );
}

export default FilterButtons;