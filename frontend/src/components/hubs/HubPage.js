"use client"
import { useState, useEffect, useCallback } from 'react';
import React from 'react';
import { useRouter } from 'next/navigation';
import styles from './HubPage.module.css';
import api from '@/utils/api';
import PostList from '@/components/posts/post-list';
import MemberList from '@/components/hubs/MemberList';
import HubEdit from '@/components/hubs/HubEdit';
import HubEvent from '@/components/hubs/HubEvent';
import PostTagUpdateModal from '@/components/hubs/PostTagUpdateModal.js';
import AccountButton from '@/components/navbar/AccountButton';
import { getHubUrl, getCurrentUserUrl, getPostsHubUrl , getRequestJoinHubUrl, getCancelRequestJoinHubUrl, getJoinHubUrl, getUpdateHubUrl, getLeaveHubUrl, getDeleteHubUrl, getPostTagsUrl, getHubTagsForAHubUrl, getUpdateHubTagsUrl } from "@/utils/url-segments";
import { convertUtcStringToLocalString } from '@/utils/datetime-conversion';
import FilterPostButtons from '@/components/FilterButtons/FilterPostButtons';
import CreateForm from '../Calendar/CreateForm';

import CreatePostButton from '../posts/buttons/create-post-button';
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
	const [postTags, setPostTags] = useState([]);

	const [hubOwnerId, setHubOwnerId] = useState(-1);
	const [hubOwnerUsername, setHubOwnerUsername] = useState("");
	const [membersData, setMembersData] = useState([]);
	const [pendingMembersData, setPendingMembersData] = useState([]);
	const [moddingMembersData, setModdingMembersData] = useState([]);

	const [hubPosts, setHubPosts] = useState([]);

	const [isEditing, setIsEditing] = useState(false);

	const [showTagUpdate, setShowTagUpdate] = useState(false);
	const [hubTags, setHubTags] = useState([]);

	// Event stuff

	const [events, setEvents] = useState([]);
	const [isCreateOpen, setIsCreateOpen] = useState(false);

	const router = useRouter();

	// Get the post tags and hub tags for the hub
	useEffect(() => {
		const fetchPostTags = async () => {
			try {
				const response = await api.get(getPostTagsUrl(id));
				setPostTags(response.data);
			} catch (error) { console.log("Error fetching post tags: ", error); }
		};
		fetchPostTags();
		const fetchHubTags = async () => {
			try {
				const response = await api.get(getHubTagsForAHubUrl(id));
				setHubTags(response.data);
			} catch (error) { console.log("Error fetching hub tags: ", error); }
		};
		fetchHubTags();
    }, []);
	const [previewImage, setPreviewImage] = useState(null);
	const [previewBanner, setPreviewBanner] = useState(null);
  
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
				const response = await api.get(getPostsHubUrl(id, null, 'week', 'hot'));
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
				    } catch (error) {
					console.log("error fetching a member's info");
					console.log(error);
				    }
				}
				setMembersData(members);
			}
		};
		const getPendingMembersInfo = async () => {
			if(hubData.pending_members)
			{
				const pendingMembers = [];
				for(const UserId of hubData.pending_members)
				{
					try{
						const response = await api.get(`http://localhost:8000/api/users/${UserId}/info`);
						pendingMembers.push(response.data);
					} catch (error) {
						console.log("error fetching a pending member's info");
						console.log(error);
					}
				}
				setPendingMembersData(pendingMembers);
			}
		};
		const getModdingMembersInfo = async () => {
			if(hubData.mods)
			{
				const moddingMembers = [];
				for(const UserId of hubData.mods)
				{
					try{
						const response = await api.get(`http://localhost:8000/api/users/${UserId}/info`);
						moddingMembers.push(response.data);
					} catch (error) {
						console.log("error fetching a modding member's info");
						console.log(error);
					}
				}
				setModdingMembersData(moddingMembers);
			}
		};
		const getHubOwnerId = async () => {
			if(hubData.owner)
			{
				setHubOwnerId(hubData.owner);
				try{
					const response = await api.get(`http://localhost:8000/api/users/${hubData.owner}/info`);
					setHubOwnerUsername(response.data.username);
				} catch (error) {
					console.log("error fetching owner username", error);
				}
			}
		};

		getMembersInfo();
		getPendingMembersInfo();
		getModdingMembersInfo();
		getHubOwnerId();
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
	};
  
	const acceptEdit = async (name, description, private_hub, filteredTags, bg, banner) => {
		//const updateInfo = {"name": name, "description": description, "private_hub": private_hub};
    setHubTags(filteredTags);
			const response2 = await api.patch(getUpdateHubTagsUrl(hubData.id), {tags: filteredTags.map(tag => tag.id)});
		const updateInfo = new FormData();
		updateInfo.append("name", name);
		updateInfo.append("description", description);
		updateInfo.append("private_hub", private_hub);
		if(bg)
			updateInfo.append("bg", bg);
		if(banner)
			updateInfo.append("banner", banner);
		try{
			const response = await api.put(getUpdateHubUrl(hubData.id), updateInfo, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});
			setIsEditing(false);
			setPreviewImage(null);
			setPreviewBanner(null);
			setRefreshCount((count) => count+=1);
		} catch (error){
			if(error.response.data.name)
			{
				alert("Name: " + error.response.data.name[0]);
			}
			else if(error.response.data.description)
			{
				alert("Description: " + error.response.data.description[0]);
			}
			else
			{
				alert("Something went wrong! " + error.message);
			}
			console.log("error updating hub");
		}
	};
	const cancelEdit = () => {
		setIsEditing(false);
		setPreviewImage(null);
		setPreviewBanner(null);
		setRefreshCount((count) => count+=1);
	};

	const handleSuccess = (data) => {
		console.log("Success!", data);
		setRefreshCount((count) => count+=1);
	};

	const handleRevokeRequestToJoin = async () => {
		try {
			const response = await api.put(getCancelRequestJoinHubUrl(hubData.id));
			handleSuccess(response.data);
		} catch(error) {
			alert(error);
		}

	};

	const handleRequestToJoin = async () => {
		try {
			const response = await api.put(getRequestJoinHubUrl(hubData.id));
			handleSuccess(response.data);
		} catch (error) {
			alert(error);
		}
	};

	const handleJoin = async () => {
		try {
			const response = await api.put(getJoinHubUrl(hubData.id));
			handleSuccess(response.data);
		} catch (error) {
			alert(error);
		}
	};

	const handleLeave = async () => {
		try {
			const response = await api.put(getLeaveHubUrl(hubData.id));
			handleSuccess(response.data);
		} catch (error) {
			alert(error);
		}
	};

	const handleDeleteHub = async () => {
		try {
			const response = await api.delete(getDeleteHubUrl(hubData.id));
			router.push(`/hubs/`);
		} catch (error) {
			console.log(error);
			alert(error);
		}

	};

	// Event stuff

	const openCreateForm = () => {
		setIsCreateOpen(true);
		console.log("Opening create form.");
	}

	const createEvent = (newEvent) => {
		setEvents((prev) => [newEvent, ...prev]);
		console.log("Created event: ", newEvent.title);
	}

	const closeCreateForm = () => {
		setIsCreateOpen(false);
		console.log("Closing create form");
	} 


	//general info.
	const hubOwner = hubData.owned;
	const hubMod = hubData.modding;
	const hubJoined = hubData.joined;
	const hubPrivate = hubData.private_hub;
	const hubPending = hubData.pending; //user is waiting to join.
	const created_date = convertUtcStringToLocalString(hubData.created_at);

	const HubPageMainContent = () => {
		return(
			<div className={styles.parentContentContainer}>
				<div className={styles.eventContainer}>
					<h1 className={styles.eventSectionTitle}> Latest Events </h1>
					<button onClick={openCreateForm}>Create</button>
					<HubEvent data={hubData.events} />
				</div>
				<div className={styles.postTitleContainer}>
					<h1 className={styles.postTitle}> Latest Posts </h1>
				</div>
				<div className={styles.hubPageContentContainer}>
					<PostList className={styles.postsList} posts={hubPosts}/>
					<div className={styles.membersListsContainer}>
						<CreatePostButton hubId={id} buttonStyle={styles.hubActionButton}/>
						<MemberList 
							hubId={hubData.id}
							hubOwnerId={hubOwnerId}
							memberList={(hubOwner || hubMod) ?  (membersData.filter(member => !pendingMembersData.some(pending => pending.id == member.id) &&
											    !moddingMembersData.some(modding => modding.id == member.id))) 
											    :
											    (membersData)}
							isPending={false}
							isModList={false}
							hasPermission={(hubOwner)}
							onSuccess={handleSuccess}
						/>
						{(hubOwner || hubMod) && hubPrivate &&
							<MemberList 
								hubId={hubData.id}
								hubOwnerId={hubOwnerId}
								memberList={pendingMembersData}
								isPending={true}
								isModList={false}
								hasPermission={true} 
								onSuccess={handleSuccess}
							/>
						}
						{(hubOwner || hubMod) &&
							<MemberList
								hubId={hubData.id}
								hubOwnerId={hubOwnerId}
								memberList={moddingMembersData}
								isPending={false}
								isModList={true}
								hasPermission={(hubOwner)}
								onSuccess={handleSuccess}
							/>
						}
						{(hubOwner || hubMod) && <button
						className={styles.hubActionButton}
						style={{backgroundColor: 'rgba(0,0,0,0.9)'}}
						onClick={() => setShowTagUpdate(previous => !previous)}
						>
						CHANGE TAGS</button>}
						{hubOwner ? (<button 
							className={styles.hubActionButton}
							style={{backgroundColor: 'rgba(0,0,0,0.9)'}}
							onClick={() => {
								const isConfirmed = window.confirm("Are you sure you want to delete this hub?");
								if(isConfirmed)
								{
									handleDeleteHub();
								}
							}}
						     > 
							DELETE HUB 
						     </button>) :
					    (hubJoined ? (<button 
						   		className={styles.hubActionButton}
						    		style={{backgroundColor: 'rgba(0,0,0,0.9)'}}
						    		onClick={() => {
									const isConfirmed = window.confirm("Are you sure you want to leave this hub?");
									if(isConfirmed)
									{
										handleLeave();
									}
								}}
						    	  > 
						    		LEAVE HUB 
						    	  </button>) :
					     (<button
						     className={styles.hubActionButton} 
						     onClick={handleJoin}
					      > 
						     JOIN HUB 
					      </button>))}
					
					</div>
				</div>
			</div> 
		);
	};

	const HubPagePrivateContent = () => {
		return(
			<>
			{hubPending ? 
				(<button className={styles.hubActionButton} style={{backgroundColor:'rgba(0,0,0,0.9)'}} onClick={handleRevokeRequestToJoin}> Take Back Request To Join </button>) 
				: 
				(<button className={styles.hubActionButton} onClick={handleRequestToJoin}> Request To Join </button>)}
			</>
		);
	};

	const passData = (data) => {
		setPreviewImage(data);
	};
	const passBanner = (data) => {
		setPreviewBanner(data);
	};

	return (
		<>
		<div className={styles.hubHeader} style={{backgroundImage: isEditing && previewBanner ? `url(${previewBanner})` : `url(${hubData.banner})`, backgroundColor: hubData.banner ? "transparent" : "rgba(227,24,55,0.7)"}}>
			{isEditing ? ( 
				<>
				<HubEdit
					hubId={hubData.id}
					oldName={hubData.name}
					oldDescription={hubData.description}
					oldPrivate={hubData.private_hub}
					onClickAccept={acceptEdit}
					onClickDecline={cancelEdit}
					passData={passData}
					passBanner={passBanner}
				/>
				</>
				
			):
				<div className={styles.hubViewContainer}>
					<div className={styles.hubViewHeading}>
						<div className={styles.hubTagList}>
							{hubTags.length != 0 && hubTags.map(tag => <h2 style={{backgroundColor:tag.color}} className={styles.hubTag}>{tag.name}</h2>)}
						</div>
						<h1 className={styles.hubName}> {hubData.name} </h1><br/>
						<p className={styles.hubDescription}>{hubData.description} </p>
						{hubOwner && <button className={styles.hubActionButton} onClick={() => editButtonPress()}> Edit </button> }
					</div>
					<div className={styles.hubViewDetails}>
						<div 
							style={{
								backgroundColor: 'rgba(227,24,55,0.7)', padding: '10px', color: 'white', display:'flex',
									borderRadius: '10px'
							}}
						>
							<p> Owner: </p>
							<AccountButton username={hubOwnerId} noBackground={true} />
						</div>
						<div 
							style={{
								backgroundColor: 'transparent', padding: '10px', color: 'white', display:'flex',
									borderRadius: '10px', justifyContent: 'center', paddingBottom: '0px'
							}}
						>
							<p className={styles.hubTimestamp}> Created At: {created_date.slice(0, created_date.length-6)} </p>
						</div>
					</div>
				</div>
			}
		</div>
		<div className={styles.pageBG} style={{backgroundImage: isEditing && previewImage ? `url(${previewImage})` : `url(${hubData.bg})`}}>
			
					
			{/* the hubs calander events component can go here */}
			<div className={styles.filterButtons}>
				<FilterPostButtons 
					posts={hubPosts} 
					setPosts={setHubPosts} 
					postsUrl={getPostsHubUrl} 
					current_hub_id={id} 
					tags={postTags} 
				/>
			</div>

			{showTagUpdate && <PostTagUpdateModal hub={id} onClose={() => setShowTagUpdate(false)} setTags={setPostTags} setHubPosts={setHubPosts}/>}
			 {/*nothing is where the request buttons should
		            appear and any other content a private hub
			    should display*/}
			{(hubPrivate && !hubJoined) ? (
				<HubPagePrivateContent/>
			) : (
				<HubPageMainContent/>
			)}
			
			{isCreateOpen && <CreateForm onClose={closeCreateForm} onCreate={createEvent} hubsModding={[id]}/>}
			
		</div>
		</>
	);
};

export default HubPage;
