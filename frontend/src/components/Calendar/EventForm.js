import styles from "./EventForm.module.css";
import { useState, useEffect } from 'react';
import api from "../../utils/api";
import { useRouter } from 'next/navigation';

const EventForm = ({ event, isOpen, onClose, onUpdate, route }) => {
    if (!isOpen) return null;


    // Converts the DateTimeFormat from start_time and end_time into datetime-local
    const formatDate = (dateTime) => {
      if (!dateTime) return ""; 
      const date = new Date(dateTime);
      return date.toISOString().slice(0, 16); 
    };
    
    const [title, setTitle] = useState(event.title || "");
    const [description, setDescription] = useState(event.description || "");
    const [location, setLocation] = useState(event.location || "");
    const [startTime, setStartTime] = useState(formatDate(event.start_time) || "");
    const [endTime, setEndTime] = useState(formatDate(event.end_time) || "");
    const [color, setColor] = useState(event.color || "");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router=useRouter()

    // Update state when event prop changes
    useEffect(() => {
      if (event) {
          setTitle(event.title || "");
          setDescription(event.description || "");
          setLocation(event.location || "");
          setStartTime(formatDate(event.start_time) || "");
          setEndTime(formatDate(event.end_time) || "");
          setColor(event.color || "");
      }
  }, [event]);

    const onSubmit = async (e) => {
      setLoading(true);
      e.preventDefault();
      setError("test");
      try {
        console.log(route);
        // Make PUT request to update the event
        const request = await api.put(`${route}/${event.id}/update/`, { title, description, location, start_time: startTime, end_time: endTime, color });
        onUpdate({...event, title, description, location, start_time: startTime, end_time: endTime, color});
        //router.push('/calendar'); 
        router.refresh();
      } catch (error) {
          alert(error);
      } finally {
          setLoading(false);
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
            <input type="text" name={"title"} value={title} onChange={(e) => setTitle(e.target.value)} />
          </label>
          <label>
            Location:
            <input type="text" name={"location" || ""} value={location} onChange={(e) => setLocation(e.target.value)} />
          </label>
          <label>
            Description:
            <input type="text" name={"description" || ""} value={description} onChange={(e) => setDescription(e.target.value)} />
          </label>
          <label>
            Start Time:
            <input type="datetime-local" name={"start_time"} value={startTime} onChange={(e) => setStartTime(e.target.value)} />
          </label>
          <label>
            End Time:
            <input type="datetime-local" name={"end_time"} value={endTime} onChange={(e) => setEndTime(e.target.value)} />
          </label>
          <label>
            Color:
            <input type="text" name={"color"} value={color} onChange={(e) => setColor(e.target.value)} />
          </label>
          <button type="submit">Update Event</button>
          
        </form>
      </div>
    );
    
  };
  
  export default EventForm;