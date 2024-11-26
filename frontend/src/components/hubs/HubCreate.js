"use client"
import { useState, useEffect } from 'react';
import React from 'react';
import api from '@/utils/api';
import styles from './HubCreate.module.css';
import { getCreateHubsUrl } from '@/utils/url-segments';
import { useRouter } from 'next/navigation';
/*
 * id
 * name
 * description
 * owner
 * members
 * created at
 * private hub
*/
const HubCreate = () => {

	const [hubListData, setHubListData] = useState([]);

	const [hubName, setHubName] = useState("");
	const [hubDescription, setHubDescription] = useState("");
	const [hubPrivate, setHubPrivate] = useState(false);
	const [nameError, setNameError] = useState(false);
	const [descriptionError, setDescriptionError] = useState(false);
	const [nameErrorMessage, setNameErrorMessage] = useState("");
	const [descriptionErrorMessage, setDescriptionErrorMessage] = useState("");
	const router = useRouter();

	useEffect(() => {
		const getHubsInfo = async () => {
			    try {
				const response = await api.get(`api/hubs/`);
				if(response.status == 200) {
				    setHubListData(response.data);
					console.log("data: ", response.data);
				}
			    } catch (error) {
				alert(error);
			    }
		}
		getHubsInfo();
     	}, []);

	const hubCreateSubmit = async (e) => {
		e.preventDefault();
		const hubCreateData = {
			name: hubName,
			description: hubDescription,
			private_hub: hubPrivate
		}
		try {
			const response = await api.post(getCreateHubsUrl(), hubCreateData);
			const id = response.data.id;
			router.push(`/hubs/${id}`);
		} catch(error){
			console.log("error creating hub", error);
			console.log(error.request.response);
			var e1 = false;
			var e2 = false;
			if(error.response.data.name)
			{
				setNameErrorMessage(error.response.data.name[0].toUpperCase());
				setNameError(true);
				e1 = true;
			}
			if(error.response.data.description)
			{
				setDescriptionErrorMessage(error.response.data.name[0].toUpperCase());
				setDescriptionError(true);
				e2 = true;
			}
			if(!e1 && !e2)
			{
				alert("Something went wrong! Try Again Later.\n" + error.message);
			}
		}
	}

	return(
		<>
		<div className={styles.createContainer} >
			<h1 className={styles.createHeader}> Create a Hub! </h1>
			<p className={styles.createDesc}> 
				Create your very own hub here. Start a hub about your favorite academic topic,
				sports on campus, clubs on campus, or anything that sparks your interest! After
				creating a hub others can join and will be able to share their thoughts and opinions
				in a welcoming enviornment.
			</p>

			<form onSubmit={hubCreateSubmit}>
				<h2 className={styles.createNameHeader} > Hub Name </h2>
				<input 
					className={styles.createNameInput}
					type="text"
					placeholder="Enter a name for your hub."
					value={hubName}
					onChange={(text) => {setNameError(false);
							     setNameErrorMessage("");
						  	     setHubName(text.target.value);} }
				/>
				{nameError && <p> {nameErrorMessage} </p> }
				<h2 className={styles.createDescHeader} > Hub Description </h2>
				<textarea 
					className={styles.createDescInput}
					cols="90"
					rows="15"
					placeholder="Enter a description for your hub."
					value={hubDescription}
					onChange={(text) => {setDescriptionError(false); 
							     setDescriptionErrorMessage(""); 
							     setHubDescription(text.target.value);} }
				/>
				{descriptionError && <p> {descriptionErrorMessage} </p> }
				<div className={styles.createRadioContainer} >
					<input 
						type="radio"
						id="priv"
						checked={hubPrivate === true}
						onChange={() => setHubPrivate(true)}
					/> 
					<label for="priv">Private Hub</label><br/>

					<input 
						type="radio"
						id="pub"
						checked={hubPrivate === false}
						onChange={() => setHubPrivate(false)}
					/> 
					<label for="pub">Public Hub</label>
				</div>

				<button type="submit" className={styles.createSubmitButton} >
					Create Hub!
				</button>
			</form>
		</div>
		</>
		
	);
};

export default HubCreate;
