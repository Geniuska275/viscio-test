import axios from "axios";
import { toast } from "react-toastify";
import { returnErrors } from "../Reducer/ErrorReducer";
import {
	ADD_CHAT,
	ADD_CHAT_FAIL,
	GET_ALL_DISPUTE,
	GET_CHAT,
	GET_CHAT_FAIL,
	GET_CHAT_LOADING,
	GET_DISPUTE,
	GET_DISPUTE_FAIL,
	GET_FEEDBACK,
	GET_FEEDBACK_FAIL,
} from "./ActionType";

export const getChats = (data, load) => async dispatch => {
	if (!load) dispatch({ type: GET_CHAT_LOADING });
	try {
		let res = await axios.get(
			`/chat?populate=users&populate=users.avatar&orderBy=updatedAt&order=asc${
				!data ? "" : `&limit=${data.limit}`
			}`
		);

		dispatch({
			type: GET_CHAT,
			payload: res.data,
		});
	} catch (err) {
		if (err) console.log({ err });
		if (err) console.log(err?.response ? err?.response?.data : err?.message);
		dispatch({ type: GET_CHAT_FAIL });
	}
};

export const updateChats = (data, type) => async dispatch => {
	try {
		var res;
		// console.log({ data, type });
		if (type === "file")
			res = await axios.post(
				`/chat/${data?.chatId}/message`,
				{ ...data },
				{
					headers: {
						"Content-Type": "multipart/form-data",
					},
				}
			);
		else res = await axios.post(`/chat/${data?.chatId}/message`, { ...data });
		// console.log({ res: res?.data });
		dispatch({
			type: ADD_CHAT,
			payload: res.data?.data,
		});

		// toast.success(res.data.message, {
		// 	autoClose: 5000,
		// });
	} catch (err) {
		console.log({ err: err.response });
		dispatch(
			returnErrors({
				error: err?.response?.data?.data,
				status: err?.response?.status,
			})
		);
		toast.error(err?.response ? err?.response?.data?.message : err?.message);
		dispatch({ type: ADD_CHAT_FAIL });
	}
};

export const getDispute =
	(data, noLoad = false) =>
	async dispatch => {
		if (!noLoad) dispatch({ type: GET_CHAT_LOADING });
		try {
			let res = await axios.get(
				`/chat/report?populate=files&populate=chat&populate=owner&populate=owner.avatar${
					!data ? "" : `&limit=${data.limit}`
				}`
			);
			let res1 = await axios.get(
				`/chat/report?populate=files&populate=chat&populate=owner&populate=owner.avatar&limit=${res?.data?.data?.totalDocs}`
			);
			dispatch({
				type: GET_ALL_DISPUTE,
				payload: res1.data?.data?.docs,
			});

			dispatch({
				type: GET_DISPUTE,
				payload: res.data,
			});
		} catch (err) {
			if (err) console.log({ err });
			if (err) console.log(err?.response ? err?.response?.data : err?.message);
			dispatch({ type: GET_DISPUTE_FAIL });
		}
	};

export const updateDispute = (data, type) => async dispatch => {
	try {
		var res;
		// console.log({ type, data });
		if (type === "update")
			res = await axios.post(`/chat/${data?.dispute}/resolve`);
		else
			res = await axios.post(
				`/chat/report`,
				{ ...data },
				{
					headers: {
						"Content-Type": "multipart/form-data",
					},
				}
			);
		// console.log({ res: res?.data });
		dispatch(getDispute(null, type));

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
		dispatch({
			type: GET_DISPUTE_FAIL,
		});
	}
};

export const getFeedback = () => async dispatch => {
	try {
		let res = await axios.get(`/feedback?populate=createdBy`);

		dispatch({
			type: GET_FEEDBACK,
			payload: res.data,
		});
	} catch (err) {
		if (err) console.log({ err });
		if (err) console.log(err?.response ? err?.response?.data : err?.message);
		dispatch({ type: GET_FEEDBACK_FAIL });
	}
};
