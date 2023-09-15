import React, { useEffect, useState, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { GlobalState } from "../Data/Context";
import { BiLogIn } from "react-icons/bi";
import logo from "../Assets/logo_light.png";
import "../Styles/Sidebar.css";
// import "../Styles/OrgAuth.css";
import { FaTimes } from "react-icons/fa";
import { Buttons } from "../Utils";
import { Navbar } from "reactstrap";
import logo2 from "../Assets/logo.png";
import { MainNotify } from "./DefaultHeader";
import { toast } from "react-toastify";

export let CapitalizeFirst = text => {
	return text.replace(/\b\w/g, m => {
		return m.toUpperCase();
	});
};

const Sidebar = () => {
	const { sidebarList, LogoutToken, auth, referrals, notifySettings } =
		useContext(GlobalState);
	let location = useLocation(),
		navigate = useNavigate(),
		[loading, setLoading] = useState(false),
		[loading2, setLoading2] = useState(false),
		[submit, setSubmit] = useState(false),
		init = {
			message: "",
			title: "",
			as: "notification",
			user: "all",
		},
		[state, setState] = useState(init),
		[sidebarState, setSidebarState] = useState(null),
		[shouldOpen, setShouldOpen] = useState(false),
		[isOpen, setIsOpen] = useState(false),
		[isOpen2, setIsOpen2] = useState(false);
	let toggle = () => {
			setIsOpen(!isOpen);
		},
		toggle2 = () => {
			setIsOpen2(!isOpen2);
		},
		handleSubmit = async e => {
			e.preventDefault();
			setLoading2(true);
			let data = [];
			if (state?.user === "all") {
				auth?.complete_user?.map(
					item => !item?.isAdmin && data?.push(item?._id)
				);
			} else if (state?.user === "user") {
				auth?.complete_user?.map(
					item => item?.type === "user" && data?.push(item?._id)
				);
			} else if (state?.user === "logistics") {
				auth?.complete_user?.map(
					item => item?.type === "vendor" && data?.push(item?._id)
				);
			} else if (state?.user === "driver") {
				auth?.complete_user?.map(
					item => item?.type === "driver" && data?.push(item?._id)
				);
			}
			// console.log({ data });
			if (data?.length === 0)
				return toast.info("No user for this selected list");
			await notifySettings({ ...state, userIds: data });
			setLoading2(false);
			setSubmit(true);
		},
		textChange =
			name =>
			({ target: { value, type, title, checked } }) => {
				setState({
					...state,
					[name]:
						type === "radio" ? title : type === "checkbox" ? checked : value,
				});
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
		if (auth?.isAuth) {
			setSidebarState(sidebarList);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [auth?.isAuth]);

	useEffect(() => {
		setShouldOpen(
			document.body.clientWidth < 992 &&
				document?.getElementById("sidebarSmall")?.classList?.contains("visible")
		);
	}, [isOpen2]);

	useEffect(() => {
		if (shouldOpen)
			if (isOpen2) {
				document.body.style.overflow = "hidden";
			}
		return () => {
			document.body.style.overflow = "unset";
		};
	}, [isOpen2, shouldOpen]);

	let menuList = (item, index) => (
		<li
			className={`${
				location.pathname.includes(item.url) ? "headerActive" : ""
			}`}
			key={index}>
			{item.button === "notification" ? (
				<span
					className="text-capitalize genSansFont myCursor"
					onClick={() => {
						toggle();
						toggle2();
					}}>
					<span className="mx-3">{item.icon}</span>
					{item.name}
				</span>
			) : (
				<Link
					className="text-capitalize genSansFont"
					onClick={toggle2}
					to={item.url}>
					<span className="mx-3">{item.icon}</span>
					{item.name}
				</Link>
			)}
		</li>
	);

	let handleLogOut = async e => {
		e.preventDefault();
		setLoading(true);
		await LogoutToken();
		setLoading(false);
		navigate("/");
	};

	useEffect(() => {
		document.title = CapitalizeFirst(
			`Viscio Dashboard ${location.pathname.split("/").join(" ").substring(1)}`
		);
	}, [location.pathname]);

	if (!sidebarState) return <></>;

	return (
		<aside id="header" className="mainHeader sticky-top">
			<nav className="sidebar-menu bg-dark1 shadow">
				<div className="d-flex justify-content-lg-center justify-content-between mx-3 mx-lg-0 align-items-center">
					<Link to={"/"}>
						<img src={logo} alt="Cebiz" className="img-fluid logoOrg" />
					</Link>
					{isOpen2 ? (
						<FaTimes
							color="white"
							onClick={toggle2}
							className="navbar-close rounded d-lg-none"
						/>
					) : (
						<button
							className="navbar-toggler ms-auto d-lg-none"
							type="button"
							onClick={toggle2}
							data-bs-toggle="collapse"
							data-bs-target="#header-nav">
							<span></span>
							<span></span>
							<span></span>
						</button>
					)}
				</div>
				<ul
					id="sidebarSmall"
					className={`navbar-nav sidebarSmall pb-5 ${
						isOpen2 ? "visible" : ""
					}`}>
					{sidebarState.map((item, index) => menuList(item, index))}
					<li>
						<Buttons
							loading={loading}
							loadCss="textColor"
							title={"logout"}
							onClick={handleLogOut}
							width="mx-auto"
							css="btn-white text-capitalize genSansFont textColor logout">
							<BiLogIn size={24} className="mx-3" />
						</Buttons>
					</li>
				</ul>
			</nav>
			<MainNotify
				isOpen={isOpen}
				toggle={toggle}
				title="message"
				loading={loading2}
				textChange={textChange}
				state={state}
				handleSubmit={handleSubmit}>
				<div className="row mb-4">
					<label htmlFor="send_to">Send To</label>
					<div className="col-3">
						<input
							type="radio"
							name="send_to"
							className="form-check-input me-2 borderColor"
							title="all"
							id="All"
							value={state?.user}
							onChange={textChange("user")}
							checked={state?.user === "all"}
						/>
						<label htmlFor="All" className="fontMini">
							{" "}
							All Member
						</label>
					</div>
					<div className="col-3">
						<input
							type="radio"
							name="send_to"
							className="form-check-input me-2 borderColor"
							title="user"
							id="All user"
							value={state?.user}
							onChange={textChange("user")}
							checked={state?.user === "user"}
						/>
						<label htmlFor="All user" className="fontMini">
							{" "}
							All user
						</label>
					</div>
					<div className="col-3">
						<input
							type="radio"
							name="send_to"
							className="form-check-input me-2 borderColor"
							title="logistics"
							id="Logistics"
							value={state?.user}
							onChange={textChange("user")}
							checked={state?.user === "logistics"}
						/>
						<label htmlFor="Logistics" className="fontMini">
							{" "}
							All Logistics
						</label>
					</div>
					<div className="col-3">
						<input
							type="radio"
							name="send_to"
							className="form-check-input me-2 borderColor"
							title="driver"
							id="Driver"
							value={state?.user}
							onChange={textChange("user")}
							checked={state?.user === "driver"}
						/>
						<label htmlFor="Driver" className="fontMini">
							{" "}
							Driver
						</label>
					</div>
				</div>
			</MainNotify>
		</aside>
	);
};

export default Sidebar;

export const Header = () => {
	let location = useLocation();

	let [isShadow, setIsShadow] = useState(false);

	let handleScroll = () => {
		window.onscroll = () => {
			if (window.scrollY > 100) setIsShadow(true);
			else setIsShadow(false);
		};
	};

	useEffect(() => {
		document.title = CapitalizeFirst(
			`Viscio Dashboard ${location.pathname.split("/").join(" ").substring(1)}`
		);
		handleScroll();
	}, [location.pathname]);

	return (
		<Navbar
			expand="lg"
			sticky="top"
			className={`"container-fluid px-3 header bg-white headerScroll ${
				isShadow ? "shadow" : ""
			}`}
			light>
			<Link to="/">
				<img src={logo2} alt="VISCIO" className="logo" />
			</Link>
		</Navbar>
	);
};
