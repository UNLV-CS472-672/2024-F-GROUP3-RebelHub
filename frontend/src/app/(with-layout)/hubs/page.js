"use client";
import TwoSideView from '@/components/hubs/TwoSideView';
import RebelHubNavBar from '@/components/navbar/RebelHubNavBar';
import ProtectedRoute from '@/components/Accounts/ProtectedRoutes';
import HubListView from '@/components/hubs/HubListView';
import HubCreate from '@/components/hubs/HubCreate';
import Sidebar from '@/components/sidebar/sidebar';

import margins from "@/utils/Margins.module.css";

const HubListPage = () => {
	return (
		<>
			<div style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
					<TwoSideView 
						leftContent={<HubListView/>} 
						rightContent={<HubCreate/>} 
					/>
			</div>
		</>
	);
};

const ProtectedHubListPage = () => {
	return (
		<ProtectedRoute>
			<HubListPage/>
		</ProtectedRoute>
	);
};

export default ProtectedHubListPage;
