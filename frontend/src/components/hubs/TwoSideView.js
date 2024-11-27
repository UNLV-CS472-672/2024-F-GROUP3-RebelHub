"use client"
import { useState, useEffect } from 'react';
import React from 'react';
import styles from './TwoSideView.module.css';


const TwoSideView = ({leftContent, rightContent}) => {
	const [isSmallScreen, setIsSmallScreen] = useState(false);
	const [showLeftView, setShowLeftView] = useState(true);


	useEffect(() => {
		const handleResize = () => setIsSmallScreen(window.innerWidth <= 768);
		handleResize();
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);


	if(isSmallScreen)
	{
		return(
			<div className={styles.viewContainter}>
				<button 
					className={styles.toggleButton}
					onClick={() => setShowLeftView(!showLeftView)}
				>
					{showLeftView ? "Show Right Screen" : "Show Left Screen"}
				</button>
				<div className={styles.oneView}>
					{showLeftView ? leftContent : rightContent}
				</div>
			</div>
		);
	}
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
