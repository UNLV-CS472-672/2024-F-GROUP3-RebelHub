"use client";
import RebelHubNavBar from '@/components/navbar/RebelHubNavBar';
import ProtectedRoute from '@/components/Accounts/ProtectedRoutes';
import HubPage from '@/components/hubs/HubPage';
import { useParams } from 'next/navigation';
import Sidebar from '@/components/sidebar/sidebar';

import margins from "@/utils/Margins.module.css";

const Home = () => {
	const id = useParams().id;
	return (
		<>
			<HubPage id={id}/>
		</>
	);
};

const ProtectedHome = () => {
	return (
		<ProtectedRoute>
			<Home/>
		</ProtectedRoute>
	);
};

export default ProtectedHome;
