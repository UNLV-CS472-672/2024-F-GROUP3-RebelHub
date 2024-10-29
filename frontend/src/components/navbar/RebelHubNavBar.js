"use client"
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './RebelHubNavBar.module.css';


const avatarIconPath = "/navbar/icons/avatar.png" // path for the avatar icon.
const messageIconPath = "/navbar/icons/messageicon.png" // path for the message icon.
const settingsIconPath = "/navbar/icons/settings.png" // path for the settings icon.
const logoLightThemePath = "/navbar/logo/logo_light_alt.png" // path for the light theme logo.
const logoDarkThemePath = "/navbar/logo/logo_dark_alt.png" // path for the dark theme logo.
const logoRebelPath = "/navbar/logo/logo.png" // path for the rebel version logo.


const AccountComponent = (props) => {
	const [displayName, setDisplayName] = useState(props.username);
	const [darkTheme] = useState(props.darkTheme);
	const router = useRouter();

	const accountButtonPressed = () => {
		console.log("pressed acc")
		//router.push("/"); <--- go to the user's profile page.
	};

	return(
		<button className={styles.accountButton} onClick={accountButtonPressed}> 
			<img src={avatarIconPath} className={styles.avatarIcon}/> 
			<p className={`${styles.accountText} ${darkTheme ? styles.dark : styles.light}`}>{displayName}</p>
		</button>
	);
}


const RebelHubNavBar = () => {

	const [darkTheme, setDarkTheme] = useState(true);

	const homeButtonPressed = () => {
		console.log("pressed home button");
		//router.push("/"); <--- go to the home page/timeline
	};
	const messageButtonPressed = () => {
		console.log("pressed message button");
		//router.push("/"); <--- go to the dms page 
	};
	const settingsButtonPressed = () => {
		console.log("pressed settings button");
		setDarkTheme(!darkTheme);
		//router.push("/"); <--- go to the settigns page
	};

	return (
		<>
		<nav className={`${styles.nav} ${darkTheme ? styles.dark : styles.light}`}>
			<button className={styles.homeButton} onClick={homeButtonPressed}>
				<img src={darkTheme ? logoDarkThemePath : logoLightThemePath} className={styles.homeButtonLogo}/>
			</button>
			<input className={styles.searchBar} type="text" placeholder="Search..." />
			<button className={styles.messageButton} onClick={messageButtonPressed}>
				<img src={messageIconPath} className={styles.messageIcon}/>
			</button>
			<button className={styles.settingsButton} onClick={settingsButtonPressed}>
				<img src={settingsIconPath} className={styles.settingsIcon}/>
			</button>
			<AccountComponent username="some user" darkTheme={darkTheme}/>
		</nav>
		<div className={styles.extraSpace}> </div>
		</>
	);
};


export default RebelHubNavBar;
