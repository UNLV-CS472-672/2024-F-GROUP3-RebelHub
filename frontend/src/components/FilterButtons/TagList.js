import styles from "./FilterButtons.module.css";
import api from "@/utils/api";
import { useState, useEffect } from "react";
import { getFilterHubsUrl, getPostsHubUrl } from "@/utils/url-segments";
/* type = 'explore_hubs',  'hub_posts' */
/* current_hub_id != null means that this tag list is for post tags, otherwise it is for hub tags */
/* time is only used for post filtering */
/* initialHubTags is used for highlighting hub tags that were already assigned to a hub when you open up the hub edit */
const TagList = ({tags, type, sort=null, setFunction=null, time=null, current_hub_id=null, setFilteredTags=null, initialHubTags=null}) => {
    const [currentTags, setCurrentTags] = useState([]);

    // The following useEffect() is used to highlight hub tags that are already assigned to the hub when you open the hub edit
    useEffect(() => {
      if(initialHubTags)
        setCurrentTags(tags.filter(tag => initialHubTags.some(initialTag => initialTag.id === tag.id)));
    }, [])
    
    const performTag = async (tag) => {
        const newTags = currentTags.includes(tag) ? currentTags.filter(current_tag => current_tag !== tag) : [...currentTags, tag];
        setCurrentTags(newTags);
        if(current_hub_id || type=='edit_hub') setFilteredTags(newTags);
        if(type==='edit_hub') return;
        try {
            let response;
            const tagNames = newTags.map(tag => tag.name);
            if(type=='explore_hubs'){
              if (newTags.length != 0) response = await api.get(getFilterHubsUrl(tagNames, sort)); 
              else response = await api.get(getFilterHubsUrl(null, sort)); 
            } else if (type=='hub_posts') {
              if (newTags.length != 0) response = await api.get(getPostsHubUrl(current_hub_id, tagNames, time, sort));
              else response = await api.get(getPostsHubUrl(current_hub_id, null, time, sort));
            } 
            else {
              console.error("Invalid type")
            }
            setFunction(response.data);
            console.log(response.data);
        } catch (error) { console.log("Error fetching hubs: ", error); }
    };

    return (
        <div style={{ marginTop: '.8rem' }}>
          {tags.map((current_tag) => (
            <button
              key={current_tag.id} 
              style={{ marginBottom: '.3rem', '--bgColor': current_tag.color }}
              className={`${currentTags.includes(current_tag) ? styles.current : ''} ${styles.tags}`} 
              onClick={() => performTag(current_tag)} 
            >
              {current_tag.name.split(' ')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ')}
            </button>
          ))}
        </div>
      );
}

export default TagList;