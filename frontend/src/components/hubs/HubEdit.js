import { useState, useEffect } from 'react';
import React from 'react';
import styles from './HubEdit.module.css';

const HubEdit = ({hubId, oldName, oldDescription, oldPrivate, onClickAccept, onClickDecline, passData}) => {
	//start initail state as the old name/description in case
	//you only wanna update one or the other.
	const [hubName, setHubName] = useState(oldName);
	const [hubDescription, setHubDescription] = useState(oldDescription);
	const [hubPrivate, setHubPrivate] = useState(oldPrivate);
	const [image, setImage] = useState(null);
	const [bannerImage, setBannerImage] = useState(null);

	useEffect (() => {
		if(image){
			const imageUrl = URL.createObjectURL(image);
			passData(imageUrl);
			return () => URL.revokeObjectURL(imageUrl);
		}
	}, [image]);

	useEffect (() => {
		if(bannerImage){
			const bannerUrl = URL.createObjectURL(bannerImage);
			return () => URL.revokeObjectURL(bannerUrl);
		}
	}, [bannerImage]);

	return (
		<div className={styles.editViewContainer}>
			<input 
				type="text"
				className={styles.editHubName}
				placeholder="New Title" 
				value={hubName}
				onChange={(e) => setHubName(e.target.value)}
			/>
			<textarea
				className={styles.editHubDescription}
				cols="90"
				rows="15"
				placeholder="New Description"
				value={hubDescription}
				onChange={(e) => setHubDescription(e.target.value)}
			/>
			<label>
				<input type="radio" id="toggle-private" checked={hubPrivate} onChange={(e) => setHubPrivate(true)}/>
				Private
			</label>
			<label>
				<input type="radio" id="toggle-public" checked={!hubPrivate} onChange={() => setHubPrivate(false)}/>
				Public
			</label>
			<input
				type="file"
				id="image"
				onChange={(e) => setImage(e.target.files[0])}
			/>
			<input
				type="file"
				id="banner-image"
				onChange={(e) => setBannerImage(e.target.files[0])}
			/>

			<button className={styles.acceptEditBtn} onClick={() =>onClickAccept(hubName, hubDescription, hubPrivate, image, bannerImage)}> Accept </button>
			<button className={styles.cancelEditBtn} onClick={() =>onClickDecline()}> Cancel </button>
		</div>
	);
};

export default HubEdit;
