import React, { useEffect, useState, useContext } from "react";
import { Modal, ModalHeader, ModalBody } from "reactstrap";
import { BiArrowBack, BiBell } from "react-icons/bi";
import { useNavigate, useLocation, Link } from "react-router-dom";
import user from "../Assets/avatar3.png";
import { GlobalState } from "../Data/Context";
import { Buttons } from "../Utils";

const DefaultHeader = () => {
	const { auth } = useContext(GlobalState);
	let navigate = useNavigate(),
		param = useLocation(),
		[isOpen, setIsOpen] = useState(false),
		toggle = () => {
			setIsOpen(!isOpen);
		};

	return (
		<section className="d-lg-block d-none">
			<div
				className="pt-5 pe-5 ps-3 d-flex align-items-center barFont mb-3 justify-content-between"
				style={{ minHeight: "7rem" }}>
				<div className="w-100">
					{param.pathname === "/users" ? (
						<></>
					) : (
						<BiArrowBack
							className="me-3 myCursor"
							onClick={() => navigate(-1)}
						/>
					)}
				</div>
				<header className="d-flex align-items-center my-auto justify-content-end container">
					<BiBell className="myCursor" size={24} onClick={toggle} />
					<Link
						className="text-dark text-decoration-none d-flex align-items-center"
						to="/profile">
						<img
							src={auth?.user?.avatar ? auth?.user?.avatar?.url : user}
							alt={`${auth?.user?.firstName} ${auth?.user?.lastName}`}
							style={{
								height: "2.5rem",
								width: "2.5rem",
								objectFit: "cover",
								objectPosition: "center 15%",
							}}
							className="rounded-circle img-fluid mx-3"
						/>
						<h6>
							{auth?.user?.firstName} {auth?.user?.lastName}
						</h6>
					</Link>
				</header>
			</div>

			<ModalComponents title={"Notification"} toggle={toggle} isOpen={isOpen}>
				<div className="downH2">
					<Notifications />
				</div>
			</ModalComponents>
		</section>
	);
};

export default DefaultHeader;

const Notifications = () => {
	return (
		<div className="py-2 px-3 rounded bg-notify">
			<div className="textColor2">
				<h6>Package Update</h6>
				<p>
					Your package as been pick up and will deliver soon, stay calm your
					package is save with us.
				</p>
			</div>
		</div>
	);
};

export const ModalComponents = ({
	isOpen,
	toggle,
	title,
	children,
	back,
	size,
	notHeader,
}) => {
	useEffect(() => {
		if (isOpen) {
			document.body.style.overflow = "hidden";
		}
		return () => {
			document.body.style.overflow = "unset";
		};
	}, [isOpen]);
	return (
		<Modal
			isOpen={isOpen}
			centered
			scrollable
			size={size}
			className={notHeader ? "p-0 overflow-hidden" : ""}>
			{!notHeader && (
				<ModalHeader
					toggle={toggle}
					className="borderNone text-capitalize genSansFont textColor2">
					{back && <BiArrowBack className="me-3 myCursor" onClick={back} />}
					{title}
				</ModalHeader>
			)}
			<ModalBody className={notHeader ? "p-0 overflow-hidden" : ""}>
				{children}
			</ModalBody>
		</Modal>
	);
};

export const MainNotify = ({
	toggle,
	isOpen,
	title,
	children,
	handleSubmit,
	state,
	textChange,
	loading,
}) => {
	return (
		<ModalComponents
			title={title ? title : "Notification"}
			toggle={toggle}
			isOpen={isOpen}>
			{children}
			<NotifyForm
				handleSubmit={handleSubmit}
				state={state}
				textChange={textChange}
				loading={loading}
			/>
		</ModalComponents>
	);
};

export const NotifyForm = ({ handleSubmit, state, textChange, loading }) => {
	return (
		<form>
			<div className="form-floating mb-3">
				<input
					type="text"
					required
					name="title"
					className="form-control bg-grey"
					placeholder="title"
					value={state?.title}
					onChange={textChange("title")}
				/>
				<label htmlFor="title">Title</label>
			</div>
			<div className="form-floating mb-3">
				<textarea
					required
					name="message"
					className="form-control bg-grey"
					placeholder="message"
					style={{
						height: "10rem",
						resize: "none",
					}}
					value={state?.message}
					onChange={textChange("message")}
				/>
				<label htmlFor="message">Message</label>
			</div>
			<Buttons
				title={"send"}
				onClick={handleSubmit}
				css="btn btn-primary1 text-capitalize py-3 w-50 d-block mx-auto my-4"
				width={"w-50"}
				loading={loading}
			/>
		</form>
	);
};
