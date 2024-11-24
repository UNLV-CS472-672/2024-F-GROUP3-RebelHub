"use client"
import { useState, useEffect, useCallback } from 'react';
import React from 'react';
import styles from './HubPage.module.css';
import api from '@/utils/api';
import PostList from '@/components/posts/post-list';
import { getHubUrl, getCurrentUserUrl, getPostsHubUrl , getAcceptoinHubUrl ,
	 getDeclineJoinHubUrl, getKickHubUrl, getUpdateHubUrl} from "@/utils/url-segments";
import { convertUtcStringToLocalString } from '@/utils/datetime-conversion';
/*
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
	const [membersData, setMembersData] = useState([]);
	const [pendingMembersData, setPendingMembersData] = useState([]);
	const [hubPosts, setHubPosts] = useState([]);
	const [refreshCount, setRefreshCount] = useState(0);
	const [isEditing, setIsEditing] = useState(false);
	const [editName, setEditName] = useState("");
	const [editDescription, setEditDescription] = useState("");

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

	const memberClick = () => {
		alert("REDIRECT TO USERS PAGE");
	}
	const pendingMemberAddButton = async (id) => {
		const req = {"user_id": id};
		try{
			const response = await api.put(getAcceptoinHubUrl(hubData.id), req);
			console.log("added member into hub");
			setRefreshCount((count) => count += 1);
		} catch (error) {
			alert(error);
			console.log(error);
		}
	}

	const pendingMemberRemoveButton = async (id) => {
		const req = {"user_id": id};
		try{
			const response = await api.put(getDeclineJoinHubUrl(hubData.id), req);
			console.log("removed member from pending");
			setRefreshCount((count) => count += 1);
		} catch (error) {
			alert(error);
			console.log("error removing from pending", error);
		}
	}
	const memberKickButton = async (id) => {
		const req = {"user_id": id};
		try{
			const response = await api.put(getKickHubUrl(hubData.id), req);
			console.log("kicked member from hub");
			setRefreshCount((count) => count += 1);
		} catch (error) {
			console.log(error);
			alert(error);
		}
	}
	const MemberItem = ({data, pending, hasPermission}) => {
		console.log("member id: ", data.id);
		return (
			<>
			<button className={styles.memberItemButton} onClick={memberClick} >{data.username} </button>

			{pending && 
				<button className={styles.acceptPendingButton} onClick={() => pendingMemberAddButton(data.id)}> ADD </button>
			}
			{pending &&
				<button className={styles.declinePendingButton} onClick={() => pendingMemberRemoveButton(data.id)}> REMOVE </button>
			}

			{!pending && 
			 hasPermission && 
				<button className={styles.acceptPendingButton} onClick={() => memberKickButton(data.id)}> KICK </button>
			}
			</>
		);
	};

	const editButtonPress = () => {
		setIsEditing(!isEditing);
		console.log("is editing : ", isEditing);
	};

	const created_date = convertUtcStringToLocalString(hubData.created_at);
	const hubOwner = hubData.owned;
	const hubMod = hubData.modding;
	const hubJoined = hubData.joined;
	const hubPrivate = hubData.private_hub;

	const handleNameInputChange = (e) => setEditName(e.target.value);
	const handleDescriptionInputChange = (e) => setEditDescription(e.target.value);

	const HubNameInput = () => {
		return(
			<input 
				type="text"
				className={styles.editHubName}
				placeholder="New Title" 
				value={editName}
				onChange={handleNameInputChange}
			/>
		);
	};

	const HubDescriptionInput = () => {
		return(
			<textarea
				className={styles.editHubDescription}
				cols="90"
				rows="15"
				placeholder="New Description"
				value={editDescription}
				onChange={handleDescriptionInputChange}
			/>
		);
	};

	const acceptEdit = async () => {
		const updateInfo = {"name": editName, "description": editDescription};
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
		setIsEditing(false);
		setRefreshCount((count) => count+=1);
	};

	const HubPageMainContent = () => {
		return(
			<>
			<div className={styles.parentContentContainer} >
				<div className={styles.postTitleContainer} >
					<h1 className={styles.postTitle} > Latest Posts </h1>
				</div>
				{/* main content container for the hub page */}
				<div className={styles.hubPageContentContainer}>
					<PostList className={styles.postsList} posts={hubPosts}/>
					<div className={styles.membersListsContainer}>
						{/* first members list shows all the members of a hub*/}
						<div className={styles.membersList}>
							<h2 className={styles.membersListHeader} > Members </h2>
							<ul>
							{membersData.map((member, index) => (
								<li className={styles.memberLI} key={index} >
									<MemberItem data={member} hasPermission={hubOwner || hubMod} pending={false}/>
								</li>
							))}
							</ul>
						</div>
						{/* if the user is the hub owner a hub moderator they will see
							the pending members list */}
						{(hubOwner || hubMod) && 
							<div className={styles.pendingMembersList}>
								<h2 className={styles.pendingMembersListHeader} > Pending </h2>
								{pendingMembersData.length == 0 && <p style={{color:'black'}}> No pending Members </p>}
								<ul>
								{pendingMembersData.map((member, index) => (
									<li className={styles.memberLI} key={index} >
										<MemberItem data={member} hasPermission={true} pending={true}/>
									</li>
								))}
								</ul>
							</div>
						}
					</div>
				</div>
			</div> {/* end of content container*/}
			</>
		);
	};

	return (
		<>
		<div className={styles.pageBG} >
			<div className={styles.hubViewContainer}>
				{!isEditing && (
					<>
					<div className={styles.hubViewHeading}>
						<h1 className={styles.hubName}> {hubData.name} </h1><br/>
							{hubOwner && <button className={styles.updateHubInfoBtn} onClick={() => editButtonPress()}> Edit </button> }
					</div>
					<p className={styles.hubDescription}>{hubData.description} </p>
					<div className={styles.hubViewDetails}>
						<p className={styles.hubOwner}> Owned By: {hubData.owner} </p>
						<p className={styles.hubTimestamp}> Created At: {created_date.slice(0, created_date.length-6)} </p>
					</div>
					</>
				)}
				{isEditing && (
					<>
					<div className={styles.editViewContainer}>
						<div className={styles.hubViewHeading}>
							<HubNameInput />
						</div>
						<HubDescriptionInput />
						<button className={styles.acceptEditBtn} onClick={() => acceptEdit()}> Accept </button>
						<button className={styles.cancelEditBtn} onClick={() => cancelEdit()}> Cancel </button>
					</div>
					</>
				)}
			</div>
			{/* the hubs calander events component can go here */}

			 {/*nothing is where the request buttons should
		            appear and any other content a private hub
			    should display*/}
			{hubPrivate ? (
				hubJoined ? <HubPageMainContent /> : <p> NOTHING </p>
			) : (
				<HubPageMainContent/>
			)}
			
		</div>
		</>
	);
};

export default HubPage;
