import { useState } from 'react';
import React from 'react';
import styles from './HubEdit.module.css';

const HubEdit = ({hubId, oldName, oldDescription, oldPrivate, onClickAccept, onClickDecline}) => {
	//start initail state as the old name/description in case
	//you only wanna update one or the other.
	const [hubName, setHubName] = useState(oldName);
	const [hubDescription, setHubDescription] = useState(oldDescription);
	const [hubPrivate, setHubPrivate] = useState(oldPrivate);

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

			<button className={styles.acceptEditBtn} onClick={() =>onClickAccept(hubName, hubDescription, hubPrivate)}> Accept </button>
			<button className={styles.cancelEditBtn} onClick={() =>onClickDecline()}> Cancel </button>
		</div>
	);
};

export default HubEdit;
