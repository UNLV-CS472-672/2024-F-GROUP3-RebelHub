import styles from "./FilterButtons.module.css";
import { getFilterHubsUrl } from "@/utils/url-segments";
import api from "@/utils/api";
import { useState } from "react";

const TagList = ({tags, setTags, sort, setHubs}) => {
    const [currentTags, setCurrentTags] = useState([]);

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

    return (
        <div style={{ marginTop: '.8rem' }}>
          {tags.map((current_tag) => (
            <button
              key={current_tag} 
              style={{ marginBottom: '.3rem' }}
              className={`${currentTags.includes(current_tag) ? styles.current : ''} ${styles.tags}`} 

              onClick={() => performTag(current_tag)} 
            >
              {current_tag.split(' ')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ')}
            </button>
          ))}
        </div>
      );
}

export default TagList;