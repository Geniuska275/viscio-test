import React, { createElement, useEffect } from "react";
import { useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ErrorPage } from "./Components";
import { GlobalState } from "./Data/Context";
import { Loader } from "./Utils";

const generatePage = (pageName, folder) => {
	const component = () => require(`./${folder}/${pageName}`).default;

	try {
		return createElement(component());
	} catch (error) {
		return <ErrorPage />;
	}
};

const PageRender = () => {
	const { auth, errors } = useContext(GlobalState);
	const { page, id, step } = useParams(),
		navigate = useNavigate();

	useEffect(() => {
		if (auth?.isAuth) {
			if (page === "login" || page === "register") {
				navigate("/");
			}
		}
		if (!auth?.isAuth) {
			if (errors?.errorText?.includes("jwt")) {
				navigate("/login");
			}
		}
	}, [page, auth?.isAuth, navigate, errors?.errorText]);

	if (auth?.token && auth?.isAuthLoading) return <Loader />;

	let pageName = "";
	if (step) {
		pageName = `${page}/${id}/${"[id]"}`;
	} else if (id) {
		pageName = `${page}/[id]`;
	} else {
		pageName = `${page}`;
	}

	return generatePage(pageName, auth?.isAuth ? "Pages" : "Screens");
};

export default PageRender;
