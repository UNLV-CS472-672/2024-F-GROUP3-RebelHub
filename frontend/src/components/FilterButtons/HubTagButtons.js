import styles from "./FilterButtons.module.css";
import { useState } from "react";
import api from "../api";
import { getFilterHubsUrl } from "@/utils/url-segments";

const HubTagButtons = ({hubs, setHubs, tags, setTags}) => {
    const [sort, setSort] = useState('top'); 
    const [currentSortButton, setCurrentSortButton] = useState('top');
    const allowed_sorts = ['top', 'old', 'new', 'a-z', 'z-a', 'random'];
    const [currentTags, setCurrentTags] = useState([]);
    
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

    const performTag = async (tag) => {
        const newTags = currentTags.includes(tag) ? currentTags.filter(current_tag => current_tag !== tag) : [...currentTags, tag];
        setCurrentTags(newTags);
        try {
            let response;
            if (newTags.length != 0){
                response = await api.get(getFilterHubsUrl(newTags, sort)); 
            } else {
                response = await api.get(getFilterHubsUrl(null, sort));
            } 
            setHubs(response.data);
            console.log(response.data);
            console.log("Successful fetch");
        } catch (error) { console.log("Error fetching hubs: ", error); }
    };

    return(
        <div className={styles.buttons}>
            {allowed_sorts.map((current_sort) => (
                <button
                    key={current_sort}
                    className={`${currentSortButton === current_sort ? styles.current : ''}`}
                    onClick={() => changeSort(current_sort)}
                >
                    {current_sort === 'a-z' || current_sort === 'z-a'
                    ? current_sort.toUpperCase()
                    : current_sort[0].toUpperCase() + current_sort.slice(1)}
                </button>
            ))}
            {tags.map((current_tag) => (
                <button
                    key={current_tag}
                    className={`${currentTags.includes(current_tag) ? styles.current : ''}`} 
                    onClick={() => performTag(current_tag)} 
                >
                    {current_tag.split(' ').map(word => word[0].toUpperCase() + word.slice(1)).join(' ')}
                </button>
            ))}
            
        </div>
    );
}

export default HubTagButtons;