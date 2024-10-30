import styles from "./EventModal.module.css";
import Modal from "react-modal";

const EventModal = ({ event, isOpen, onClose, onEdit, onDelete, currentUser }) => {
  // Returns null if the modal is blank or it is already open
  if (!isOpen || !event) return null;

  const updateButtonClick = () => {
    onEdit();
    onClose();
  }

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
        <div className={styles.times}>
          <p>{"Start Time: " + formatDate(event.start_time)}</p>
          <p>{event.end_time && "End Time: " + formatDate(event.end_time)}</p>
        </div>
        {event.location && (  
          <p className={styles.location}>{"Location: " + event.location}</p>
        )}
        {event.description && (
          <>
            <hr className={styles["scarlet-line"]}/>
            <hr className={styles["black-line"]}/>
          </>
        )}
        {event.hub && <p>{"Hub: " + event.hub.name}</p>}
      </div>
      {event.description && (
        <p className={styles.description}>{event.description}</p>
      )}
      {/* Only shows update and delete buttons if either the event is a personal event (created by current user)
      or the event is part of a hub that the user is either the owner of or a moderator of*/}
      {(event.isPersonal || !(!event.isPersonal && (event.hub.owner !== currentUser || !event.hub.mods.includes(currentUser)))) && 
        <div className={styles["crud-buttons"]}> 
            <button onClick={updateButtonClick} className={styles["update-button"]}>Update</button>
            <button onClick={() => onDelete(event)} className={styles["delete-button"]}>Delete</button>
        </div>
      }
    </Modal>
  );
};

export default EventModal;