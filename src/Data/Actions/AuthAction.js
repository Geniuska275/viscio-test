import {
	ADD_ADMIN,
	ADD_ADMIN_FAIL,
	GET_ALL_USERS,
	GET_ALL_USERS_FAIL,
	GET_ALL_USERS_LOADING,
	GET_ALL_VENDORS,
	GET_COMPLETE_USERS,
	GET_ERRORS_TEXT,
	GET_USER,
	GET_USER_FAIL,
	GET_USER_LOADING,
	LOGIN_USER,
	LOGIN_USER_FAIL,
	LOGIN_USER_LOADING,
	LOGOUT,
	SEARCH_USERS,
	SEARCH_USERS_FAIL,
	SEARCH_USERS_LOADING,
	SEARCH_USERS_RELOAD,
	TEMP_ADMIN_VISCIO,
	TOKEN,
	UPDATE_ADMIN,
	UPDATE_ADMIN_LOADING,
	UPDATE_USER,
	UPDATE_USER_LOADING,
} from "./ActionType";
import { SetAuthToken } from "../Config";
import axios from "axios";
import { toast } from "react-toastify";
import { clearErrors, returnErrors } from "../Reducer/ErrorReducer";
import { getBids, getOrders } from "./OrderAction";
import { getReferral, getSettings } from "./ReferralAction";
import { getPriceChecker } from "./PriceCheckerAction";
import { getReward } from "./RewardAction";
import { getChats, getDispute, getFeedback } from "./ChatAction";
import {
	getBankAccounts,
	getWallet,
	getWithdrawalIncome,
} from "./WalletAction";

// LOGOUT
export const LogoutToken = () => async dispatch => {
	dispatch({ type: LOGOUT });
};

// GET USER INFO
export const loadUser = () => async dispatch => {
	if (localStorage.getItem(TOKEN)) {
		SetAuthToken(localStorage.getItem(TOKEN));
	}
	dispatch({ type: GET_USER_LOADING });
	dispatch(clearErrors());

	try {
		let res = await axios.get(
			`/users/profile?populate=avatar&populate=wallet&populate=bankAccounts&populate=driverLicense&populate=officeFrontView&populate=vehicleRegistration`
		);

		if (res?.data?.data?.isAdmin) {
			dispatch({
				type: GET_USER,
				payload: res.data,
			});
			dispatch(getAllUser());
			dispatch(getAllVendors());
			dispatch(getOrders());
			dispatch(getBids());
			dispatch(getReferral());
			dispatch(getPriceChecker());
			dispatch(getReward());
			dispatch(getChats());
			dispatch(getDispute());
			dispatch(getFeedback());
			dispatch(getWallet());
			dispatch(getBankAccounts());
			dispatch(getWithdrawalIncome());
			dispatch(getSettings());
		} else {
			dispatch({ type: GET_USER_FAIL });
		}
	} catch (err) {
		if (err) console.log({ err });
		if (err) console.log(err?.response ? err?.response?.data : err?.message);
		dispatch({ type: GET_USER_FAIL });
		dispatch({
			type: GET_ERRORS_TEXT,
			payload: err?.response ? err?.response?.data?.message : err?.message,
		});
	}
};

// GET USER INFO
export const getAllUser =
	(data, search = false) =>
	async dispatch => {
		if (search) dispatch({ type: SEARCH_USERS_LOADING });
		else dispatch({ type: GET_ALL_USERS_LOADING });
		try {
			let res1 = !search
				? await axios.get(
						`/admin/users?populate=avatar&populate=driverLicense&populate=officeFrontView&populate=vehicleRegistration${
							!data ? "" : `&limit=${data.limit}`
						}`
				  )
				: await axios.get(
						`/admin/users?populate=avatar&populate=driverLicense&populate=officeFrontView&populate=vehicleRegistration&_searchBy=firstName&_keyword=${search}${
							!data ? "" : `&limit=${data.limit}`
						}`
				  );
			if (!search) {
				var res2 = await axios.get(`/admin/users?type=user`);
				var res3 = await axios.get(`/admin/users?type=vendor`);
				let res4 = await axios.get(
					`/admin/users?populate=avatar&populate=driverLicense&populate=officeFrontView&populate=vehicleRegistration&limit=${res1?.data?.data?.totalDocs}`
				);
				dispatch({
					type: GET_COMPLETE_USERS,
					payload: res4?.data?.data?.docs,
				});
			}
			dispatch({
				type: !search ? GET_ALL_USERS : SEARCH_USERS,
				payload: !search
					? {
							...res1.data,
							totalUsers: res2?.data?.data?.totalDocs,
							totalVendors: res3?.data?.data?.totalDocs,
					  }
					: res1.data,
			});
		} catch (err) {
			if (err) console.log({ err });
			if (err) console.log(err?.response ? err?.response?.data : err?.message);
			dispatch({ type: !search ? GET_ALL_USERS_FAIL : SEARCH_USERS_FAIL });
		}
	};

export const getAllVendors =
	(data, search = false) =>
	async dispatch => {
		dispatch({ type: GET_ALL_USERS_LOADING });
		try {
			let res1 = !search
				? await axios.get(
						`/admin/users?populate=avatar&type=vendor&populate=driverLicense&populate=officeFrontView&populate=vehicleRegistration${
							!data ? "" : `&limit=${data.limit}`
						}`
				  )
				: await axios.get(
						`/admin/users?populate=avatar&type=vendor&populate=driverLicense&populate=officeFrontView&populate=vehicleRegistration&_searchBy=firstName&_keyword=${search}${
							!data ? "" : `&limit=${data.limit}`
						}`
				  );

			dispatch({
				type: GET_ALL_VENDORS,
				payload: res1.data,
			});
		} catch (err) {
			if (err) console.log({ err });
			if (err) console.log(err?.response ? err?.response?.data : err?.message);
			dispatch({ type: !search ? GET_ALL_USERS_FAIL : SEARCH_USERS_FAIL });
		}
	};

export const getUsersReload = () => async dispatch => {
	dispatch({ type: SEARCH_USERS_RELOAD });
};

// LOGIN ACTION
export const loginUser = userData => async dispatch => {
	dispatch({ type: LOGIN_USER_LOADING });
	// Set body
	let body = userData;
	try {
		let res = await axios.post(`/auth/login`, body);
		// console.log({ data: res.data?.data });
		if (res?.data?.data?.user?.isAdmin) {
			dispatch({
				type: LOGIN_USER,
				payload: res.data?.data,
			});
			dispatch(loadUser());
			toast.success(res.data.message, { autoClose: 5000 });
		} else {
			toast.error("Unauthorised access");
			dispatch({ type: LOGIN_USER_FAIL });
		}
	} catch (err) {
		console.log({ err: err.response });
		dispatch(
			returnErrors({
				error: err?.response?.data?.data,
				status: err?.response?.status,
			})
		);
		toast.error(err?.response ? err?.response?.data?.message : err?.message);
	}
};

// ADD_ADMIN ACTION
export const addAdmin = userData => async dispatch => {
	try {
		let res = await axios.post(`/admin/users`, { ...userData });
		// console.log({ data: res.data });

		dispatch({
			type: ADD_ADMIN,
			payload: res.data?.data,
		});
		toast.success(res.data.message, { autoClose: 5000 });
	} catch (err) {
		console.log({ err: err.response });
		dispatch(
			returnErrors({
				error: err?.response?.data?.data,
				status: err?.response?.status,
			})
		);
		toast.error(err?.response ? err?.response?.data?.message : err?.message);
		dispatch({ type: ADD_ADMIN_FAIL });
	}
};

export const updateUser =
	(data, type = "update") =>
	async dispatch => {
		dispatch({ type: UPDATE_USER_LOADING });
		try {
			var res;

			if (type === "update")
				res = await axios.put(`/admin/users/${data?._id}`, { ...data });
			else if (type === "profile-image")
				res = await axios.post(
					`/users/${type}`,
					{ ...data },
					{
						headers: {
							"Content-Type": "multipart/form-data",
						},
					}
				);

			dispatch({
				type: UPDATE_USER,
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
			dispatch({ type: GET_ALL_USERS_FAIL });
		}
	};

export const updateAdmin = (data, type) => async dispatch => {
	dispatch({ type: UPDATE_ADMIN_LOADING });
	try {
		var res;

		if (type === "profile")
			res = await axios.put(`/users/${type}`, { ...data });
		else if (type === "change-password")
			res = await axios.post(`/auth/${type}`, { ...data });
		else if (type === "profile-image")
			res = await axios.post(
				`/users/${type}`,
				{ ...data },
				{
					headers: {
						"Content-Type": "multipart/form-data",
					},
				}
			);

		dispatch({
			type: UPDATE_ADMIN,
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
		dispatch({ type: LOGIN_USER_FAIL });
	}
};

export const imageUpload = async images => {
	let imgArr = [];
	for (const item of images) {
		let logo = new FormData();
		logo.append(`logo`, item);

		try {
			let res = await axios.post(`/image/upload/admin`, logo, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});
			const data = await res.data.url;
			imgArr.push(data);
		} catch (error) {
			console.log({ errorImg: error });
		}
	}
	return imgArr;
};

export const getSetTempUser = data => async dispatch => {
	try {
		if (data) {
			localStorage.setItem(TEMP_ADMIN_VISCIO, data);
		}
		dispatch({
			type: TEMP_ADMIN_VISCIO,
			payload: data ? data : localStorage.getItem(TEMP_ADMIN_VISCIO),
		});
	} catch (error) {}
};
