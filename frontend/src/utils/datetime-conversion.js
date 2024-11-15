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

// Used to format a date string to a human-readable format in the local timezone
// Example: "2024-11-06T22:34:00Z" (UTC) turns into "November 6, 2024 2:34pm" (PST)
export function formatDate(date) {
    const dateObject = new Date(date);
    const prepend = (number) => {return number >= 10 ? number : "0" + number;}
    const AMorPM = dateObject.getHours() >= 12 ? "pm" : "am";
    const MDY = months[dateObject.getMonth()] + " " + dateObject.getDate() + ", " + dateObject.getFullYear();
    const HM = (dateObject.getHours() % 12 == 0 ? 12 : dateObject.getHours() % 12) + ":" + prepend(dateObject.getMinutes()) + AMorPM;
    const correctFormat = MDY + " " + HM
    return correctFormat;
}

// #region Convert datetime string/object of local timezone into a datetime string/object of UTC timezone

// Converts a date string of local timezone into a date string of UTC timezone
// Example: "2024-11-06T14:34" (PST) turns into "2024-11-06T22:34:00Z" (UTC) 
export function convertLocalStringToUtcString(dateString) {
    if (!dateString) return null;
    const localDate = new Date(dateString);
    return localDate.toISOString();
}

// Converts a date object of local timezone into a date string of UTC timezone
export function convertLocalObjectToUtcString(dateObject) {
    if (!dateObject) return null;
    return dateObject.toISOString();
}

// Converts a date string of local timezone into a date object of UTC timezone
export function convertLocalStringToUtcObject(dateString) {
    if (!dateString) return null;
    const localDate = new Date(dateString);
    return new Date(localDate.toISOString());
}

// Converts a date object of local timezone into a date object of UTC timezone
export function convertLocalObjectToUtcObject(dateObject) {
    if (!dateObject) return null;
    return new Date(dateObject.toISOString());
}

const convertDateObjectToLocalString = (dateObject) => {
    const month = String(dateObject.getMonth() + 1).padStart(2, '0'); 
    const day = String(dateObject.getDate()).padStart(2, '0');
    const hours = String(dateObject.getHours()).padStart(2, '0');
    const minutes = String(dateObject.getMinutes()).padStart(2, '0');   
    return `${dateObject.getFullYear()}-${month}-${day}T${hours}:${minutes}`;
}

// Converts a date string of UTC timezone into a date string of local timezone
// Example: "2024-11-06T22:34:00Z" (UTC) turns into "2024-11-06T14:34" (PST)
export function convertUtcStringToLocalString(utcDateString) {
    if (!utcDateString) return ""; 
    const date = new Date(utcDateString); // When converted into Date object, the time is automatically set to local time
    return convertDateObjectToLocalString(date);
}

// Converts a date string of UTC timezone into a date object of local timezone
export function convertUtcStringToLocalObject(utcDateString) {
    if (!utcDateString) return ""; 
    return new Date(utcDateString);
}

// Converts a date object of UTC timezone into a date string of local timezone
export function convertUtcObjectToLocalString(utcDateObject) {
    if (!utcDateObject) return ""; 
    const date = new Date(utcDateObject.getTime());
    return convertDateObjectToLocalString(date);
}

// Converts a date object of UTC timezone into a date object of local timezone
export function convertUtcObjectToLocalObject(utcDateObject) {
    if (!utcDateObject) return ""; 
    return new Date(utcDateObject.getTime());
}

// #endregion

