"use client";
import axios from "axios";
import { useState, useEffect } from "react";
import styles from "./Calendar.module.css";
import EventModal from "./EventModal.js";

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date()); // Holds the current date in order for today button to work
  const [events, setEvents] = useState([]); // Holds events that are pulled by API
  const [isModalOpen, setIsModalOpen] = useState(false); // Checks if modal is opened in order to avoid any issues
  const [currentEvent, setCurrentEvent] = useState(null); // Holds the event for the current opened modal

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

  // Fetches events from API
  useEffect(() => {
    console.log("Fetching...");
    const fetchEvents = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/events/");
        setEvents(response.data);
        console.log("Successful fetch");
      } catch (error) {
        console.log("Error fetching events: ", error);
      }
    };
    fetchEvents();
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

  const weekdays = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  // Changes the current month of the calendar when the previous or next button is pressed
  const changeMonth = (isNext) => {
    const change = isNext ? 1 : -1; // Determines if the previous or next button is pressed
    setCurrentDate(
      new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + change,
        currentDate.getDate()
      )
    );
  };

  const generateGrid = (year, month) => {
    const firstDay = new Date(year, month, 1).getDay(); // Gets weekday (SUN - SAT) of the first day of the month
    const daysCount = new Date(year, month + 1, 0).getDate(); // Gets the amount of days in the current month
    const previousMonth = new Date(year, month, 0).getDate(); // Gets the amount of days in the previous month
    const grid = []; // Calendar grid for the current month

    // Places the last days of the previous months if the first day of the current month doesn't start on Sunday
    for (let i = firstDay - 1; i >= 0; i--)
      grid.push(new Date(year, month - 1, previousMonth - i));

    // Places the days for the current month
    for (let i = 1; i <= daysCount; i++) grid.push(new Date(year, month, i));

    /* Determines if the calendar grid needs to be 7x5 or 7x6
    If the first day of the month starts later into the week, a 7x6 grid is potentially needed*/
    let gridSize = grid.length > 35 ? 42 : 35;

    // Places the first days of the next month to fill out any remaining space in a week
    for (let i = grid.length, j = 1; i < gridSize; i++, j++)
      grid.push(new Date(year, month + 1, j));

    return grid;
  };

  // Generates the calendar grid for the current month
  const currentGrid = generateGrid(
    currentDate.getFullYear(),
    currentDate.getMonth()
  );

  return (
    <div>
      <div className={styles.calendar}>

        {/* Header includes the title and the today, previous, and next month buttons */}
        <div className={styles.header}>
          <button
            className={styles["today-button"]}
            onClick={() => setCurrentDate(new Date())}
          >
            Today
          </button>
          {/* Different style is needed for today button versus the rest of the header */}
          <div className={styles["header-buttons"]}>
            <button
              className={styles["previous-button"]}
              onClick={() => changeMonth(false)}
            >
              ←
            </button>
            <button
              className={styles["next-button"]}
              onClick={() => changeMonth(true)}
            >
              →
            </button>
            <h2 className={styles.title}>
              {months[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
          </div>
        </div>
    
        {/* Body includes the weekdays and the calendar grid of days and their events */}
        <div className={styles.body}>

          {/* Maps each day of the week to display them */}
          <div className={styles.weekdays}>
            {weekdays.map((weekday) => (
              <div className={styles.weekday} key={weekday}>{weekday}</div>
            ))}
          </div>

          <div className={styles.days}>
            {/* Maps each day of the month onto the grid along with their events */}
            {currentGrid.map((day, index) => {

              // Filter events to get events for each day by checking date, month, and year
              const eventsForDay = events.filter((event) => {
                const eventDate = new Date(event.start_time);
                return (
                  eventDate.getDate() === day.getDate() &&
                  eventDate.getMonth() === day.getMonth() &&
                  eventDate.getFullYear() === day.getFullYear()
                );
              });

              return (
                <div className={styles.day} key={index}>
                  <span className={styles["day-number"]}>{day.getDate()}</span>
                  {/* Used to map events onto a day cell on the calendar grid */}
                  {eventsForDay.map((event, index) => (
                    <div
                      key={event.id}
                      className={styles.event}
                      style={{
                        top: `${index * 26}px`, // Used to display the events on a day
                        borderColor: event.color,
                        onClick={() => { // When an event is clicked on, the modal for the event is opened
                          openModal(event);
                        }}
                      }}  
                    >
                      <span style={{color:event.color}}>{event.title}</span>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Modal for an event is displayed when an event is clicked on */}
      {/* Modal uses another component with the EventModal.js file */}
      <EventModal
        details={currentEvent}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
      
    </div>
  );
};

export default Calendar;
