import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUserUrl, getOtherProfileUrl } from '@/utils/url-segments';
import api from '@/utils/api';
import styles from './AccountButton.module.css';
import { getProfileUrl } from '@/utils/url-segments';



const avatarIconPath = "/navbar/icons/avatar.png" // path for the avatar icon.

//takes in a props{username, darkTheme} 
//username can be changed to be the actual user id. 

/*
	Component Props:

	{
		username?: number|string|null;
		noBackground?: boolean;
		darkTheme: boolean;
	}

	username can be a user id or the actual username.
	If it is an id, the component will try to get the user and profile from the server.
	If it is a string, it will only display the name but not redirect correctly.
	If username is not supplied, then the current user is used instead.

	noBackground is a boolean that shows the background color for the text.
	If true, then the background will not appear.
	If empty or false, then the background will appear.

	darkTheme is a boolean and it does stuff with CSS.
*/

const AccountButton = (props) => {
	// This is the name that is displayed on the screen.
	const [displayName, setDisplayName] = useState("");
	// This is the username that can be used to redirect to the user's profile.
	const [profileName, setProfileName] = useState("");

	const [editProfileLink, setEditProfileLink] = useState(false);

	const [darkTheme] = useState(props.darkTheme);
	const router = useRouter();
	const [pfppath, setpfppath] = useState(null);

	
	useEffect(() => {
		const fetchProfile = async () => {

			// If the prop was given a username, we want that to be the username.
			if (props.username != null) {
				if (props.username instanceof String)
				{
					// This block should be changed if the string username
					// needs to be set up.
					setDisplayName(props.username);
				}
				else {
					// Assume username is an id and we need to make an API call.
					try {
						const response = await api.get(`http://localhost:8000/api/users/${props.username}/info/`);

						if (response.status == 200) {
							setProfileName(response.data.username);

							// Now that we have the username, we can get the profile picture
							const response2 = await api.get(getOtherProfileUrl(response.data.username));
							if (response2.status == 200) {
								setpfppath(`http://localhost:8000${response2.data.pfp}`);
								setDisplayName(response2.data.name);
							}
						}
					} catch (error) {
						console.error('Error fetching username profile:', error);
						setpfppath(avatarIconPath)
						setDisplayName('some user')
					}
				}
			} else {
				try {
					// This is for calls that are meant for calls without a
					// username. I think it gets the current user's profile.
					const response = await api.get(getProfileUrl())
					if(response.status == 200){
						setDisplayName(response.data.name);
						setEditProfileLink(true);
						setpfppath(`http://localhost:8000${response.data.pfp}`);
					}
					
				} catch (error) {
					console.error('Error fetching no username profile:', error);
					setpfppath(avatarIconPath);
					setDisplayName('some user');
				}
			}

			
		};

    	fetchProfile();
  	}, []);

	useEffect(() => {
		const getProfileInfo = async () => {
			try{
				// Check if the username is the same as the current user.
				// If it is, then we want the redirect to be to the
				// edit profile page.
				if (props.username != null) {
					const response = await api.get(getCurrentUserUrl());
					console.log("account success", response);

					setEditProfileLink(response.data.id == props.username);
				}
			} catch (error) {
				console.log("account button error!", error);
			}
		}

		getProfileInfo();
	}, []);

	const accountButtonPressed = () => {
		console.log("pressed acc");
		// router.push("/"); <--- go to the user's profile page.
		if (editProfileLink) {
			router.push("/profile/");
		} else if (profileName != "" || profileName != null) {
			router.push(`/profile/${profileName}/`);
		} else {
			alert("Could not get this user's profile.");
		}
		
	};

	return(
		<button className={styles.accountButton} onClick={accountButtonPressed}> 
			<img src={pfppath} className={styles.avatarIcon}/>
			{!props.noBackground &&
				<p className={`${styles.accountText} ${darkTheme ? styles.dark : styles.light}`}>{displayName}</p>
			}
			{props.noBackground &&
				<p className={styles.accountText}>{displayName}</p>
			}
		</button>
	);
};

export default AccountButton;
