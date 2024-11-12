"use client"
import React from 'react';
import styles from './TwoSideView.module.css';


const TwoSideView = ({leftContent, rightContent}) => {



	



	return (
		<div className={styles.viewContainer}>
			<div className={styles.leftView}>
				<div className={styles.leftContent}>
					{leftContent}
				</div>
			</div>
			<div className={styles.rightView}>
				<div className={styles.rightContent}>
					{rightContent}
				</div>
			</div>
		</div>
	);
};


export default TwoSideView;
