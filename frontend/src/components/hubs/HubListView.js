"use client"
import { useState, useEffect } from 'react';
import React from 'react';
import styles from './HubListView.module.css';
import api from '@/utils/api';
import { getHubListUrl } from '@/utils/url-segments';
/*
 * id
 * name
 * description
 * owner
 * members
 * created at
 * private hub
 *
*/

const HubLimitedView = (data) => {
	console.log("in hublimited view", data);
	//console.log("hub name, ", hubData.hubData.name);
	const hubData = data.hubData; 
	return(
	<div className={styles.hubCard}>
		<div className={styles.hubHeader}>
		<button type="button" className={styles.hubButton}>
			<h1 className={styles.hubName}> {hubData.name} </h1>
		</button>
		<p className={styles.hubDate}> Hub Since: {hubData.created_at} </p>
		</div>
		<p className={styles.hubDescription}> {hubData.description} </p>
		<div className={styles.hubFooter}>
		<p className={styles.hubMembers}> Members: {hubData.members} </p>
		</div>
	</div>
	);

};

const HubListView = () => {

	const [hubListData, setHubListData] = useState([]);

	useEffect(() => {
		const getHubsInfo = async () => {
			    try {
				const response = await api.get(getHubListUrl());
				if(response.status == 200) {
				    setHubListData(response.data);
					console.log("data: ", response.data);
				}
			    } catch (error) {
				alert(error);
			    }
		}
		getHubsInfo();
     	}, []);




	return(
		<>
		<div style={{ display: 'flex', flexDirection: 'column'}} >
			<h1 className={styles.hubListTitle} > Browse Community Hubs! </h1>
			<div style={{ display: 'flex', flexDirection: 'column', gap: '10px', height:'100%', padding: '20px'}}>
				{hubListData.map((hubData, id) => (
					<HubLimitedView key={id} hubData={hubData}/>
				))}
			</div>
		</div>
		</>
		
	);
};

export default HubListView;
