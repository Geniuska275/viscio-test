import axios from "axios";
import { toast } from "react-toastify";
import { returnErrors } from "../Reducer/ErrorReducer";
import {
	ADD_REWARD,
	ADD_REWARD_FAIL,
	DELETE_REWARD,
	GET_REWARD,
	GET_REWARD_FAIL,
	GET_REWARD_LOADING,
	UPDATE_REWARD,
	UPDATE_REWARD_LOADING,
} from "./ActionType";

export const getReward = data => async dispatch => {
	dispatch({ type: GET_REWARD_LOADING });
	try {
		let res = await axios.get(`/reward${!data ? "" : `&limit=${data.limit}`}`);

		dispatch({
			type: GET_REWARD,
			payload: res.data,
		});
	} catch (err) {
		if (err) console.log({ err });
		if (err) console.log(err?.response ? err?.response?.data : err?.message);
		dispatch({ type: GET_REWARD_FAIL });
	}
};

export const updateReward = (data, type) => async dispatch => {
	dispatch({ type: UPDATE_REWARD_LOADING });
	try {
		var res;

		if (type === "add") res = await axios.post(`/reward`, { ...data });
		else if (type === "update")
			res = await axios.put(`/reward/${data?._id}`, { ...data });
		else if (type === "delete")
			res = await axios.delete(`/reward/${data?._id}`);

		if (type === "add")
			dispatch({
				type: ADD_REWARD,
				payload: res.data?.data,
			});
		else if (type === "update")
			dispatch({
				type: UPDATE_REWARD,
				payload: res.data?.data,
			});
		else if (type === "delete")
			dispatch({
				type: DELETE_REWARD,
				payload: data,
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
		dispatch({ type: ADD_REWARD_FAIL });
	}
};
