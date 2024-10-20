"use client";
import axios from "axios";
import { useState, useEffect } from "react";
import styles from "./Calendar.module.css";

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<
    {
      id: number;
      name: string;
      location: string;
      description: string;
      start_time: string;
      end_time: string;
    }[]
  >([]);
  useEffect(() => {
    console.log("fetching...");
    const fetchEvents = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/events/");
        setEvents(response.data);
      } catch (error) {
        console.log("Error fetching events: ", error);
      }
    };
    console.log("Successful fetch");
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

  const changeMonth = (isNext: boolean) => {
    let change: number = isNext ? 1 : -1;
    setCurrentDate(
      new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + change,
        currentDate.getDate()
      )
    );
  };

  const generateGrid = (year: number, month: number) => {
    const firstDay = new Date(year, month, 1).getDay();
    const daysCount = new Date(year, month + 1, 0).getDate();
    const previousMonth = new Date(year, month, 0).getDate();
    const grid = [];
    for (let i = firstDay - 1; i >= 0; i--)
      grid.push(new Date(year, month - 1, previousMonth - i));
    for (let i = 1; i <= daysCount; i++) 
      grid.push(new Date(year, month, i));
    let gridSize = grid.length > 35 ? 42 : 35;
    for (let i = grid.length, j = 1; i < gridSize; i++, j++)
      grid.push(new Date(year, month + 1, j));
    return grid;
  };

  const currentGrid = generateGrid(
    currentDate.getFullYear(),
    currentDate.getMonth()
  );

  return (
    <div className={styles.calendar}>
      <div className={styles.header}>
        <button
          className={styles["today-button"]}
          onClick={() => setCurrentDate(new Date())}
        >
          Today
        </button>
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
      <div className={styles.body}>
        <div className={styles.weekdays}>
          {weekdays.map((weekday) => (
            <div className={styles.weekday}>
              {weekday}
            </div>
          ))}
        </div>
        <div className={styles.days}>
          {currentGrid.map((day, index) => {
            const eventsForDay = events.filter((event) => {
              const eventDate = new Date(event.start_time);
              return (
                eventDate.getDate() === day.getDate() &&
                eventDate.getMonth() === day.getMonth() &&
                eventDate.getFullYear() === day.getFullYear()
              );
            });
            return (
              <div className={styles.day}>
                <span className={styles["day-number"]}>{day.getDate()}</span>
                {eventsForDay.map((event, index) => (
                  <div
                    key={event.id}
                    className={styles.event}
                    style={{ top: `${index * 26}px` }}
                  >
                    <span>{event.name}</span>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Calendar;
