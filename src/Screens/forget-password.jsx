import React, { useEffect, useState } from "react";
import { Container } from "reactstrap";
import { BsEye, BsEyeSlash } from "react-icons/bs";
import { Buttons, OtpComponent } from "../Utils";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const ForgetPassword = () => {
	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	let [stateData, setStateData] = useState({
		email: "",
		token: "",
		password: "",
		confirmPassword: "",
	});
	let [loading, setLoading] = useState(false);
	let [message, setMessage] = useState("");
	let [message2, setMessage2] = useState(""),
		[code, setCode] = useState("");

	let navigate = useNavigate();

	let handleSubmit = async e => {
		e.preventDefault();
		if (!stateData.email) return;
		setLoading(true);
		try {
			var res = await axios.get(
				`/auth/request-reset-password?email=${stateData.email}`
			);
			setMessage(res.data.message);
			toast.success(res.data.message, { autoClose: false });
		} catch (error) {
			toast.warn(error);
		}
		setLoading(false);
	};

	useEffect(()=> {
		setActive(0)
	},[])

	let handleSubmitNew = async e => {
		e.preventDefault();
		console.log({ stateData, code });
		if (!code) return;
		if (!stateData.password) return;
		if (stateData.password !== stateData.confirmPassword)
			return toast.error("Password do not match");

		setLoading(true);
		try {
			let body = {
				token: code,
				newPassword: stateData.password,
			};
			let res = await axios.post(`/auth/reset-password`, body);
			console.log({ data: res.data });
			setMessage2(res.data.message);
			toast.success(res.data.message);
		} catch (error) {
			if (error.response.data) toast.warn(error.response.data.message);
			console.log({ error });
		}
		setLoading(false);
	};

	useEffect(() => {
		if (message) {
			setActive(++active);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [message]);

	useEffect(() => {
		if (message2) {
			navigate("/login");
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [message2]);

	let [typePass, setTypePass] = useState(false),
		[typePassConfirm, setTypePassConfirm] = useState(false),
		series = ["Forget password", "Verify your email", "Create Password"],
		[active, setActive] = useState(0);

	let textChange =
		name =>
		({ target: { value } }) => {
			setStateData({ ...stateData, [name]: value });
		};

	// let handleSubmit = async e => {
	// 	e.preventDefault();
	// 	if (active === 2) {
	// 		console.log({ stateData });
	// 	} else setActive(++active);
	// };

	return (
		<Container className="py-5">
			<section className="d-flex justify-content-center align-items-center fullscreen">
				<div
					className="m-auto shadow px-3 py-5 rounded shadow2 w-100"
					style={{
						maxWidth: "550px",
					}}>
					<Container className="px-lg-5 px-3">
						<h3 className="textColor2 text-capitalize fw-600">
							{series[active]}
						</h3>
						{active === 0 ? (
							<PasswordBox
								handleSubmit={handleSubmit}
								loading={loading}
								stateData={stateData}
								textChange={textChange}
							/>
						) : active === 1 ? (
							<div>
								<VerifyMail
									code={code}
									setCode={setCode}
									setActive={setActive}
									handleSubmit={handleSubmit}
									text="confirm OTP"
									numInputs={7}
								/>
								<Buttons
									onClick={() => setActive(++active)}
									css="btn btn-primary1 text-capitalize py-3 w-100 my-4"
									title="confirm OTP"
								/>
							</div>
						) : active === 2 ? (
							<NewPasswordBox
								typePass={typePass}
								setTypePass={setTypePass}
								typePass2={typePassConfirm}
								setTypePass2={setTypePassConfirm}
								handleSubmit={handleSubmitNew}
								stateData={stateData}
								textChange={textChange}
								loading={loading}
								setActive={setActive}
								active={active}
							/>
						) : (
							<></>
						)}
					</Container>
				</div>
			</section>
		</Container>
	);
};

export default ForgetPassword;

const PasswordBox = ({ handleSubmit, loading, textChange, stateData }) => {
	return (
		<>
			<small className="mb-4 d-block">Enter your email address </small>
			<form>
				<div className="form-floating mb-3">
					<input
						type="email"
						required
						name="email"
						className="form-control bg-grey"
						placeholder="example@mail.com"
						value={stateData?.email}
						onChange={textChange("email")}
					/>
					<label htmlFor="email">Email</label>
				</div>
				<Buttons
					onClick={handleSubmit}
					loading={loading}
					css="btn btn-primary1 text-capitalize py-3 w-100 my-4"
					title="submit"
				/>
			</form>
		</>
	);
};

const NewPasswordBox = ({
	typePass,
	setTypePass,
	typePass2,
	setTypePass2,
	handleSubmit,
	stateData,
	textChange,
	loading,
	setActive,
	active,
}) => {
	return (
		<>
			<small className="mb-4 d-block">Enter your new password here</small>

			<div className="form-floating mb-3 show-hide position-relative">
				<input
					type={typePass ? "text" : "password"}
					required
					name="password"
					className="form-control bg-grey"
					placeholder="@Password123"
					value={stateData.password}
					onChange={textChange("password")}
				/>
				<label htmlFor="Password">Password</label>
				<span className="" onClick={() => setTypePass(!typePass)}>
					{!typePass ? <BsEye /> : <BsEyeSlash />}
				</span>
			</div>
			<div className="form-floating mb-3 show-hide position-relative">
				<input
					type={typePass2 ? "text" : "password"}
					required
					name="confirmpassword"
					className="form-control bg-grey"
					placeholder="@Password123"
					value={stateData.confirmPassword}
					onChange={textChange("confirmPassword")}
				/>
				<label htmlFor="confirmpassword">Confirm Password</label>
				<span className="" onClick={() => setTypePass2(!typePass2)}>
					{!typePass2 ? <BsEye /> : <BsEyeSlash />}
				</span>
			</div>
			<Buttons
				onClick={handleSubmit}
				loading={loading}
				css="btn btn-primary1 text-capitalize py-3 w-100 my-4"
				title="reset"
			/>
			<div className="d-flex justify-content-end align-items-center">
				<button onClick={() => setActive(--active)} className="btn">
					back
				</button>
			</div>
		</>
	);
};

export const VerifyMail = ({ code, setCode, loading2, numInputs }) => {
	return (
		<>
			<small className="mb-4 d-block">Enter the OTP sent to your email</small>
			<div className="d-flex justify-content-center my-5 mx-auto">
				<OtpComponent
					stateData={code}
					textChange={data => {
						setCode(data);
					}}
					css="borderColor"
					loading={loading2}
					numInputs={numInputs}
				/>
			</div>
		</>
	);
};
