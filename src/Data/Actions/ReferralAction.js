import axios from "axios";
import { toast } from "react-toastify";
import { returnErrors } from "../Reducer/ErrorReducer";
import {
	ADD_REFERRAL,
	ADD_REFERRAL_FAIL,
	GET_REFERRAL,
	GET_REFERRAL_FAIL,
	GET_REFERRAL_LOADING,
	GET_SETTINGS,
	SEND_FAIL,
	SEND_NOTIFICATION,
	UPDATE_SETTINGS,
} from "./ActionType";

export const getReferral = data => async dispatch => {
	dispatch({ type: GET_REFERRAL_LOADING });
	try {
		let res = await axios.get(
			`/users/referrals${!data ? "" : `&limit=${data.limit}`}`
		);

		dispatch({
			type: GET_REFERRAL,
			payload: res.data,
		});
	} catch (err) {
		if (err) console.log({ err });
		if (err) console.log(err?.response ? err?.response?.data : err?.message);
		dispatch({ type: GET_REFERRAL_FAIL });
	}
};

export const getSettings = () => async dispatch => {
	dispatch({ type: GET_REFERRAL_LOADING });
	try {
		let res = await axios.get(`/settings`);

		dispatch({
			type: GET_SETTINGS,
			payload: res.data?.data,
		});
	} catch (err) {
		if (err) console.log({ err });
		if (err) console.log(err?.response ? err?.response?.data : err?.message);
	}
};

export const fundWalletReferral = thisData => async dispatch => {
	try {
		let res = await axios.post(`/referral`, { ...thisData });

		dispatch({
			type: ADD_REFERRAL,
			payload: res.data,
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
		dispatch({ type: ADD_REFERRAL_FAIL });
	}
};

export const notifySettings = (thisData, type) => async dispatch => {
	try {
		var res;
		if (type === "settings") {
			res = await axios.post(`/settings`, { ...thisData });

			dispatch({
				type: UPDATE_SETTINGS,
				payload: res.data?.data,
			});
		} else {
			res = await axios.post(`/notification/send`, { ...thisData });

			dispatch({
				type: SEND_NOTIFICATION,
			});
		}
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
		dispatch({ type: SEND_FAIL });
	}
};
