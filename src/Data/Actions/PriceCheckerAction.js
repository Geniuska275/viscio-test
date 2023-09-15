import axios from "axios";
import { toast } from "react-toastify";
import { returnErrors } from "../Reducer/ErrorReducer";
import {
	ADD_PRICE_CHECKER,
	ADD_PRICE_CHECKER_FAIL,
	DELETE_PRICE_CHECKER,
	GET_PRICE_CHECKER,
	GET_PRICE_CHECKER_FAIL,
	GET_PRICE_CHECKER_LOADING,
	UPDATE_PRICE_CHECKER,
} from "./ActionType";

export const getPriceChecker = data => async dispatch => {
	dispatch({ type: GET_PRICE_CHECKER_LOADING });
	try {
		let res = await axios.get(
			`/price-checker${!data ? "" : `&limit=${data.limit}`}`
		);

		dispatch({
			type: GET_PRICE_CHECKER,
			payload: res.data,
		});
	} catch (err) {
		if (err) console.log({ err });
		if (err) console.log(err?.response ? err?.response?.data : err?.message);
		dispatch({ type: GET_PRICE_CHECKER_FAIL });
	}
};

export const updatePriceChecker = (data, type) => async dispatch => {
	try {
		var res;
		if (type === "add") res = await axios.post(`/price-checker`, { ...data });
		else if (type === "update")
			res = await axios.put(`/price-checker/${data?._id}`, { ...data });
		else if (type === "delete")
			res = await axios.delete(`/price-checker/${data?._id}`);

		if (type === "add")
			dispatch({
				type: ADD_PRICE_CHECKER,
				payload: res.data?.data,
			});
		else if (type === "update")
			dispatch({
				type: UPDATE_PRICE_CHECKER,
				payload: res.data?.data,
			});
		else if (type === "delete")
			dispatch({
				type: DELETE_PRICE_CHECKER,
				payload: data,
			});

		toast.success(res.data.message, {
			autoClose: 5000,
		});
	} catch (err) {
		console.log({ err: err.response, error: err });
		dispatch(
			returnErrors({
				error: err?.response?.data?.data,
				status: err?.response?.status,
			})
		);
		toast.error(err?.response ? err?.response?.data?.message : err?.message);
		dispatch({ type: ADD_PRICE_CHECKER_FAIL });
	}
};
