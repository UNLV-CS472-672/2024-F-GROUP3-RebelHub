"use client";
import { getAcceptoinHubUrl, getDeclineJoinHubUrl, getKickHubUrl, getModsAddHubUrl, getModsRemoveHubUrl} from "@/utils/url-segments";
import styles from './MemberList.module.css';
import api from '@/utils/api';
import AccountButton from '@/components/navbar/AccountButton';
//<div className={styles.memberName}>
//				<button className={styles.memberItemButton} onClick={() => onClickMember(data.id)} >{data.username} </button>
//			</div>
const MemberItem = ({data, ownerId, pending, modList, hasPermission, onClickMember, onClickPendingAdd, onClickPendingRemove, onClickKick, onClickModAdd, onClickModRemove}) => {
	return (
		<div className={styles.memberItem}>
			
			<AccountButton username={data.id} noBackground={true} />
			<div className={styles.memberActions}>
				{pending && 
					<button className={styles.acceptPendingButton} onClick={() => onClickPendingAdd(data.id)}> ADD </button>
				}
				{pending &&
					<button className={styles.declinePendingButton} onClick={() => onClickPendingRemove(data.id)}> REMOVE </button>
				}
				{!pending && 
				 hasPermission &&
				 !modList &&
				 (!(data.id == ownerId)) &&
					<>
					<button className={styles.memberKickButton} onClick={() => onClickKick(data.id)}> KICK </button>
					<button className={styles.memberAddModButton} onClick={() => onClickModAdd(data.id)}> ADD MOD </button>
					</>
				}
				{modList &&
				 hasPermission &&
					<>
					<button className={styles.memberRemoveModButton} onClick={() => onClickModRemove(data.id)}> REMOVE </button>
					</>
				}
			</div>
		</div>
	);
};

const MemberList = ({hubId, hubOwnerId, memberList, isPending, isModList, hasPermission, onSuccess}) => {
	const memberClick = (id) => {
		alert("REDIRECT TO USERS PAGE");
	};
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
	};

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
	};

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
	};

	const modAddButton = async (id) => {
		const req = {"user_id": id};
		try{
			const response = await api.put(getModsAddHubUrl(hubId), req);
			console.log("added member to mods");
			onSuccess(response.data);
		} catch(error) {
			console.log(error);
			alert(error);
		}
	};

	const modRemoveButton = async (id) => {
		const req = {"user_id": id};
		try{
			const response = await api.put(getModsRemoveHubUrl(hubId), req);
			console.log("removed member from mods");
			onSuccess(response.data);
		} catch(error) {
			console.log(error);
			alert(error);
		}
	};
	/* list shows all the members of a hub if pending is not set */
	return (
		<div className={styles.membersList}>
			<h2 className={styles.membersListHeader} > {isPending ? 'Pending' : (isModList ? 'Mods' : 'Members') } </h2>
			{memberList.length == 0 && <p style={{color:'black'}}> Nothing... </p>}
			<ul className={styles.memberList}>
			{memberList.map((member, index) => (
				<li className={styles.memberLI} 
				    style={{backgroundColor: (member.id == hubOwnerId) ? 'rgba(255, 255, 255, 0.7)' :
						    					 'rgba(150, 24, 20, 1.0)'}}
				    key={index} >
					<MemberItem 
						data={member} 
						ownerId={hubOwnerId}
						pending={isPending}
						modList={isModList}
						hasPermission={hasPermission} 
						onClickMember={memberClick}
						onClickPendingAdd={pendingMemberAddButton}
						onClickPendingRemove={pendingMemberRemoveButton}
						onClickKick={memberKickButton}
						onClickModAdd={modAddButton}
						onClickModRemove={modRemoveButton}
					/>
				</li>
			))}
			</ul>
		</div>
	);
};



export default MemberList;
