"use client";
import React, { useState, useEffect } from 'react';
import { getEventListUrl } from '@/utils/url-segments';
import styles from './HubEvent.module.css';
import api from '@/utils/api';
import { formatDate } from '@/utils/datetime-conversion';
import EventModal from '@/components/Calendar/EventModal';


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



	const handleClose = () => {
		setOpenModal(false);
		setModalEvent(null);
		console.log("on closed!!#@");
	};


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
			{openModal && <EventModal event={modalEvent} 
						  isOpen={openModal} 
						  onClose={handleClose}
						  onEdit={null}
						  onDelete={null}
							  />
			}
		</div>
	);
};


export default HubEvent;
