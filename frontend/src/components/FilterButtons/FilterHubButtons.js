import styles from "./FilterButtons.module.css";
import { useState, useEffect } from "react";
import TagList from "./TagList.js"
import api from "@/utils/api";
import { getHubTagsUrl } from "@/utils/url-segments";

const FilterHubButtons = ({hubs, setHubs}) => {
    const [sort, setSort] = useState('top'); 
    const [currentSortButton, setCurrentSortButton] = useState('top');
    const allowed_sorts = ['top', 'old', 'new', 'a-z', 'z-a', 'random'];
    const [showTagList, setShowTagList] = useState(false);
    const [tags, setTags] = useState([]);
    
    // Done so that we can change the sort all in the frontend (without api call)
    const changeSort = (newSort) => {
        if(sort === newSort && newSort != 'random') return;
        setSort(newSort);
        let sortedHubs = [...hubs];
        if (newSort === 'top') sortedHubs.sort((a, b) => b.members.length - a.members.length);
        else if (newSort === 'old') sortedHubs.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
        else if (newSort === 'new') sortedHubs.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        else if (newSort === 'a-z') sortedHubs.sort((a, b) => a.name.localeCompare(b.name));
        else if (newSort === 'z-a') sortedHubs.sort((a, b) => b.name.localeCompare(a.name));
        else if (newSort === 'random') sortedHubs.sort(() => Math.random() - 0.5);
        setHubs(sortedHubs); 
        setCurrentSortButton(newSort);
    };

    useEffect(() => {
        const fetchHubTags = async () => {
            try {
                const response = await api.get(getHubTagsUrl());
                console.log(response.data);
                setTags(response.data);
            } catch (error) { console.log("Error fetching hub tags: ", error); }
        };
        fetchHubTags();
    }, []);
    
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
            <button className={`${showTagList === true ? styles.current : ''} ${styles['tag-button']}`} onClick={() => setShowTagList(previous => !previous)}>TAGS</button>
            {showTagList && tags.length != 0 && <TagList tags={tags} sort={sort} setFunction={setHubs} type={'explore_hubs'}/>}
        </div>
    );
}

export default FilterHubButtons;