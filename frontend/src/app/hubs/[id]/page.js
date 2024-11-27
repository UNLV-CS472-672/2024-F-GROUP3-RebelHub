"use client";
import RebelHubNavBar from '@/components/navbar/RebelHubNavBar';
import ProtectedRoute from '@/components/Accounts/ProtectedRoutes';
import HubPage from '@/components/hubs/HubPage';
import { useParams } from 'next/navigation';

const Home = () => {
	const id = useParams().id;
	return (
		<>
		<RebelHubNavBar />
		{/*side bar can go here but padding would need to be adjusted...
			i think it looks nice without sidebar for now */}
		<div style={{ padding: '4%' }}>
			<HubPage id={id}/>
		< /div>
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
