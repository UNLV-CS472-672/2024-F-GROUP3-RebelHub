import styles from "./EventModal.module.css";
import { useState, useEffect } from 'react';
import api from "../../utils/api";
import Modal from "react-modal";
import {checkHubPrivileges, checkAuthorPrivileges} from "../../utils/fetchPrivileges";
import { getHubUrl } from "@/utils/url-segments";

const EventModal = ({ event, isOpen, onClose, onEdit, onDelete}) => {
  // Returns null if the modal is blank or it is already open
  if (!isOpen || !event) return null;

  const [currentHub, setCurrentHub] = useState(event.hub ? event.hub : null);
  const [isPrivileged, setIsPrivileged] = useState(false);
  
  const updateButtonClick = () => {
    onEdit();
    onClose(); // Closes current modal when event is updated
  }

  // Fetches hub from API. Used when creating an event in the frontend and then reading it.
  // This is necessary because when an event is created in the frontend, hub is stored as the id.
  // And so hub is retrieved as an id, which means we need to get hub object from id. 
  // But after refreshing the browser, the hub will then return as a hub object, so an if condition is needed.
  useEffect(() => {
    const fetchHub = async () => {
      if (event.hub && Number.isInteger(event.hub)) {
        console.log("Fetching hub from this id: ", event.hub);
        try {
          const response = await api.get(getHubUrl(event.hub));
          setCurrentHub(response.data);
          console.log("Fetched the following hub from this key: ", event.hub, response.data);
        } catch (error) {
          console.log("Error fetching hub: ", error);
        }
      } 
    };
    fetchHub(); 
  }, []); 

  useEffect(() => {
    const checkPrivileges = async () => {
      if (!event.isPersonal) {
        const hubPrivileged = await checkHubPrivileges(event.hub.id);
        setIsPrivileged(hubPrivileged);
      } else {
        const authorPrivileged = await checkAuthorPrivileges(event.author);
        setIsPrivileged(authorPrivileged);
      }
    };
    checkPrivileges();
  }, []);

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Used to format the start_time and end_time 
  const formatDate = (date) => {
    const dateObject = new Date(date);
    const prepend = (number) => {return number >= 10 ? number : "0" + number;}
    const AMorPM = dateObject.getHours() >= 12 ? "pm" : "am";
    const MDY = months[dateObject.getMonth()] + " " + dateObject.getDate() + ", " + dateObject.getFullYear();
    const HM = (dateObject.getHours() % 12 == 0 ? 12 : dateObject.getHours() % 12) + ":" + prepend(dateObject.getMinutes()) + AMorPM;
    return MDY + " " + HM;
  }

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      overlayClassName={styles.overlay} // Used to get semi-transparent background for the screen outside the modal
      className={styles.modal}
      ariaHideApp={false}
    >
      <div className={styles["header"]}>
        <button onClick={onClose} className={styles["close-button"]}>
            ✖
        </button>
        <h1 className={styles.title}>{event.title}</h1>
        <hr className={styles["grey-line"]}/>
          <p className={styles["start_time"]}>{"Start Time: " + formatDate(event.start_time)}</p>
          <p className={styles["end_time"]}>{event.end_time && "End Time: " + formatDate(event.end_time)}</p>
        
        {event.location && (  
          <p className={styles.location}>{"Location: " + event.location}</p>
        )}
        {currentHub && <p className={styles.hub}>{"Hub: " + currentHub.name}</p>}
        {event.description && (
          <>
            <hr className={styles["scarlet-line"]}/>
            <hr className={styles["black-line"]}/>
          </>
        )}
      </div>
      {event.description && (
        <p className={styles.description}>{event.description}</p>
      )}
      {/* Only shows update and delete buttons if either the event is a personal event (created by current user)
      or the event is part of a hub that the user is either the owner of or a moderator of*/}
      
      {isPrivileged && 
        <div className={styles["footer"]}>
          <hr className={styles["bottom-black-line"]} />
          <hr className={styles["bottom-scarlet-line"]} />
        
    
          <div className={styles["crud-buttons"]}>
            <button onClick={updateButtonClick} className={styles["update-button"]}>Update</button>
            <button onClick={() => onDelete(event)} className={styles["delete-button"]}>Delete</button>
          </div>
        </div>
      }
    </Modal>
  );
};

export default EventModal;