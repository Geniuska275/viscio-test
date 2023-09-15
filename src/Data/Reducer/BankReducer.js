import {
	ADD_BANK_ACCOUNT,
	GET_ALL_BANKS,
	GET_BANK_ACCOUNT,
	GET_BANK_ACCOUNT_FAIL,
	GET_WITHDRAWAL_REQUEST,
	LOGOUT,
} from "../Actions/ActionType";
let init = {
	bankAccount: [],
	isLoading: false,
	isAdded: false,
	properties: null,
	withdrawal: [],
	banks: [],
};

const BankReducer = (state = init, { type, payload }) => {
	switch (type) {
		case GET_BANK_ACCOUNT:
			return { ...state, bankAccount: payload, isLoading: false };
		case GET_WITHDRAWAL_REQUEST:
			return {
				...state,
				withdrawal: payload?.docs,
				properties: { ...payload, docs: null },
			};
		case GET_ALL_BANKS:
			return {
				...state,
				banks: payload,
			};
		case ADD_BANK_ACCOUNT:
			return {
				...state,
				bankAccount: [payload, ...state.bankAccount],
				isAdded: true,
			};
		case GET_BANK_ACCOUNT_FAIL:
			return {
				...state,
				bankAccount: state.wallet,
				withdrawal: state.withdrawal,
				properties: state.properties,
				isLoading: false,
				isAdded: false,
				banks: state.banks,
			};
		case LOGOUT:
			return init;
		default:
			return state;
	}
};

export default BankReducer;
