import styles from "./UpdateForm.module.css";
import { useState, useEffect } from 'react';
import api from "../../utils/api";

const UpdateForm = ({ event, isOpen, onClose, onUpdate, route }) => {
    if (!isOpen) return null;

    /* Converts the DateTimeFormat from start_time and end_time into datetime-local.
    This is used so that the event's before-update start_time and if applicable end_time
    will show in the input box correctly when the update form is opened as DateTimeFormat is UTC
    while the local time is desired. */
    const formatDate = (dateTime) => {
      if (!dateTime) return ""; 
      const date = new Date(dateTime); // When converted into Date object, the time is automatically set to local time
      const month = String(date.getMonth() + 1).padStart(2, '0'); 
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      return `${date.getFullYear()}-${month}-${day}T${hours}:${minutes}`; // Format of datetime-local
    };

    // Used to convert the time back to UTC when start_time and end_time are sent to the database
    const convertToUTC = (date) => {
      if (!date) return null;
      const localDate = new Date(date);
      return localDate.toISOString(); // Converts to UTC
    }
    
    const [title, setTitle] = useState(event.title);
    const [description, setDescription] = useState(event.description);
    const [location, setLocation] = useState(event.location);
    const [startTime, setStartTime] = useState(formatDate(event.start_time));
    const [endTime, setEndTime] = useState(formatDate(event.end_time) || "");
    const [color, setColor] = useState(event.color);

    const onSubmit = async (e) => {
      e.preventDefault();
      try {
        // Make PUT request to update the event
        await api.put(`${route}/${event.id}/update/`, { title, description, location, start_time: convertToUTC(startTime), end_time: convertToUTC(endTime) || null, color: color || "#eb4f34" });
        onUpdate({...event, title, description, location, start_time: startTime, end_time: endTime, color: color || "#eb4f34" });
      } catch (error) {
        console.log("Error updating event: ", error.response.data);
      } finally {
        onClose();
      }
    }

    return (
      <div className={styles.overlay}>
        <form className={styles.modal} onSubmit={onSubmit}>
          <button className={styles["close-button"]} type="button" onClick={onClose}>
            &times;
          </button>
          <label>
            Title:
            <input type="text" name="title" value={title} onChange={(e) => setTitle(e.target.value)} />
          </label>
          <label>
            Location:
            <input type="text" name="location" value={location} onChange={(e) => setLocation(e.target.value)} />
          </label>
          <label>
            Description:
            <input type="text" name="description" value={description} onChange={(e) => setDescription(e.target.value)} />
          </label>
          <label>
            Start Time:
            <input type="datetime-local" name="start_time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
          </label>
          <label>
            End Time:
            <input type="datetime-local" name="end_time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
          </label>
          <label>
            Color:
            <input type="text" name="color" value={color} onChange={(e) => setColor(e.target.value)} />
          </label>
          <button className={styles["update-button"]} type="submit">Update Event</button>
          
        </form>
      </div>
    );
    
  };
  
  export default UpdateForm;