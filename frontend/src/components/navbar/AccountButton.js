"use client"

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './AccountButton.module.css';
import api from '@/utils/api'
import { getProfileUrl } from '@/utils/url-segments';



const avatarIconPath = "/navbar/icons/avatar.png" // path for the avatar icon.

//takes in a props{username, darkTheme} 
//username can be changed to be the actual user id. 


const AccountButton = (props) => {
	const [displayName, setDisplayName] = useState(props.username);
	const [darkTheme] = useState(props.darkTheme);
	const router = useRouter();
	const [pfppath, setpfppath] = useState(null);
	

	useEffect(() => {
		const fetchProfile = async () => {

		try {
			const response = await api.get(getProfileUrl())
			if(response.status == 200){
				setDisplayName(response.data.name)
				setpfppath(`http://localhost:8000${response.data.pfp}`)
			}
		} catch (error) {
			console.error('Error fetching profile:', error);
			setpfppath(avatarIconPath)
			setDisplayName('some user')
		}
		};

    	fetchProfile();
  	})

	const accountButtonPressed = () => {
		console.log("pressed acc")
		// router.push("/"); <--- go to the user's profile page.
		router.push("/profile")
	};

	return(
		<>
		<button className={styles.accountButton} onClick={accountButtonPressed}> 
			<img src={pfppath} className={styles.avatarIcon}/> 
			<p className={`${styles.accountText} ${darkTheme ? styles.dark : styles.light}`}>{displayName}</p>
		</button>
		</>
	);
};

export default AccountButton;
