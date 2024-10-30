import styles from "./CreateForm.module.css";
import { useState, useEffect } from 'react';
import api from "../../utils/api";

const CreateForm = ({isCreateOpen, onClose, onCreate, route}) => {
    if (!isCreateOpen) return null;

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [location, setLocation] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [color, setColor] = useState("");
    const [hub, setHub] = useState("");
    const [isPersonal, setIsPersonal] = useState(false);

    const convertToUTC = (date) => {
        if (!date) return null;
        const localDate = new Date(date);
        return localDate.toISOString();
      }

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            // Make POST request
            const response = await api.post(`${route}/create/`, { title, description, location, start_time: convertToUTC(startTime), end_time: convertToUTC(endTime) || null, color: color || "#eb4f34", hub: hub || null, isPersonal});
            onCreate(response.data);
        } catch (error) {
            console.log("Error creating event: ", error.response.data);
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
            <label>
              Hub:
              <input type="text" name="hub" value={hub} onChange={(e) => setHub(e.target.value)} />
            </label>
            <label>
              Personal Event? 
              <input type="checkbox" name="isPersonal" checked={isPersonal} style={{ transform: "scale(1.5)", marginLeft: ".5vw" }} onChange={(e) => setIsPersonal(e.target.checked)} />
            </label>
            <button className={styles["create-button"]} type="submit">Create Event</button>
            
            </form>
        </div>
    );
      

}

export default CreateForm