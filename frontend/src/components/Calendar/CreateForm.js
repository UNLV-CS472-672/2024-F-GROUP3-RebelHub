import styles from "./CreateForm.module.css";
import { useState } from 'react';
import api from "../../utils/api";
import { getCreateEventURL } from "@/utils/url-segments";
import { convertLocalStringToUtcString } from "@/utils/datetime-conversion";

const CreateForm = ({onClose, onCreate, hubsModding}) => {

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [location, setLocation] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState(null);
    const [color, setColor] = useState("#eb4f34");
    const [hub, setHub] = useState(null);
    const [isPersonal, setIsPersonal] = useState(false);
    const [isHubListOpen, setIsHubListOpen] = useState(false);

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            // Make POST request
            const response = await api.post(getCreateEventURL(), { title, description, location, start_time: convertLocalStringToUtcString(startTime), end_time: endTime ? convertLocalStringToUtcString(endTime) : null, color: color, hub: hub ? hub.id : null, isPersonal});
            onCreate(response.data);
            onClose();
        } catch (error) { console.log("Error creating event: ", error); } 
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
              <textarea name="description" value={description} onChange={(e) => setDescription(e.target.value) } rows="5" />
            </label>
            <label>
              Start Time:
              <input type="datetime-local" name="start_time" value={startTime} style={{cursor:"pointer"}}  onChange={(e) => setStartTime(e.target.value)} />
            </label>
            <label>
              End Time:
              <input type="datetime-local" name="end_time" value={endTime} style={{cursor:"pointer"}} onChange={(e) => setEndTime(e.target.value)} />
            </label>
            

            <label>
              Personal Event? 
              <input 
              type="checkbox" 
              name="isPersonal" 
              checked={isPersonal} 
              style={{ transform: "scale(1.5)", marginLeft: "2vw", cursor: "pointer" }} 
              onChange={(e) => {
                setIsPersonal(e.target.checked);
                if(e.target.checked) setHub(null);
              }}
              />
            </label>
            
            {/* 
            Hub label and input box only appears if the personal event checkbox is not checked. 
            When clicked, a dropdown menu displaying the hubs that the user is moderating will appear.
            When the hub input loses focus (clicked out of), the dropdown menu disappears.
            */}
            {!isPersonal && 
              <label>
                Hub:
                <input 
                style={{cursor:"pointer", marginBottom:"0"}} 
                type="text" 
                name="hub" 
                value={hub ? hub.name : ""} 
                onChange={(e) => setHub(e.target.value)} 
                readOnly 
                onBlur={() => {setTimeout(() => {setIsHubListOpen(false);}, 100)}} 
                onClick={() => {if(!isPersonal) setIsHubListOpen(true)}} />
              </label>
              
            }
            
            {/* Dropdown menu to select hub for event. */}
            {isHubListOpen &&  (
              <ul className={styles["dropdown-list"]}>
                {hubsModding.map((hubItem, index) => (
                  <li className={styles["dropdown-item"]}
                  key={index}
                  onClick={() => { 
                    console.log("Selecting the following hub: ", hubItem);
                    setHub(hubItem);
                    setIsHubListOpen(false);
                  }}  
                  >
                    {hubItem.name}
                  </li> 
                ))}
              </ul>
            )}

            <label>
              Color:
              <input type="color" style={{cursor:"pointer", marginLeft:"1vw"}} name="color" value={color} onChange={(e) => setColor(e.target.value)} />
            </label>
            
            <button className={styles["create-button"]} type="submit">Create Event</button>
            
            </form>
        </div>
    );
      

}

export default CreateForm