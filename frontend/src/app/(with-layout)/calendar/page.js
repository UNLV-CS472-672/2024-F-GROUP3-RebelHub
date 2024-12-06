"use client";

import Calendar from "@/components/Calendar/Calendar";
import ProtectedRoute from '@/components/Accounts/ProtectedRoutes';

const Home = () => {
	return (
		<ProtectedRoute>
			<main style={{ backgroundColor: '#f2f2f2'}}>
				<Calendar/>
			</main>
		</ProtectedRoute>
	);
};

export default Home;
