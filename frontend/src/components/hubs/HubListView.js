"use client"
import { useState, useEffect } from 'react';
import React from 'react';
import styles from './HubListView.module.css';
import api from '@/utils/api';
import { getJoinedHubsUrl } from '@/utils/url-segments';
import { useRouter } from 'next/navigation';
import { convertUtcStringToLocalString } from '@/utils/datetime-conversion';
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
	const router = useRouter();

	const gotoHub = () => {
		const id = hubData.id;
		router.push(`/hubs/${id}`);
	};

	const created = convertUtcStringToLocalString(hubData.created_at);

	const shortDesc = (desc) => {
	    const words = desc.split(" ");
	    if (words.length > 50) {
		return words.slice(0, 47).join(" ") + "...";
	    }
	    return desc;
	}

	return(
	<div className={styles.hubCard} 
	     style={{
		     backgroundImage: hubData.bg ? 'none' : 'none',
		     backgroundColor: hubData.bg ? 'rgba(0,0,0,0.7)' : '#5b0411',
	     }}
	>
		<div className={styles.hubHeader}>
		<button type="button" onClick={gotoHub} className={styles.hubButton}>
			<h1 className={styles.hubName}> {hubData.name} </h1>
		</button>
		<p className={styles.hubDate}> Hub Since: {created.slice(0, created.length-6)} </p>
		</div>
		<p className={styles.hubDescription}> {shortDesc(hubData.description)} </p>
		<div className={styles.hubFooter}>
		<p className={styles.hubMembers}> Members: {hubData.member_num} </p>
		</div>
	</div>
	);

};

const HubListView = () => {

	const [hubListData, setHubListData] = useState([]);

	useEffect(() => {
		const getHubsInfo = async () => {
			    try {
				const response = await api.get(getJoinedHubsUrl());
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
			<h1 className={styles.hubListTitle} > Browse Your Hubs! </h1>
			<div style={{
				display: 'grid',
				gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
				gap: '20px',
				padding: '20px',
				width: '100%',
				boxSizing: 'border-box',
			}}>
				{hubListData.map((hubData, id) => (
					<div    className={styles.hubHover}
						style={{backgroundImage: hubData.bg ? `url(${hubData.bg})` : 'none',
						     borderRadius: '12px',
						     height: '100%',
						     backgroundPosition: 'center',
						     backgroundSize: 'cover',
						}}
					>
						<HubLimitedView key={id} hubData={hubData}/>
					</div>
				))}
			</div>
		</div>
		</>
		
	);
};

export default HubListView;
