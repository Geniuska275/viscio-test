import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
	let navigate = useNavigate();
	useEffect(() => {
		navigate("/login");
	}, [navigate]);
	return <></>;
};

export default Home;
