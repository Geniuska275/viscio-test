import React from "react";
import { useNavigate } from "react-router-dom";
import "./Error.css";

const ErrorPage = () => {
	let navigate = useNavigate();
	return (
		<div className="body">
			<section id="not-found">
				<div className="circles">
					<p>
						404
						<br />
						<small>PAGE NOT FOUND</small>
						<button
							onClick={() => navigate("/")}
							className="btn btn-primary1 text-capitalize">
							go home
						</button>
					</p>
					<span className="circle big"></span>
					<span className="circle med"></span>
					<span className="circle small"></span>
				</div>
			</section>
		</div>
	);
};

export default ErrorPage;

export const DefaultBoxing = ({ children }) => {
	return (
		<div className="downH rounded bg-select bg-select-2 p-3 w-75 mx-auto text-center text-white text-capitalize d-flex justify-content-center align-items-center bigBox position-relative">
			<div className="abs1"></div>
			<div className="abs1"></div>
			<div className="abs1"></div>
			<div className="abs"></div>
			<div className="abs"></div>
			<div className="abs"></div>
			{children}
		</div>
	);
};
