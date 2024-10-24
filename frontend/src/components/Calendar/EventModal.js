import styles from "./EventModal.module.css";
import Modal from "react-modal";

const EventModal = ({ details, isOpen, onClose }) => {
  // Returns null if the modal is blank or it is already open
  if (!isOpen || !details) return null;

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
        <h1 className={styles.title}>{details.title}</h1>
        <hr className={styles["grey-line"]}></hr>
        <div className={styles.times}>
          <p>{"Start Time: " + formatDate(details.start_time)}</p>
          <p>{details.end_time && "End Time: " + formatDate(details.end_time)}</p>
        </div>
        {details.location && (  
          <p className={styles.location}>{"Location: " + details.location}</p>
        )}
        <hr className={styles["scarlet-line"]}></hr>
        <hr className={styles["black-line"]}></hr>
      </div>
      {details.description && (
        <p className={styles.description}>{details.description}</p>
      )}
    </Modal>
  );
};

export default EventModal;