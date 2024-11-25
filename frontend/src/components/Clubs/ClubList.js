"use client";
import styles from "./ClubList.module.css";

const ClubList = ({hubs}) => {
    if(hubs == null || hubs.length == 0) 
        return <>There are no clubs.</>;
    for(let i = 0; i < hubs.length; i++)
        console.log(hubs[i].hub_tag);
    
    return (
        <div className={styles["hub-container"]}>
            {
                hubs.map((hub) => (
                    <div key={hub.id} className={styles.hub}>
                        <div className={styles["hub-name"]}>{hub.name}</div>
                        <div className={styles["hub-description"]}>{hub.description}</div>
                        {hub.hub_tag.map((tag) => (<div>{tag}</div>))}
                        <div>{"Members: " + hub.members.length}</div>
                        <div>{hub.hub_events}</div>
                    </div>
                ))
            }
        </div>
    );
};

export default ClubList;
