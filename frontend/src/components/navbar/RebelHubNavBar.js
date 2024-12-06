"use client"
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './RebelHubNavBar.module.css';

import AccountButton from '@/components/navbar/AccountButton';
import Searchbar from "@/components/searchbar/searchbar";
import Searchresults from "@/components/searchbar/searchresults";

const messageIconPath = "/navbar/icons/messageicon.png" // path for the message icon.
const settingsIconPath = "/navbar/icons/settings.png" // path for the settings icon.
const logoLightThemePath = "/navbar/logo/logo_light_alt.png" // path for the light theme logo.
const logoDarkThemePath = "/navbar/logo/logo_dark_alt.png" // path for the dark theme logo.
const logoRebelPath = "/navbar/logo/logo.png" // path for the rebel version logo.
const logoReturnKeyPath = "/navbar/logo/logoreturn.png" // path for the rebel hub return key logo.

const RebelHubNavBar = () => {
	const router = useRouter();
	const [results,setResults]=useState([]);
	const [darkTheme, setDarkTheme] = useState(true);

	const homeButtonPressed = () => {
		console.log("pressed home button");
		//router.push("/"); <--- go to the home page/timeline
		router.push("/")
	};
	const messageButtonPressed = () => {
		console.log("pressed message button");
		window.location.href='/messages/';
	};
	const settingsButtonPressed = () => {
		console.log("pressed settings button");
		router.push("/profile/editprofile/");
	};

	return (
		<>
		<nav className={`${styles.nav} ${darkTheme ? styles.dark : styles.light}`}>
			<button className={styles.homeButton} onClick={homeButtonPressed}>
				<img src={logoReturnKeyPath/*darkTheme ? logoDarkThemePath : logoLightThemePath*/} className={styles.homeButtonLogo}/>
			</button>
			<Searchbar setResults={setResults}/>
			<Searchresults results={results}/>
			<button className={styles.messageButton} onClick={messageButtonPressed}>
				<img src={messageIconPath} className={styles.messageIcon}/>
			</button>
			<button className={styles.settingsButton} onClick={settingsButtonPressed}>
				<img src={settingsIconPath} className={styles.settingsIcon}/>
			</button>
			<AccountButton darkTheme={darkTheme}/>
		</nav>
		<div className={styles.extraSpace}> </div>
		</>
	);
};

export default RebelHubNavBar;
