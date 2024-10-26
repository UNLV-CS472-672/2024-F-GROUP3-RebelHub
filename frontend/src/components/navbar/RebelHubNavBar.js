"use client"
import React from 'react';
import styles from './RebelHubNavBar.module.css';





const AccountComponent = () => {
	return(
		<button className={styles.accountButton}> 
			<img src="avatar.png" className={styles.avatarIcon}/> 
			<p className={styles.accountText}>Profile Name</p>
		</button>
	);
}


const RebelHubNavBar = () => {

	return (
		<>
		<nav className={styles.nav}>
			<button className={styles.homeButton}> <img src="rebelhub.png" className={styles.homeButtonLogo}/> </button>
			<input className={styles.searchBar} type="text" placeholder="Search..." />
			<button className={styles.messageButton}> <img src="messageicon.png" className={styles.messageIcon}/>  </button>
			<button className={styles.settingsButton}> <img src="settings.png" className={styles.settingsIcon}/> </button>
			<AccountComponent/>
		</nav>
		</>
	);
};


export default RebelHubNavBar;


//<button className={styles.accountButton}> Account </button>
