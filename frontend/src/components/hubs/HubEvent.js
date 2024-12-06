"use client";
import React, { useState, useEffect } from 'react';
import { getEventListUrl, getDeleteEventURL } from '@/utils/url-segments';
import styles from './HubEvent.module.css';
import api from '@/utils/api';
import { formatDate } from '@/utils/datetime-conversion';
import EventModal from '@/components/Calendar/EventModal';
import UpdateForm from '../Calendar/UpdateForm';

const SingleEvent = ({data}) => {


	const hexToRGBA = (hexColor) => {
		const hex = hexColor.replace(/^#/, '');
		const r = parseInt(hex.substring(0, 2), 16);
		const g = parseInt(hex.substring(2, 4), 16);
		const b = parseInt(hex.substring(4, 6), 16);

		return `rgba(${r}, ${g}, ${b}, 0.5)`;
	};


	return(
		<div 
			className={styles.singleEvent}
			style={{
				backgroundColor: data.color ? hexToRGBA(data.color) : "rgba(255,255,255,0.5)"
			}}
	>
			<h1 className={styles.singleEventTitle} > {data.title} </h1>
			<ul className={styles.singleEventData} > 
				<li className={styles.singleEventDataLI}>
					STARTS: {formatDate(data.start_time)}
				</li>
				<li className={styles.singleEventDataLI}>
					ENDS: {formatDate(data.end_time)}
				</li>
				<li className={styles.singleEventDataLI}>
					{(!data.location || data.location === "") ?
						(<p> </p>) 
						:
						(<p> AT: {data.location} </p>)
					}
				</li>
			</ul>
			
		</div>
	);
};


const HubEvent = ({data, isHubOwner}) => {
	const [hubEvents, setHubEvents] = useState(null);

	const [openModal, setOpenModal] = useState(false);
	const [modalEvent, setModalEvent] = useState(null);
	const [isUpdateOpen, setIsUpdateOpen] = useState(false);
	const [currentUpdate, setCurrentUpdate] = useState(null); // Holds the event for the current update form

	const handleClose = () => {
		setOpenModal(false);
		setModalEvent(null);
		console.log("on closed!!#@");
	};

	  // Function to handle states when an update form is opened
	const openUpdateForm = () => {
			setCurrentUpdate(modalEvent);
			setIsUpdateOpen(true);
			console.log("Opening update form for event:", modalEvent.title);
	}
	
	  // Function to handle states when an update form is closed
	const closeUpdateForm = () => {
		console.log("Closing update form for event:", currentUpdate.title);
		setCurrentUpdate(null);
		setIsUpdateOpen(false);
	}

	    // Function to live update (no browser refresh required) the calendar when an event is updated 
	const updateEvent = (updatedEvent) => {
		setHubEvents((previousEvents) => previousEvents.map((event) => event.id === updatedEvent.id ? updatedEvent : event));
	};

	const deleteEvent = async (deletedEvent) => {
		try {
		  // Make DELETE request to delete the event
		  await api.delete(getDeleteEventURL(deletedEvent.id));
		  setHubEvents((previousEvents) => previousEvents.filter((event) => event.id !== deletedEvent.id));
		  handleClose();
		} catch (error) {
		  console.log("Error deleting event: ", error.response);
		} 
	  }

	useEffect(() => {
		console.log("EVENT:", data);
		setHubEvents(data);
	}, [data]);

	return (
		<div className={styles.eventContainer}>
			{!hubEvents || hubEvents.length === 0 ? 
				(<p> None </p>) 
				:
				(
			<ul className={styles.eventList}>
				{hubEvents.map((e, index) => (
					<li className={styles.eventLI}
						key={index} 
					>
						<div
							style={{cursor: 'pointer'}}
							onClick={() => {
								setOpenModal(true);
								setModalEvent(e);
							}}
						>
							<SingleEvent
								data={e}
							/>
						</div>
					</li>
				))}
			</ul>
			)}
			{openModal && 
				<EventModal event={modalEvent} 
					isOpen={openModal} 
					onClose={handleClose}
					onEdit={openUpdateForm}
					onDelete={deleteEvent}
				/>
			}
			<div>
				{isUpdateOpen && <UpdateForm event={currentUpdate} onClose={closeUpdateForm} onUpdate={updateEvent}/>}
			</div>
		</div>
	);
};


export default HubEvent;
