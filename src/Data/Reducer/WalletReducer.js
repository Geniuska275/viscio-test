import {
	GET_TOTAL_INCOME,
	GET_WALLET,
	GET_WALLET_FAIL,
	GET_WALLET_LOADING,
	GET_WITHDRAWAL_REQUEST,
	LOGOUT,
} from "../Actions/ActionType";

let init = {
	wallet: [],
	isLoading: false,
	isAdded: false,
	properties: null,
	wallet_properties: null,
	withdrawal: null,
	totalIncome: 0,
	totalBalance: 0,
};

const WalletReducer = (state = init, { type, payload }) => {
	switch (type) {
		case GET_WALLET:
			return {
				...state,
				wallet: payload.wallets?.docs,
				isLoading: false,
				totalBalance: payload?.totalBalance,
				wallet_properties: { ...payload?.wallets, docs: null },
			};
		case GET_WALLET_LOADING:
			return { ...state, isLoading: true };
		case GET_WALLET_FAIL:
			return {
				...state,
				wallet: state.wallet,
				isLoading: false,
				isAdded: false,
				withdrawal: state.withdrawal,
				totalIncome: state.totalIncome,
			};
		case GET_TOTAL_INCOME:
			return { ...state, totalIncome: payload };
		case GET_WITHDRAWAL_REQUEST:
			return {
				...state,
				withdrawal: payload?.data?.docs,
				properties: { ...payload?.data, docs: null },
				isLoading: false,
			};
		case LOGOUT:
			return init;
		default:
			return state;
	}
};

export default WalletReducer;
