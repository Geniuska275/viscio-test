import {
	ADD_REFERRAL,
	ADD_REFERRAL_FAIL,
	GET_REFERRAL,
	GET_REFERRAL_FAIL,
	GET_REFERRAL_LOADING,
	GET_SETTINGS,
	LOGOUT,
	SEND_FAIL,
	SEND_NOTIFICATION,
	UPDATE_SETTINGS,
} from "../Actions/ActionType";
let init = {
	referral: [],
	isLoading: false,
	isAdded: false,
	properties: null,
	notify: null,
	isSet: null,
	settings: null,
};

const ReferralReducer = (state = init, { type, payload }) => {
	switch (type) {
		case SEND_NOTIFICATION:
			return { ...state, notify: true };
		case UPDATE_SETTINGS:
			return { ...state, isSet: true, settings: payload };
		case SEND_FAIL:
			return { ...state, isSet: false, notify: false };
		case GET_SETTINGS:
			return { ...state, settings: payload };
		case GET_REFERRAL:
			return {
				...state,
				referral: payload?.data?.docs,
				properties: { ...payload?.data, docs: null },
				isLoading: false,
			};
		case GET_REFERRAL_LOADING:
			return { ...state, isLoading: true };
		case ADD_REFERRAL:
			return {
				...state,
				referral: [payload, ...state.referral],
				isAdded: true,
			};
		case GET_REFERRAL_FAIL:
		case ADD_REFERRAL_FAIL:
			return {
				...state,
				referral: state.referral,
				isLoading: false,
				isAdded: false,
			};
		case LOGOUT:
			return init;
		default:
			return state;
	}
};

export default ReferralReducer;
