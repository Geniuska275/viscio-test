import {
	ADD_PRICE_CHECKER,
	ADD_PRICE_CHECKER_FAIL,
	DELETE_PRICE_CHECKER,
	GET_PRICE_CHECKER,
	GET_PRICE_CHECKER_FAIL,
	GET_PRICE_CHECKER_LOADING,
	LOGOUT,
	UPDATE_PRICE_CHECKER,
} from "../Actions/ActionType";
import { DeleteData, EditData } from "./AuthReducer";

let init = {
	price: [],
	isLoading: false,
	isAdded: false,
	isUpdated: false,
	isDeleted: false,
	update_loading: false,
	properties: null,
};

const PriceCheckerReducer = (state = init, { type, payload }) => {
	switch (type) {
		case GET_PRICE_CHECKER:
			return {
				...state,
				price: payload?.data?.docs,
				properties: { ...payload?.data, docs: null },
				isLoading: false,
			};
		case GET_PRICE_CHECKER_LOADING:
			return { ...state, isLoading: true };
		case ADD_PRICE_CHECKER:
			return {
				...state,
				price: [payload, ...state.price],
				isAdded: true,
			};
		case UPDATE_PRICE_CHECKER:
			return {
				...state,
				price: EditData(state.price, payload),
				update_loading: false,
				isUpdated: true,
			};
		case DELETE_PRICE_CHECKER:
			return {
				...state,
				price: DeleteData(state.price, payload),
				update_loading: false,
				isDeleted: true,
			};
		case GET_PRICE_CHECKER_FAIL:
		case ADD_PRICE_CHECKER_FAIL:
			return {
				...state,
				price: state.price,
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

export default PriceCheckerReducer;
