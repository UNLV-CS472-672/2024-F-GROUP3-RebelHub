"use client"
import { useState, useEffect, useCallback } from 'react';
import React from 'react';
import styles from './HubPage.module.css';
import api from '@/utils/api';
import PostList from '@/components/posts/post-list';
import MemberList from '@/components/hubs/MemberList';
import HubEdit from '@/components/hubs/HubEdit';
import { getHubUrl, getCurrentUserUrl, getPostsHubUrl , getUpdateHubUrl} from "@/utils/url-segments";
import { convertUtcStringToLocalString } from '@/utils/datetime-conversion';
/*
 * HUBDATA:
 * id
 * name
 * description
 * owner
 * members
 * created at
 * private hub
*/

const HubPage = ({id}) => {

	const [hubData, setHubData] = useState([]);
	const [refreshCount, setRefreshCount] = useState(0);

	const [membersData, setMembersData] = useState([]);
	const [pendingMembersData, setPendingMembersData] = useState([]);

	const [hubPosts, setHubPosts] = useState([]);

	const [isEditing, setIsEditing] = useState(false);


	/*
	 * Calls the get hub by id so we can store the hub info.
	 *
	 * we also get the posts list for this hub.
	 */
	useEffect(() => {
		const getHubInfo = async () => {
			    try {
				const response = await api.get(getHubUrl(id));
				if(response.status == 200) {
				    setHubData(response.data);
					console.log("data: ", response.data);
				}
			    } catch (error) {
				console.log("error getting hub info");
			    }
		}
		const getPostsHub = async () => {
			    try {
				const response = await api.get(getPostsHubUrl(id));
				if(response.status == 200) {
				    setHubPosts(response.data);
					console.log("data: ", response.data);
				}
			    } catch (error) {
			        console.log("error getting post info");
			    }
		}
		getHubInfo();
		getPostsHub();
     	}, [id, refreshCount]);

	/* When hub data is loaded/updated we make sure to get a fresh
	 * list of members and pending members and store them in our state.
	 *
	 * these member lists are passed to the memberlist componenet.
	 */
	useEffect(() => {
		const getMembersInfo = async () => {
			if(hubData.members)
			{
				const members = [];	
				for(const UserId of hubData.members)
				{
				    try {
					const response = await api.get(`http://localhost:8000/api/users/${UserId}/info`);
					members.push(response.data);
					console.log("response:", response.data);
				    } catch (error) {
					console.log("error fetching a member's info");
					console.log(error);
				    }
				}
				setMembersData(members);
			}
		}
		const getPendingMembersInfo = async () => {
			if(hubData.pending_members)
			{
				const pendingMembers = [];
				for(const UserId of hubData.pending_members)
				{
					try{
						const response = await api.get(`http://localhost:8000/api/users/${UserId}/info`);
						pendingMembers.push(response.data);
						console.log("response: ", response.data);
					} catch (error) {
						console.log("error fetching a pending member's info");
						console.log(error);
					}
				}
				setPendingMembersData(pendingMembers);
			}
		}
		getMembersInfo();
		getPendingMembersInfo();
		console.log(membersData);
		console.log(pendingMembersData);
     	}, [hubData]);


	/*isEditing state management
	 *
	 * we keep keep track of editing by the accept, cancel, and edit button
	 * edit button lives on the hub page and is visible if you're owner.
	 *
	 * accept and cancel buttons live in the HubEdit component, but
	 * we pass in the acceptEdit and cancelEdit functions. That way
	 * we keep control of the isEditing state.
	 */
	const editButtonPress = () => {
		setIsEditing(true);
		console.log("is editing : ", isEditing);
	};
	const acceptEdit = async (name, description, private_hub) => {
		const updateInfo = {"name": name, "description": description, "private_hub": private_hub};
		try{
			const response = await api.put(getUpdateHubUrl(hubData.id), updateInfo);
			setIsEditing(false);
			setRefreshCount((count) => count+=1);
		} catch (error){
			alert(error);
			console.log("error updating hub");
		}
	};
	const cancelEdit = () => {
		console.log("Cancel edit (beg)!! isEditing=", isEditing);
		setIsEditing(false);
		setRefreshCount((count) => count+=1);
		console.log("Cancel edit (end)!! isEditing=", isEditing);
	};

	const handleSuccess = (data) => {
		console.log("Success!", data);
		setRefreshCount((count) => count+=1);
	};

	//general info.
	const hubOwner = hubData.owned;
	const hubMod = hubData.modding;
	const hubJoined = hubData.joined;
	const hubPrivate = hubData.private_hub;
	const created_date = convertUtcStringToLocalString(hubData.created_at);

	const HubPageMainContent = () => {
		return(
			<div className={styles.parentContentContainer}>
				<div className={styles.postTitleContainer}>
					<h1 className={styles.postTitle}> Latest Posts </h1>
				</div>
				<div className={styles.hubPageContentContainer}>
					<PostList className={styles.postsList} posts={hubPosts}/>
					<div className={styles.membersListsContainer}>
						<MemberList 
							hubId={hubData.id}
							memberList={membersData}
							isPending={false}
							hasPermission={(hubOwner || hubMod)}
							onSuccess={handleSuccess}
						/>
						{(hubOwner || hubMod) && hubPrivate &&
							<MemberList 
								hubId={hubData.id}
								memberList={pendingMembersData}
								isPending={true}
								hasPermission={true} 
								onSuccess={handleSuccess}
							/>
						}
					</div>
				</div>
			</div> 
		);
	};

	return (
		<div className={styles.pageBG} >
			{isEditing ? ( 
				<HubEdit
					hubId={hubData.id}
					oldName={hubData.name}
					oldDescription={hubData.description}
					oldPrivate={hubData.private_hub}
					onClickAccept={acceptEdit}
					onClickDecline={cancelEdit}
				/>
				
			):
				<div className={styles.hubViewContainer}>
					<div className={styles.hubViewHeading}>
						<h1 className={styles.hubName}> {hubData.name} </h1><br/>
						{hubOwner && <button className={styles.updateHubInfoBtn} onClick={() => editButtonPress()}> Edit </button> }
					</div>
					<p className={styles.hubDescription}>{hubData.description} </p>
					<div className={styles.hubViewDetails}>
						<p className={styles.hubOwner}> Owned By: {hubData.owner} </p>
						<p className={styles.hubTimestamp}> Created At: {created_date.slice(0, created_date.length-6)} </p>
					</div>
				</div>
			}
					
			{/* the hubs calander events component can go here */}

			 {/*nothing is where the request buttons should
		            appear and any other content a private hub
			    should display*/}
			{(hubPrivate && !hubJoined) ? (
				<p> NOTHING </p>
			) : (
				<HubPageMainContent/>
			)}
			
		</div>
	);
};

export default HubPage;
