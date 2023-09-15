import React, { useContext } from "react";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { GlobalState } from "./Data/Context";
import PageRender from "./PageRender";
import Home from "./Screens/home";
import Home2 from "./Pages/home";
import { DefaultHeader, Header, Sidebar } from "./Components";
import SocketClient from "./SocketClient";

const Routers = () => {
	const { auth } = useContext(GlobalState);

	return (
		<div
			className={auth?.isAuth ? "side-header" : ""}
			data-bs-spy="scroll"
			data-bs-target="#header-nav"
			data-bs-offset="1">
			<div id={auth?.isAuth ? "main-wrapper" : ""}>
				<ToastContainer />
				{auth?.isAuth ? (
					<>
						<Sidebar />
						<DefaultHeader />
						<SocketClient />
					</>
				) : (
					<Header />
				)}
				<Routes>
					<Route path="/" element={auth?.isAuth ? <Home2 /> : <Home />} />
					<Route path="/:page" element={<PageRender />} />
					<Route path="/:page/:id" element={<PageRender />} />
					<Route path="/:page/:id/:step" element={<PageRender />} />
				</Routes>
			</div>
		</div>
	);
};

export default Routers;
