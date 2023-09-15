import React, { useState } from "react";
import { toast } from "react-toastify";
import { DotLoader, ClipLoader } from "react-spinners";
import { FaTimes } from "react-icons/fa";
import OtpInput from "react-otp-input";
import empty from "../Assets/empty.png";
import $ from "jquery";
import { BsEye, BsEyeSlash } from "react-icons/bs";
import { MainNotify, ModalComponents } from "../Components/DefaultHeader";
import { useContext } from "react";
import { GlobalState } from "../Data/Context";
import { useEffect } from "react";

export const ImageView = ({
	loading,
	images,
	setImages,
	file,
	setLoading,
	css,
}) => {
	let styleUpload = {
		display: images ? "block" : "none",
	};

	const handleUploadImage = async e => {
		setLoading(true);
		let file = e.target.files[0];
		if (!file) {
			setLoading(false);
			return toast.error("No Image file included...");
		}

		if (file.type.match(/image/i) && file.size > 1024 * 1024 * 20) {
			setLoading(false);
			return toast.error("File size too large, ~= 20mb...");
		}
		if (
			file.type !== "image/jpeg" &&
			file.type !== "image/jpg" &&
			file.type !== "image/png"
		) {
			setLoading(false);
			return toast.error("Image format not supported");
		}

		setImages(file);
		setLoading(false);
	};

	return (
		<div className={`upload mx-auto position-relative p-2 ${css ? css : ""} `}>
			<input
				className="upload-file"
				type="file"
				id="file_up"
				name={file}
				onChange={handleUploadImage}
			/>
			{loading ? (
				<div className="file_img d-flex align-items-center justify-content-center">
					<DotLoader color="#021669" />
				</div>
			) : (
				<div className="file_img" style={styleUpload}>
					{images && (
						<img
							src={
								images
									? typeof images === "string"
										? images
										: URL.createObjectURL(images)
									: ""
							}
							alt="product-img"
						/>
					)}
					<div className="faTimes2 faTimes" onClick={() => setImages("")}>
						<FaTimes color="red" size={20} />
					</div>
				</div>
			)}
		</div>
	);
};

export const Buttons = ({
	type,
	loading,
	width,
	css,
	title,
	children,
	onClick,
	loadCss,
	style,
	disabled,
}) => {
	return (
		<button
			disabled={loading || disabled}
			type={type ? type : "button"}
			style={style ? style : {}}
			onClick={onClick ? onClick : () => {}}
			className={`btn ${
				css ? css : "btn-primary1 text-capitalize"
			} d-flex align-items-center justify-content-center ${
				width ? width : "w-100"
			}`}>
			{children}
			<span className={loading ? "me-2" : ""}>{title ? title : "log in"}</span>
			{loading && <ClipLoader color={loadCss ? loadCss : "white"} size={16} />}
		</button>
	);
};

// export const ImageUpload = async images => {
// 	let imgArr = [];
// 	for (const item of images) {
// 		let post = new FormData();
// 		post.append(`photo`, item);

// 		let res = await axios.post(`/v1.1/files/generic-picture`, post, {
// 			headers: {
// 				"Content-Type": "multipart/form-data",
// 			},
// 		});
// 		const data = await res.data.response.url;
// 		imgArr.push(data);
// 	}
// 	return imgArr;
// };

$(document).on("load", function () {
	$(".innerLoader").fadeOut(); // will first fade out the loading animation
	$(".mainLoader").delay(333).fadeOut("slow"); // will fade out the white DIV that covers the website.
	$("body").delay(333);
});

export const Loader = () => {
	return (
		<div className="d-flex my-3 justify-content-center mainLoader">
			<div className="innerLoader">
				<DotLoader color="#021669" />
			</div>
		</div>
	);
};

export const OtpComponent = ({
	stateData,
	textChange,
	numInputs,
	separator,
	css,
	loading,
}) => {
	return (
		<>
			<OtpInput
				value={stateData}
				onChange={otp => textChange(otp)}
				numInputs={numInputs ? numInputs : 6}
				separator={separator ? separator : <span>-</span>}
				inputStyle={`${css} otp-code__input`}
				isDisabled={loading}
				shouldAutoFocus={true}
				isInputNumber={true}
			/>
		</>
	);
};

export const EmptyComponent = ({ subtitle }) => {
	return (
		<div className="d-flex flex-column justify-content-center align-items-center aboutScreen">
			<img src={empty} alt="EmptyComponent" className="emptyData img-fluid" />
			<h1 className="text-center text-uppercase">Nothing</h1>
			<p>{subtitle ? subtitle : `Your collection list is empty`}</p>
		</div>
	);
};

export const EyeToggle = ({ typePass, setTypePass }) => {
	return (
		<span onClick={() => setTypePass(!typePass)}>
			{typePass ? <BsEye color="#021669" /> : <BsEyeSlash color="#021669" />}
		</span>
	);
};

export const MiddleHeader = ({ text }) => {
	return (
		<div className="d-flex justify-content-center align-items-center mb-3">
			<h1 className="text-capitalize textColor2 text-center">{text}</h1>
		</div>
	);
};

export const BtnGroupUser = ({ active, user }) => {
	const { updateUser, auth, referrals, notifySettings } =
		useContext(GlobalState);
	let [isOpen, setIsOpen] = useState(false),
		[isOpen2, setIsOpen2] = useState(false),
		[loading, setLoading] = useState(false),
		[submit, setSubmit] = useState(false),
		toggle = () => {
			setIsOpen(!isOpen);
		},
		toggle2 = () => {
			setIsOpen2(!isOpen2);
		},
		handleSubmit = async e => {
			e.preventDefault();
			setLoading(true);
			await updateUser({
				_id: user?._id,
				status: active === "active" ? "inactive" : "active",
			});
			setLoading(false);
			setSubmit(true);
		},
		[loading2, setLoading2] = useState(false),
		init = {
			message: "",
			title: "",
			as: "notification",
			user: user?._id,
		},
		[state, setState] = useState(init),
		handleSubmit2 = async e => {
			e.preventDefault();
			setLoading2(true);
			await notifySettings({ ...state, userIds: [user?._id] });
			setLoading2(false);
			setSubmit(true);
		},
		textChange =
			name =>
			({ target: { value } }) => {
				setState({ ...state, [name]: value });
			};

	useEffect(() => {
		if (submit && referrals?.notify) {
			setSubmit(false);
			setIsOpen(false);
			setState(init);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [submit, referrals?.notify]);

	useEffect(() => {
		if (submit && auth?.isUpdatedMe) {
			toggle2();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [auth?.isUpdatedMe, submit]);

	return (
		<div className="btn-group w-100 mb-4">
			<button
				type="button"
				onClick={toggle2}
				className={`btn ${
					active ? (active === "active" ? "btn-success2" : "btn-danger") : ""
				} text-capitalize w-50 py-3`}>
				{active ? active : "Active"}
			</button>
			<button
				type="button"
				onClick={toggle}
				className="btn btn-primary1 text-capitalize py-3 w-50">
				send notification
			</button>
			<MainNotify
				isOpen={isOpen}
				toggle={toggle}
				title="message"
				textChange={textChange}
				loading={loading2}
				handleSubmit={handleSubmit2}
				state={state}
			/>
			<ActiveSuspend
				loading={loading}
				handleSubmit={handleSubmit}
				toggle2={toggle2}
				isOpen2={isOpen2}
				user={user}
				active={active}
			/>
		</div>
	);
};

export const ActiveSuspend = ({
	loading,
	handleSubmit,
	toggle2,
	isOpen2,
	user,
	active,
}) => {
	return (
		<ModalComponents
			back={toggle2}
			isOpen={isOpen2}
			title={`${active === "active" ? "Suspend" : "Activate"} User`}>
			<div className="downH2 d-flex align-items-center justify-content-center">
				<div className="">
					<p>
						Do you want to {active === "active" ? "Suspend " : "Activate "}
						{user?.firstName} {user?.lastName}?
					</p>
					<div className="w-100 btn-group">
						<Buttons
							type="button"
							css={`btn ${
								active
									? active !== "active"
										? "btn-success2"
										: "btn-danger"
									: ""
							} text-capitalize w-50 py-3`}
							width="w-50"
							title={"yes"}
							loading={loading}
							onClick={handleSubmit}
						/>

						<button
							type="button"
							onClick={toggle2}
							className="btn btn-primary1 text-capitalize py-3 w-50">
							back
						</button>
					</div>
				</div>
			</div>
		</ModalComponents>
	);
};
