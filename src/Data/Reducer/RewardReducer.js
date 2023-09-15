import {
	ADD_REWARD,
	ADD_REWARD_FAIL,
	DELETE_REWARD,
	GET_FEEDBACK,
	GET_FEEDBACK_FAIL,
	GET_REWARD,
	GET_REWARD_FAIL,
	GET_REWARD_LOADING,
	LOGOUT,
	UPDATE_REWARD,
} from "../Actions/ActionType";
import { DeleteData, EditData } from "./AuthReducer";

let init = {
	rewards: [],
	isLoading: false,
	isAdded: false,
	isUpdated: false,
	isDeleted: false,
	update_loading: false,
	properties: null,
};

const RewardReducer = (state = init, { type, payload }) => {
	switch (type) {
		case GET_REWARD:
			return {
				...state,
				rewards: payload?.data?.docs,
				properties: { ...payload?.data, docs: null },
				isLoading: false,
			};
		case GET_REWARD_LOADING:
			return { ...state, isLoading: true };
		case ADD_REWARD:
			return {
				...state,
				rewards: [payload, ...state.rewards],
				isAdded: true,
			};
		case UPDATE_REWARD:
			return {
				...state,
				rewards: EditData(state.rewards, payload),
				update_loading: false,
				isUpdated: true,
			};
		case DELETE_REWARD:
			return {
				...state,
				rewards: DeleteData(state.rewards, payload),
				update_loading: false,
				isDeleted: true,
			};
		case GET_REWARD_FAIL:
		case ADD_REWARD_FAIL:
			return {
				...state,
				rewards: state.rewards,
				isLoading: false,
				isAdded: false,
				isUpdated: false,
				isDeleted: false,
				update_loading: false,
			};
		case LOGOUT:
			return init;
		default:
			return state;
	}
};

export default RewardReducer;

let init2 = {
	feedback: [],
	isLoading: false,
	properties: null,
};

export const FeedbackReducer = (state = init2, { type, payload }) => {
	switch (type) {
		case GET_FEEDBACK:
			return {
				...state,
				feedback: payload?.data?.docs,
				properties: { ...payload?.data, docs: null },
				isLoading: false,
			};
		case GET_FEEDBACK_FAIL:
			return {
				...state,
				feedback: state.feedback,
				isLoading: false,
				isAdded: false,
				isUpdated: false,
				isDeleted: false,
			};
		case LOGOUT:
			return init;
		default:
			return state;
	}
};
