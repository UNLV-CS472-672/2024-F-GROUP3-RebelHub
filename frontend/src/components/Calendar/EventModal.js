import styles from "./EventModal.module.css";
import Modal from "react-modal";

const EventModal = ({ details, isOpen, onClose }) => {
  // Returns null if there are no details or if isOpen is false
  if (!isOpen || !details) return null;

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      overlayClassName={styles.overlay}
      className={styles.modal}
      ariaHideApp={false}
    >
      <button onClick={onClose} className={styles["close-button"]}>
        ✖
      </button>
      <h1 className={styles.title}>{details.title}</h1>
      <p className={styles["start-time"]}>{details.start_time}</p>
      {details.end_time && (
        <p className={styles["end-time"]}>{details.end_time}</p>
      )}
      {details.location && (
        <p className={styles.location}>{details.location}</p>
      )}
      {details.description && (
        <p className={styles.description}>{details.description}</p>
      )}
    </Modal>
  );
};

export default EventModal;