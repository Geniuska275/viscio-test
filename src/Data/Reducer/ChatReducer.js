import {
	ADD_CHAT,
	ADD_CHAT_FAIL,
	GET_ALL_DISPUTE,
	GET_CHAT,
	GET_CHAT_FAIL,
	GET_CHAT_LOADING,
	GET_DISPUTE,
	GET_DISPUTE_FAIL,
	LOGOUT,
	UPDATE_DISPUTE,
} from "../Actions/ActionType";
import { EditData } from "./AuthReducer";

let init = {
	chats: [],
	isLoading: false,
	isAdded: false,
	properties: null,
	newChat: null,
};

const ChatReducer = (state = init, { type, payload }) => {
	switch (type) {
		case GET_CHAT:
			return {
				...state,
				chats: payload?.data?.docs,
				properties: { ...payload?.data, docs: null },
				isLoading: false,
			};
		case GET_CHAT_LOADING:
			return { ...state, isLoading: true };
		case ADD_CHAT:
			return {
				...state,
				isAdded: true,
				newChat: payload,
			};
		case GET_CHAT_FAIL:
		case ADD_CHAT_FAIL:
			return {
				...state,
				chats: state.chats,
				isLoading: false,
				isAdded: false,
				newChat: null,
			};
		case LOGOUT:
			return init;
		default:
			return state;
	}
};

export default ChatReducer;

let init2 = {
	dispute: [],
	isLoading: false,
	isAdded: false,
	properties: null,
	isUpdated: false,
	total_dispute: [],
};

export const DisputeReducer = (state = init2, { type, payload }) => {
	switch (type) {
		case GET_DISPUTE:
			return {
				...state,
				dispute: payload?.data?.docs,
				properties: { ...payload?.data, docs: null },
				isLoading: false,
			};
		case GET_ALL_DISPUTE:
			return {
				...state,
				total_dispute: payload,
			};
		case GET_DISPUTE_FAIL:
			return {
				...state,
				dispute: state.dispute,
				isLoading: false,
				isAdded: false,
				isUpdated: false,
			};
		case UPDATE_DISPUTE:
			return {
				...state,
				dispute: EditData(state.dispute, payload),
				isUpdated: true,
			};
		case LOGOUT:
			return init;
		default:
			return state;
	}
};
