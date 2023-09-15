import {
	ADD_CHAT,
	LOGOUT,
	RECONNECT,
	RECONNECT_NOT,
	SOCKET,
	SOCKET_USER,
} from "../Actions/ActionType";

const initialState = {
	socket: null,
	user: [],
	reconnect: false,
};

const socketReducer = (state = initialState, { type, payload }) => {
	switch (type) {
		case SOCKET:
			return {
				...state,
				socket: payload,
			};
		case RECONNECT:
			return { ...state, reconnect: true };
		case RECONNECT_NOT:
			return { ...state, reconnect: false };
		case SOCKET_USER:
			return { ...state, user: EditSocketUser(state.user, payload) };
		case LOGOUT:
			return initialState;
		default:
			return state;
	}
};

export default socketReducer;

export const EditSocketUser = (data, payload) => {
	var returnItem;
	if (data?.length === 0) returnItem = [payload];
	else {
		let findItem = data?.find(item => item?.userId === payload?.user);

		if (findItem)
			returnItem = data.map(item =>
				item.userId !== payload.userId ? item : payload
			);
		else returnItem = [payload, ...data];
	}
	return returnItem;
};

export const socketProfile = socket => async dispatch => {
	dispatch({ type: SOCKET, payload: socket });
};

export const socketNewMessage = socket => async dispatch => {
	dispatch({ type: ADD_CHAT, payload: socket });
};

export const socketReconnect = socket => async dispatch => {
	dispatch({
		type: socket ? RECONNECT : RECONNECT_NOT,
		payload: socket ? true : false,
	});
};

export const socketUser = socket => async dispatch => {
	dispatch({ type: SOCKET_USER, payload: socket });
};
