import styles from "./UpdateForm.module.css";
import { useState } from 'react';
import api from "../../utils/api";
import { getUpdateEventURL } from "@/utils/url-segments";
import { convertLocalStringToUtcString, convertUtcStringToLocalString } from "@/utils/datetime-conversion";

const UpdateForm = ({ event, onClose, onUpdate}) => {
    
    const [title, setTitle] = useState(event.title);
    const [description, setDescription] = useState(event.description);
    const [location, setLocation] = useState(event.location);
    const [startTime, setStartTime] = useState(convertUtcStringToLocalString(event.start_time));
    const [endTime, setEndTime] = useState(convertUtcStringToLocalString(event.end_time) || "");
    const [color, setColor] = useState(event.color);

    const onSubmit = async (e) => {
      e.preventDefault();
      try {
        // Make PUT request to update the event
        await api.put(getUpdateEventURL(event.id), { title, description, location, start_time: convertLocalStringToUtcString(startTime), end_time: convertLocalStringToUtcString(endTime) || null, color: color});
        onUpdate({...event, title, description, location, start_time: startTime, end_time: endTime, color: color || "#eb4f34" });
        onClose();
      } catch (error) {
        console.log("Error updating event: ", error.response.data);
      }
    }

    return (
      <div className={styles.overlay}>
        <form className={styles.form} onSubmit={onSubmit}>
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
            <input type="color" style={{cursor:"pointer", marginLeft:"1vw"}} name="color" value={color} onChange={(e) => setColor(e.target.value)} />
          </label>
          <button className={styles["update-button"]} type="submit">Update Event</button>
          
        </form>
      </div>
    );
    
  };
  
  export default UpdateForm;