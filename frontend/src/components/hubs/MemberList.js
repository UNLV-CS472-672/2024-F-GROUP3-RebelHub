import { getAcceptoinHubUrl, getDeclineJoinHubUrl, getKickHubUrl } from "@/utils/url-segments";
import styles from './MemberList.module.css';
import api from '@/utils/api';

const MemberItem = ({data, pending, hasPermission, onClickMember, onClickPendingAdd, onClickPendingRemove, onClickKick}) => {
	console.log("member id: ", data.id);
	return (
		<>
		<button className={styles.memberItemButton} onClick={() => onClickMember(data.id)} >{data.username} </button>
		{pending && 
			<button className={styles.acceptPendingButton} onClick={() => onClickPendingAdd(data.id)}> ADD </button>
		}
		{pending &&
			<button className={styles.declinePendingButton} onClick={() => onClickPendingRemove(data.id)}> REMOVE </button>
		}
		{!pending && 
		 hasPermission && 
			<button className={styles.acceptPendingButton} onClick={() => onClickKick(data.id)}> KICK </button>
		}
		</>
	);
};

const MemberList = ({hubId, memberList, isPending, hasPermission, onSuccess}) => {
	const memberClick = (id) => {
		alert("REDIRECT TO USERS PAGE");
	}
	const pendingMemberAddButton = async (id) => {
		const req = {"user_id": id};
		try{
			const response = await api.put(getAcceptoinHubUrl(hubId), req);
			console.log("added member into hub");
			onSuccess(response.data);
		} catch (error) {
			alert(error);
			console.log(error);
		}
	}

	const pendingMemberRemoveButton = async (id) => {
		const req = {"user_id": id};
		try{
			const response = await api.put(getDeclineJoinHubUrl(hubId), req);
			console.log("removed member from pending");
			onSuccess(response.data);
		} catch (error) {
			alert(error);
			console.log("error removing from pending", error);
		}
	}

	const memberKickButton = async (id) => {
		const req = {"user_id": id};
		try{
			const response = await api.put(getKickHubUrl(hubId), req);
			console.log("kicked member from hub");
			onSuccess(response.data);
		} catch (error) {
			console.log(error);
			alert(error);
		}
	}

	/* list shows all the members of a hub if pending is not set */
	return (
		<div className={styles.membersList}>
			<h2 className={styles.membersListHeader} > {isPending ? 'Pending' : 'Members'} </h2>
			{memberList.length == 0 && <p style={{color:'black'}}> Nothing... </p>}
			<ul>
			{memberList.map((member, index) => (
				<li className={styles.memberLI} key={index} >
					<MemberItem 
						data={member} 
						hasPermission={hasPermission} 
						pending={isPending}
						onClickMember={memberClick}
						onClickPendingAdd={pendingMemberAddButton}
						onClickPendingRemove={pendingMemberRemoveButton}
						onClickKick={memberKickButton}
					/>
				</li>
			))}
			</ul>
		</div>
	);
};



export default MemberList;
