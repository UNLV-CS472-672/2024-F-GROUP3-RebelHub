"use client";
import Calendar from "../../components/Calendar/Calendar";
import ProtectedRoute from '../../components/Accounts/ProtectedRoutes';
import SideBar from "@/components/sidebar/sidebar";
import RebelHubNavBar from "../../components/navbar/RebelHubNavBar.js";

const CalendarPage = () => {
	return (
		<ProtectedRoute>
			<div>
				<RebelHubNavBar/>
				<div style={{display:'flex'	}}>
					<SideBar/>
					<Calendar/>
				</div>
			</div>
		</ProtectedRoute>
	);
};

export default CalendarPage;
