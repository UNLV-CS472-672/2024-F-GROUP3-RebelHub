"use client";
import styles from "./HubList.module.css";
import { useState } from "react";
import EventModal from "../Calendar/EventModal.js";

const HubList = ({hubs}) => {
    const [isModalOpen, setIsModalOpen] = useState(false); // Event modal
    const [currentEvent, setCurrentEvent] = useState(null); // Holds the event for the current opened modal
    const [showDescription, setShowDescription] = useState([]);

    // Function to handle states when a modal is opened
    const openModal = (event) => {
        setCurrentEvent(event);
        setIsModalOpen(true);
        console.log("Open modal: %s", event.title);
    };

    // Function to handle states when a modal is closed
    const closeModal = () => {
        console.log("Closing modal: %s", currentEvent?.title);
        setIsModalOpen(false);
        setCurrentEvent(null);
    };

    const handleDescription = (hubId) => {
        setShowDescription((prev) => prev.includes(hubId) ? prev.filter(id => id !== hubId) : [...prev, hubId]);
    }

    if(hubs == null || hubs.length == 0) 
        return <>There are no hubs.</>;
    
    return (
        <div className={styles["hub-container"]}>
            {
                hubs.map((hub) => (
                    <div key={hub.id} className={styles.hub}>
                        <div className={styles["hub-name"]}>{hub.name}</div>
                        <hr className={styles["grey-line"]}/>
                        {!showDescription.includes(hub.id) && <button className={styles["show-description"]} onClick={() => handleDescription(hub.id)}>See More</button>}
                        {showDescription.includes(hub.id) && <div className={styles["hub-description"]}>{hub.description}</div> }
                        {showDescription.includes(hub.id) && <button className={styles["show-description"]} onClick={() => handleDescription(hub.id)}>Hide</button>}
                        
                        <hr className={styles["scarlet-line"]}/>
                        <hr className={styles["black-line"]}/>
                        <div>
                            <span>Tags: </span>
                            {hub.tags.map((tag) => (<span className={styles["hub-tags"]}>{tag.name + " "}</span>))}
                        </div>
                        <span>{"Members: " + hub.members.length}</span>
                        <div>
                            {hub.hub_events.length !== 0 && <span>Upcoming Events: </span>}
                            {hub.hub_events.map((event) => (<span className={styles["hub-event"]} key={event.id} style={{ backgroundColor: event.color }} onClick={() => {openModal(event);}}>{event.title}</span>))}
                        </div>
                    </div>
                    
                ))
            }

            {/* Modal for an event is displayed when an event is clicked on */}
            {/* Modal uses another component with the EventModal.js file */}
            {isModalOpen && <EventModal event={currentEvent} isOpen={isModalOpen} onClose={closeModal} viewOnly={true}/> }

        </div>
    );
};

export default HubList;
