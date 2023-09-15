import {
	ACCEPT_ORDER,
	ADD_ORDER,
	GET_ALL_BIDS,
	GET_ALL_ORDERS,
	GET_BIDS,
	GET_BIDS_FAIL,
	GET_BIDS_LOADING,
	GET_ORDER,
	GET_ORDER_FAIL,
	GET_ORDER_LOADING,
	GET_TRACK_ORDER,
	GET_TRACK_ORDER_FAIL,
	GET_TRACK_ORDER_LOADING,
	LOGOUT,
	UPDATE_ORDER,
} from "../Actions/ActionType";
import { EditData } from "./AuthReducer";

let init = {
	order: [],
	isLoading: false,
	isAdded: false,
	isUpdated: false,
	isAccepted: false,
	bids: [],
	bid_loading: false,
	track_order: null,
	track_loading: false,
	update_loading: false,
	properties: null,
	properties_bid: null,
	total_bids: [],
	total_orders: [],
};

const OrderReducer = (state = init, { type, payload }) => {
	switch (type) {
		case GET_ORDER:
			return {
				...state,
				order: payload?.data?.docs,
				properties: { ...payload?.data, docs: null },
				isLoading: false,
			};
		case GET_ORDER_LOADING:
			return { ...state, isLoading: true };
		case ADD_ORDER:
			return { ...state, order: [payload, ...state.order], isAdded: true };
		case UPDATE_ORDER:
			return {
				...state,
				order: EditData(state.order, payload),
				isUpdated: true,
				update_loading: false,
			};
		case ACCEPT_ORDER:
			return {
				...state,
				order: EditData(state.order, payload),
				isAccepted: true,
				update_loading: false,
			};
		case GET_TRACK_ORDER_LOADING:
			return { ...state, track_loading: true };
		case GET_TRACK_ORDER:
			return { ...state, track_order: payload, track_loading: false };
		case GET_TRACK_ORDER_FAIL:
			return { ...state, track_order: null, track_loading: false };
		case GET_BIDS_LOADING:
			return { ...state, bid_loading: true };
		case GET_BIDS:
			return {
				...state,
				bids: payload?.data?.docs,
				properties_bid: { ...payload?.data, docs: null },
				bid_loading: false,
			};
		case GET_ALL_BIDS:
			return {
				...state,
				total_bids: payload,
			};
		case GET_ALL_ORDERS:
			return {
				...state,
				total_orders: payload,
			};
		case GET_BIDS_FAIL:
			return {
				...state,
				bids: state.bids,
				pending_bids: state.pending_bids,
				pickup_bids: state.pickup_bids,
				completed_bids: state.completed_bids,
				bid_loading: false,
			};
		case GET_ORDER_FAIL:
			return {
				...state,
				order: state.order,
				isLoading: false,
				isAdded: false,
				isUpdated: false,
				isAccepted: false,
				update_loading: false,
			};
		case LOGOUT:
			return init;
		default:
			return state;
	}
};

export default OrderReducer;
