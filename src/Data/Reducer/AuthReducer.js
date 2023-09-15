import {
	ADD_ADMIN,
	ADD_ADMIN_FAIL,
	GET_ALL_USERS,
	GET_ALL_USERS_FAIL,
	GET_ALL_USERS_LOADING,
	GET_ALL_VENDORS,
	GET_COMPLETE_USERS,
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
	UPDATE_ADMIN_FAIL,
	UPDATE_ADMIN_LOADING,
	UPDATE_USER,
} from "../Actions/ActionType";

const initialState = {
	token: localStorage.getItem(TOKEN),
	user: null,
	isAuth: false,
	isLoggedIn: false,
	isLoading: false,
	isAuthLoading: false,
	logoutLoading: false,
	all_users: [],
	all_customers: [],
	all_vendors: [],
	properties_vendors: null,
	isUpdatedMe: false,
	isUpdated: false,
	update_loading: false,
	isAdminAdded: false,
	properties: null,
	mainSearch: [],
	searchLoading: false,
	isFound: false,
	properties_search: null,
	totalUsers: 0,
	totalVendors: 0,
	complete_user: [],
	get_loading: false,
};

const AuthReducer = (state = initialState, { type, payload }) => {
	switch (type) {
		case SEARCH_USERS:
			return {
				...state,
				isFound: true,
				searchLoading: false,
				mainSearch: payload?.data?.docs,
				properties_search: { ...payload?.data, docs: null },
			};
		case SEARCH_USERS_FAIL:
			return {
				...state,
				isFound: false,
				searchLoading: false,
				mainSearch: null,
			};
		case SEARCH_USERS_LOADING:
			return {
				...state,
				searchLoading: true,
			};
		case GET_COMPLETE_USERS:
			return {
				...state,
				complete_user: payload,
			};
		case SEARCH_USERS_RELOAD:
			return {
				...state,
				isFound: false,
			};
		case GET_USER:
			return {
				...state,
				user: payload.data,
				isAuth: true,
				isAuthLoading: false,
			};
		case GET_USER_FAIL:
			return {
				...state,
				user: null,
				isAuth: false,
				isAuthLoading: false,
			};
		case GET_USER_LOADING:
			return {
				...state,
				isAuthLoading: true,
			};
		case ADD_ADMIN:
			return {
				...state,
				isAdminAdded: true,
				complete_user: [payload, ...state.complete_user],
				all_users: [payload, ...state.all_users],
			};
		case ADD_ADMIN_FAIL:
			return { ...state, isAdminAdded: false };
		case LOGIN_USER:
			localStorage.setItem(TOKEN, payload.token);
			return {
				...state,
				isLoggedIn: true,
				isLoading: false,
			};
		case LOGIN_USER_FAIL:
			return {
				...state,
				isLoggedIn: false,
				isLoading: false,
				isUpdated: false,
			};
		case LOGIN_USER_LOADING:
			return {
				...state,
				isLoading: true,
			};
		case GET_ALL_USERS_LOADING:
			return {
				...state,
				get_loading: true,
			};
		case GET_ALL_USERS:
			return {
				...state,
				all_users: payload?.data?.docs,
				properties: { ...payload?.data, docs: null },
				totalUsers: payload?.totalUsers,
				totalVendors: payload?.totalVendors,
				get_loading: false,
			};
		case GET_ALL_VENDORS:
			return {
				...state,
				all_vendors: payload?.data?.docs,
				properties_vendors: { ...payload?.data, docs: null },
				totalVendors: payload?.data?.totalDocs,
				get_loading: false,
			};
		case UPDATE_USER:
			return {
				...state,
				all_users: EditData(state.all_users, payload),
				complete_user: EditData(state.complete_user, payload),
				isUpdatedMe: true,
			};
		case GET_ALL_USERS_FAIL:
			return {
				...state,
				all_users: state.all_users,
				isUpdated: false,
				get_loading: false,
			};
		case UPDATE_ADMIN_LOADING:
			return {
				...state,
				update_loading: true,
			};
		case UPDATE_ADMIN:
			return {
				...state,
				update_loading: false,
				user: payload,
				isUpdated: true,
			};
		case UPDATE_ADMIN_FAIL:
			return {
				...state,
				update_loading: false,
				user: state.user,
				isUpdated: false,
			};
		case TEMP_ADMIN_VISCIO:
			return {
				...state,
				userType: payload,
			};
		case LOGOUT:
			localStorage.removeItem(TOKEN);
			localStorage.removeItem(TEMP_ADMIN_VISCIO);
			return initialState;
		default:
			return state;
	}
};

export default AuthReducer;

export const EditData = (data, payload) => {
	let updatateData = data.map(item =>
		item._id !== payload._id ? item : payload
	);
	return updatateData;
};

export const DeleteData = (data, payload) => {
	let filterItem = [...data.filter(item => item._id !== payload._id)];
	return filterItem;
};
