import styles from "./FilterButtons.module.css";
import { useState, useEffect } from "react";
import api from "@/utils/api";
import TagList from "./TagList.js"; 

const FilterPostButtons = ({posts, setPosts, postsUrl, current_hub_id, tags}) => {
    const [time, setTime] = useState('week');
    const [sort, setSort] = useState('hot'); 
    const [currentTimeButton, setCurrentTimeButton] = useState('week');
    const [currentSortButton, setCurrentSortButton] = useState('hot');
    const allowed_sorts = ['hot', 'top', 'old', 'new', 'random'];
    const allowed_times = ['24 hours', 'week', 'month', 'year', 'all time'];
    const [showTagList, setShowTagList] = useState(false);
    const [filteredTags, setFilteredTags] = useState([]);


    const changeTime = async (newTime) => {
        if(time === newTime) return;
        console.log("Fetching posts...");
        try {
            let response;
            if(current_hub_id != null){
                if(filteredTags.length != 0) response = await api.get(postsUrl(current_hub_id, filteredTags, newTime, sort));
                else response = await api.get(postsUrl(current_hub_id, null, newTime, sort));
            } 
            else {
                response = await api.get(postsUrl(null, newTime, sort));
            }
            setTime(newTime);
            setPosts(response.data);
            console.log(response.data);
        } catch (error) { console.log("Error fetching posts: ", error); }
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
        else if (newSort === 'hot') sortedPosts.sort((a, b) => b.hot_score - a.hot_score);
        setPosts(sortedPosts); 
        setCurrentSortButton(newSort);
    };

    return(
        <div className={styles.buttons}>
            {allowed_sorts.map((current_sort) => (
                <button
                    key={current_sort}
                    className={`${currentSortButton === current_sort ? styles.current : ''} ${styles.sort}`}
                    onClick={() => changeSort(current_sort)}
                >
                    {current_sort.toUpperCase()}
                </button>
            ))}
            {allowed_times.map((current_time) => (
                <button
                    key={current_time}
                    className={`${currentTimeButton === current_time ? styles.current : ''} ${styles.sort}`}
                    onClick={() => changeTime(current_time)}
                >
                    {current_time.toUpperCase()}
                </button>
            ))}
            {current_hub_id && <button className={`${showTagList === true ? styles.current : ''} ${styles['tag-button']}`} onClick={() => setShowTagList(previous => !previous)}>TAGS</button>}
            {current_hub_id && showTagList && tags.length != 0 && <TagList tags={tags} sort={sort} time={time} setFunction={setPosts} type={"hub_posts"} current_hub_id={current_hub_id} setFilteredTags={setFilteredTags} />}
        </div>
    );
}

export default FilterPostButtons;