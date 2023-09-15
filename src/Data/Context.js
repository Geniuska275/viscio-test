import React, { createContext } from "react";
import { BiCog, BiTargetLock } from "react-icons/bi";
import {
	BsClockHistory,
	BsGift,
	BsMegaphone,
	BsPerson,
	BsTruck,
} from "react-icons/bs";
import { FaBalanceScale, FaUsers, FaWallet } from "react-icons/fa";
import { connect, useSelector } from "react-redux";
import {
	updateUser,
	LogoutToken,
	loginUser,
	updateAdmin,
	addAdmin,
	getAllUser,
	getUsersReload,
	getAllVendors,
} from "./Actions/AuthAction";
import {
	updatePriceChecker,
	getPriceChecker,
} from "./Actions/PriceCheckerAction";
import { updateReward, getReward } from "./Actions/RewardAction";
import {
	socketProfile,
	socketUser,
	socketReconnect,
	socketNewMessage,
} from "./Reducer/SocketReducer";
import {
	getWithdrawalIncome,
	updateWallet,
	fundWallet,
	getWallet,
} from "./Actions/WalletAction";
import { getReferral, notifySettings } from "./Actions/ReferralAction";
import { getBids, getOrders, updateOrderTypes } from "./Actions/OrderAction";
import { updateChats, updateDispute } from "./Actions/ChatAction";

export const GlobalState = createContext();

const DataProvider = ({
	children,
	updateUser,
	LogoutToken,
	loginUser,
	updateAdmin,
	addAdmin,
	getAllUser,
	getUsersReload,
	updatePriceChecker,
	getPriceChecker,
	updateReward,
	getReward,
	socketProfile,
	socketUser,
	getWithdrawalIncome,
	getReferral,
	notifySettings,
	getBids,
	getOrders,
	updateWallet,
	updateChats,
	socketNewMessage,
	socketReconnect,
	updateDispute,
	updateOrderTypes,
	fundWallet,
	getWallet,
	getAllVendors,
}) => {
	const {
		auth,
		orders,
		referrals,
		prices,
		rewards,
		socket,
		dispute,
		feedbacks,
		chats,
		wallets,
		banks,
		errors,
	} = useSelector(state => state);

	let sidebarList = [
		{
			name: "User",
			url: "/users",
			icon: <FaUsers size={24} />,
		},
		{
			name: "Order",
			url: "/orders",
			icon: <BsTruck size={24} />,
		},
		{
			name: "wallet",
			url: "/wallet",
			icon: <FaWallet size={24} />,
		},
		{
			name: "Dispute",
			url: "/dispute",
			icon: <FaBalanceScale size={24} />,
		},
		{
			name: "Price setting",
			url: "/price-setting",
			icon: <BiCog size={24} />,
		},
		{
			name: "referral",
			url: "/rewards",
			icon: <BsGift size={24} />,
		},
		{
			name: "Notification",
			url: "/notification",
			icon: <BsMegaphone size={24} />,
			button: "notification",
		},
		{
			name: "settings",
			url: "/settings",
			icon: <BsClockHistory size={24} />,
		},
		{
			name: "Admins",
			url: "/admin",
			icon: <BiTargetLock size={24} />,
		},
		{
			name: "Profile",
			url: "/profile",
			icon: <BsPerson size={24} />,
		},
	];

	let numberWithCommas = x => {
		return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	};

	let nairaSign = <span className="fontInherit">&#8358;</span>;

	const state = {
		numberWithCommas,
		sidebarList,
		nairaSign,

		auth,
		updateUser,
		LogoutToken,
		loginUser,
		updateAdmin,
		addAdmin,
		getAllUser,
		getUsersReload,
		getAllVendors,

		orders,
		getBids,
		getOrders,
		updateOrderTypes,

		referrals,
		getReferral,
		notifySettings,

		prices,
		updatePriceChecker,
		getPriceChecker,

		rewards,
		updateReward,
		getReward,

		socket: socket?.socket,
		socketList: socket?.user,
		socketProfile,
		socketUser,
		socketReconnect,
		mainSocket: socket,

		dispute,
		feedbacks,

		chats,
		updateChats,
		socketNewMessage,
		updateDispute,

		wallets,
		getWithdrawalIncome,
		updateWallet,

		banks,
		fundWallet,
		getWallet,

		errors,
	};

	return <GlobalState.Provider value={state}>{children}</GlobalState.Provider>;
};

export default connect(null, {
	updateUser,
	LogoutToken,
	loginUser,
	updateAdmin,
	addAdmin,
	getAllUser,
	getUsersReload,
	updatePriceChecker,
	getPriceChecker,
	updateReward,
	socketProfile,
	socketUser,
	getWithdrawalIncome,
	getReward,
	getReferral,
	notifySettings,
	getBids,
	getOrders,
	updateWallet,
	updateChats,
	socketNewMessage,
	socketReconnect,
	updateDispute,
	updateOrderTypes,
	fundWallet,
	getWallet,
	getAllVendors,
})(DataProvider);
