"use client"
import { useState, useEffect } from 'react';
import React from 'react';
import styles from './HubPage.module.css';
import api from '@/utils/api';
import PostList from '@/components/posts/post-list';
import { getHubUrl, getCurrentUserUrl, getPostsHubUrl } from "@/utils/url-segments";
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
	const [hubPosts, setHubPosts] = useState([]);

	useEffect(() => {
		const getHubInfo = async () => {
			    try {
				const response = await api.get(getHubUrl(id));
				if(response.status == 200) {
				    setHubData(response.data);
					console.log("data: ", response.data);
				}
			    } catch (error) {
				alert(error);
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
				alert(error);
			    }
		}
		getHubInfo();
		getPostsHub();
     	}, [id]);

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
					alert(error);
				    }
				}
				setMembersData(members);
			}
		}
		getMembersInfo();
		console.log(membersData);
     	}, [hubData]);

	const memberClick = () => {
		alert("REDIRECT TO USERS PAGE");
	}
	const MemberItem = (data) => {
		return (
			<button className={styles.memberItemButton} onClick={memberClick} >{data.data.username} </button>
		);
	};

	const created_date = convertUtcStringToLocalString(hubData.created_at);
	const hubOwner = hubData.owned;
	const hubMod = hubData.modding;

	return (
		<>
		<div className={styles.pageBG} >
			<div className={styles.hubViewContainer}>
				<div className={styles.hubViewHeading}>
					<h1 className={styles.hubName}> {hubData.name} </h1><br/>
					{hubOwner && <button className={styles.updateHubInfoBtn}> Edit </button> }
				</div>
				<p className={styles.hubDescription}>{hubData.description} </p>
				<div className={styles.hubViewDetails}>
					<p className={styles.hubOwner}> Owned By: {hubData.owner} </p>
					<p className={styles.hubTimestamp}> Created At: {created_date.slice(0, created_date.length-6)} </p>
				</div>
			</div>
			{/* the hubs calander events component can go here */}
			<div className={styles.parentContentContainer} >
				<div className={styles.postTitleContainer} >
					<h1 className={styles.postTitle} > Latest Posts </h1>
					<div className={styles.hubPageContentContainer}>
						<PostList className={styles.postsList} posts={hubPosts}/>
						<div className={styles.membersList}>
							<h2 className={styles.membersListHeader} > Members </h2>
							<ul>
							{membersData.map((member, index) => (
								<li className={styles.memberLI} key={index} >
									<MemberItem data={member}/>
								</li>
							))}
							</ul>
						</div>
					</div>
				</div>
			</div>
		</div>
		</>
	);
};

export default HubPage;
