"use client";
import axios from 'axios';
import { useEffect, useState } from 'react';
import Explore from "../../components/Explore/Explore";
import ProtectedRoute from '../../components/Accounts/ProtectedRoutes';

const Home = () => {
	return (
		<ProtectedRoute>
			<main style={{ backgroundColor: '#f2f2f2'}}>
				<Explore/>
			</main>
		</ProtectedRoute>
	);
};

export default Home;
