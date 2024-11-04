"use client"

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './AccountButton.module.css';


const avatarIconPath = "/navbar/icons/avatar.png" // path for the avatar icon.

//takes in a props{username, darkTheme} 
//username can be changed to be the actual user id. 


const AccountButton = (props) => {
	const [displayName, setDisplayName] = useState(props.username);
	const [darkTheme] = useState(props.darkTheme);
	const router = useRouter();

	const accountButtonPressed = () => {
		console.log("pressed acc")
		//router.push("/"); <--- go to the user's profile page.
	};

	return(
		<>
		<button className={styles.accountButton} onClick={accountButtonPressed}> 
			<img src={avatarIconPath} className={styles.avatarIcon}/> 
			<p className={`${styles.accountText} ${darkTheme ? styles.dark : styles.light}`}>{displayName}</p>
		</button>
		</>
	);
};

export default AccountButton;
