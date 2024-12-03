import { useState, useEffect } from 'react';
import React from 'react';
import styles from './HubEdit.module.css';
import TagList from '../FilterButtons/TagList.js';
import { getHubTagsUrl, getHubTagsForAHubUrl } from "@/utils/url-segments";
import api from "@/utils/api";

const HubEdit = ({hubId, oldName, oldDescription, oldPrivate, onClickAccept, onClickDecline, passData, passBanner}) => {
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
			passBanner(bannerUrl);
			return () => URL.revokeObjectURL(bannerUrl);
		}
	}, [bannerImage]);

	const [showTagList, setShowTagList] = useState(false);
	const [tags, setTags] = useState([]);
	const [filteredTags, setFilteredTags] = useState([]);
	const [initialHubTags, setInitialHubTags] = useState([]);

	useEffect(() => {
        const fetchHubTags = async () => {
            try {
                const response = await api.get(getHubTagsUrl());
                setTags(response.data);
            } catch (error) { console.log("Error fetching hub tags: ", error); }
        };
        fetchHubTags();
		const fetchInitialHubTags = async () => {
			try {
				const response = await api.get(getHubTagsForAHubUrl(hubId));
				setInitialHubTags(response.data);
			} catch (error) { console.log("Error fetching hub tags: ", error); }
		};
		fetchInitialHubTags();
    }, []);

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
			<button className={`${showTagList === true ? styles.current : ''} ${styles['tag-button']}`} onClick={() => setShowTagList(previous => !previous)}>TAGS</button>
			{showTagList && tags.length != 0 && <TagList tags={tags} type={'edit_hub'} setFilteredTags={setFilteredTags} initialHubTags={initialHubTags}/>}
			<label>
				<input type="radio" id="toggle-private" checked={hubPrivate} onChange={(e) => setHubPrivate(true)}/>
				Private
			</label>
			<label>
				<input type="radio" id="toggle-public" checked={!hubPrivate} onChange={() => setHubPrivate(false)}/>
				Public
			</label>
			<label>
				Set Hub Background
				<input
					type="file"
					id="image"
					onChange={(e) => setImage(e.target.files[0])}
				/>
			</label>
			<label>
				Set Hub Banner
				<input
					type="file"
					id="banner-image"
					onChange={(e) => setBannerImage(e.target.files[0])}
				/>
			</label>

			<button className={styles.acceptEditBtn} onClick={() =>onClickAccept(hubName, hubDescription, hubPrivate, filteredTags, image, bannerImage)}> Accept </button>
			<button className={styles.cancelEditBtn} onClick={() =>onClickDecline()}> Cancel </button>
		</div>
	);
};

export default HubEdit;
