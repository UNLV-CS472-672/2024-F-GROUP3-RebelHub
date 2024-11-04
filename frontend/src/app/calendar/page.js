"use client";
import axios from 'axios';
import { useEffect, useState } from 'react';
import Calendar from "../../components/Calendar/Calendar";
import ProtectedRoute from '../../components/Accounts/ProtectedRoutes';

const Home = () => {
	return (
		<ProtectedRoute>
			<main style={{ backgroundColor: '#f2f2f2'}}>
				<Calendar></Calendar>
			</main>
		</ProtectedRoute>
	);
};

export default Home;
