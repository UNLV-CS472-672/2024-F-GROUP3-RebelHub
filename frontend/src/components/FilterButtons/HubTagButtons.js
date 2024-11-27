import styles from "./FilterButtons.module.css";
import { useState } from "react";
import TagList from "./TagList.js"

const HubTagButtons = ({hubs, setHubs, tags, setTags}) => {
    const [sort, setSort] = useState('top'); 
    const [currentSortButton, setCurrentSortButton] = useState('top');
    const allowed_sorts = ['top', 'old', 'new', 'a-z', 'z-a', 'random'];
    const [showTagList, setShowTagList] = useState(false);
    
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
            {showTagList && <TagList tags={tags} setTags={setTags} sort={sort} setHubs={setHubs}/>}
        </div>
    );
}

export default HubTagButtons;