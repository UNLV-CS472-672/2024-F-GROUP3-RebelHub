import { useState, useEffect } from 'react';
import React from 'react';
import styles from './HubEdit.module.css';
import TagList from '../FilterButtons/TagList.js';
import { getHubTagsUrl, getHubTagsForAHubUrl } from "@/utils/url-segments";
import api from "@/utils/api";

const HubEdit = ({hubId, oldName, oldDescription, oldPrivate, onClickAccept, onClickDecline}) => {
	//start initail state as the old name/description in case
	//you only wanna update one or the other.
	const [hubName, setHubName] = useState(oldName);
	const [hubDescription, setHubDescription] = useState(oldDescription);
	const [hubPrivate, setHubPrivate] = useState(oldPrivate);

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

			<button className={styles.acceptEditBtn} onClick={() =>onClickAccept(hubName, hubDescription, hubPrivate, filteredTags)}> Accept </button>
			<button className={styles.cancelEditBtn} onClick={() =>onClickDecline()}> Cancel </button>
		</div>
	);
};

export default HubEdit;
