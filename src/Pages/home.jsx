import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GlobalState } from "../Data/Context";

const Home = () => {
	const { sidebarList } = useContext(GlobalState);
	let navigate = useNavigate();
	useEffect(() => {
		navigate(sidebarList[0].url);
	}, [navigate, sidebarList]);
	return <></>;
};

export default Home;
