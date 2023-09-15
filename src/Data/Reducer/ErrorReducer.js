import { GET_ERRORS, CLEAR_ERRORS, LOGOUT, GET_ERRORS_TEXT } from "../Actions/ActionType";

let initialState = {
	error: null,
	id: null,
	status: null,
	errorText: "",
};

const ErrorReducer = (state = initialState, action) => {
	let { type, payload } = action;
	switch (type) {
		case GET_ERRORS:
			return {
				error: payload.error,
				id: payload.id,
				status: payload.status,
			};
			case GET_ERRORS_TEXT:
				return {...state, errorText: payload}
		case CLEAR_ERRORS:
		case LOGOUT:
			return initialState;
		default:
			return state;
	}
};

export default ErrorReducer;

export let returnErrors = (error, status, id = null) => {
	return {
		type: GET_ERRORS,
		payload: { error, status, id },
	};
};

// CLEAR ERRORS
export let clearErrors = () => {
	return {
		type: CLEAR_ERRORS,
	};
};
