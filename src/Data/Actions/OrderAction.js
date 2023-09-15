import axios from "axios";
import { toast } from "react-toastify";
import { returnErrors } from "../Reducer/ErrorReducer";
import {
	ADD_ORDER,
	ADD_ORDER_FAIL,
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
	UPDATE_ORDER,
	UPDATE_ORDER_LOADING,
} from "./ActionType";
import { getChats } from "./ChatAction";

export const getOrders = (data, load) => async dispatch => {
	if (!load) dispatch({ type: GET_ORDER_LOADING });
	try {
		let res = await axios.get(
			`/orders?populate=bid&populate=user&populate=bid.vendor${
				!data ? "" : `&limit=${data.limit}`
			}`
		);

		let res5 = await axios.get(
			`/orders?populate=bid&populate=user&populate=bid.vendor&limit=${res?.data?.data?.totalDocs}`
		);
		dispatch({
			type: GET_ALL_ORDERS,
			payload: res5.data?.data?.docs,
		});

		dispatch({
			type: GET_ORDER,
			payload: res.data,
		});
	} catch (err) {
		if (err) console.log({ err });
		if (err) console.log(err?.response ? err?.response?.data : err?.message);
		dispatch({ type: GET_ORDER_FAIL });
	}
};

export const addOrders = thisData => async dispatch => {
	try {
		let res = await axios.post(`/orders`, { ...thisData });

		dispatch({
			type: ADD_ORDER,
			payload: res.data?.data,
		});

		toast.success(res.data.message, {
			autoClose: 5000,
		});
	} catch (err) {
		console.log({ err: err.response });
		dispatch(
			returnErrors({
				error: err?.response?.data?.data,
				status: err?.response?.status,
			})
		);
		toast.error(err?.response ? err?.response?.data?.message : err?.message);
		dispatch({ type: ADD_ORDER_FAIL });
	}
};

export const getBids = (data, load) => async dispatch => {
	if (!load) dispatch({ type: GET_BIDS_LOADING });
	try {
		let res = await axios.get(
			`/orders/bids?populate=order&populate=chat&populate=order.user&populate=vendor${
				!data ? "" : `&limit=${data.limit}`
			}`
		);

		let res5 = await axios.get(
			`/orders/bids?populate=order&populate=chat&populate=order.user&populate=vendor&limit=${res?.data?.data?.totalDocs}`
		);
		dispatch({
			type: GET_ALL_BIDS,
			payload: res5.data?.data?.docs,
		});

		dispatch({
			type: GET_BIDS,
			payload: res.data,
		});
	} catch (err) {
		if (err) console.log({ err });
		if (err) console.log(err?.response ? err?.response?.data : err?.message);
		dispatch({ type: GET_BIDS_FAIL });
	}
};

export const getTrackOrder = data => async dispatch => {
	dispatch({ type: GET_TRACK_ORDER_LOADING });
	try {
		let res = await axios.get(`/orders/track/${data}`);

		dispatch({
			type: GET_TRACK_ORDER,
			payload: res.data?.data,
		});

		toast.success(res.data.message, {
			autoClose: 5000,
		});
	} catch (err) {
		console.log({ err: err.response });
		dispatch(
			returnErrors({
				error: err?.response?.data?.data,
				status: err?.response?.status,
			})
		);
		toast.error(err?.response ? err?.response?.data?.message : err?.message);
		dispatch({ type: GET_TRACK_ORDER_FAIL });
	}
};

export const updateOrderTypes = (id, type, data) => async dispatch => {
	dispatch({ type: UPDATE_ORDER_LOADING });
	try {
		var res;
		if (type === "bid") {
			res = await axios.post(`/orders/${type}/${id}`, { ...data });
		} else if (type === "update")
			res = await axios.put(`/orders/update/${id}`, { ...data });
		else if (type === "pickup")
			res = await axios.put(`/orders/update/${id}`, { ...data });
		else res = await axios.post(`/orders/${type}/${id}`);

		dispatch({
			type: UPDATE_ORDER,
			payload: res.data?.data,
		});
		dispatch(getBids(null, "load"));
		dispatch(getOrders(null, "load"));
		dispatch(getChats(null, "load"));

		toast.success(res.data.message, {
			autoClose: 5000,
		});
	} catch (err) {
		console.log({ err: err.response });
		dispatch(
			returnErrors({
				error: err?.response?.data?.data,
				status: err?.response?.status,
			})
		);
		toast.error(err?.response ? err?.response?.data?.message : err?.message);

		dispatch({ type: GET_ORDER_FAIL });
	}
};
