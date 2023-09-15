import React, { useEffect, useState, useContext } from "react";
import { Container, Card } from "reactstrap";
import { ModalComponents } from "../../Components/DefaultHeader";
import { GlobalState } from "../../Data/Context";
import {
	ActiveSuspend,
	Buttons,
	EmptyComponent,
	EyeToggle,
	Loader,
} from "../../Utils";
import "../../Styles/AuthStyles.css";
import user from "../../Assets/avatar3.png";
import { BiDotsVerticalRounded } from "react-icons/bi";

const Admins = () => {
	const { auth, addAdmin, updateUser } = useContext(GlobalState);
	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	let init = {
			firstName: "",
			lastName: "",
			email: "",
			password: "",
			phone: "",
		},
		[stateData, setStateData] = useState(init),
		[loading, setLoading] = useState(false),
		[loading2, setLoading2] = useState(false),
		[submit, setSubmit] = useState(false),
		textChange =
			name =>
			({ target: { value } }) => {
				setStateData({ ...stateData, [name]: value });
			},
		[isOpen, setIsOpen] = useState(false),
		[isOpen2, setIsOpen2] = useState(false),
		[typePass, setTypePass] = useState(false),
		toggle = () => {
			setIsOpen(!isOpen);
		},
		toggle2 = () => {
			setIsOpen2(!isOpen2);
		},
		[stateAdmin, setAdmin] = useState(null),
		[actionAdmin, setActionAdmin] = useState(null);

	useEffect(() => {
		setAdmin(auth?.complete_user?.filter(item => item?.isAdmin));
	}, [auth?.complete_user]);

	let handleSubmit = async e => {
		e.preventDefault();
		setLoading(true);
		await addAdmin(stateData);
		setLoading(false);
		setSubmit(true);
	};

	let handleSubmit2 = async e => {
		e.preventDefault();
		setLoading2(true);
		await updateUser({
			_id: actionAdmin?._id,
			status: actionAdmin?.status === "active" ? "inactive" : "active",
		});
		setLoading2(false);
		setSubmit(true);
	};

	useEffect(() => {
		if (submit && auth?.isAdminAdded) {
			setSubmit(false);
			setIsOpen(false);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [submit, auth?.isAdminAdded]);

	useEffect(() => {
		if (submit && auth?.isUpdatedMe) {
			setIsOpen2(false);
			setSubmit(false);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [auth?.isUpdatedMe, submit]);

	let dropDown = [
		{ name: "suspend", url: "/save", type: "button", use: "suspend" },
	];

	let dropdownMenu = user => (
		<div className="nav-item dropdown post-options ms-auto">
			<BiDotsVerticalRounded
				size={24}
				id="moreLink"
				data-bs-toggle="dropdown"
				className="ms-auto myCursor"
			/>

			<div className="dropdown-menu" aria-labelledby="moreLink">
				{dropDown.map((item, i) => (
					<div
						key={i}
						onClick={() => {
							setActionAdmin(user);
							toggle2();
						}}
						className="dropdown-item d-flex align-items-center my-1 myCursor text-capitalize text-center d-flex justify-content-center">
						<span className="w-100">
							{user?.status === "active" ? item?.name : "activate"}
						</span>
					</div>
				))}
			</div>
		</div>
	);

	if (auth?.get_loading) return <Loader />;
	if (!stateAdmin) return;

	return (
		<Container className="px-lg-5  pt-3 pt-lg-0">
			<div className="d-flex justify-content-end align-items-center">
				<button className="btn btn-primary1" onClick={toggle}>
					Create Admin
				</button>
				<ModalComponents isOpen={isOpen} back={toggle} title="Create Admin">
					<form>
						<div className="form-floating mb-3">
							<input
								type="text"
								required
								name="lastName"
								className="form-control bg-grey"
								placeholder="LastName"
								value={stateData.lastName}
								onChange={textChange("lastName")}
							/>
							<label htmlFor="lastName">LastName</label>
						</div>
						<div className="form-floating mb-3">
							<input
								type="text"
								required
								name="firstName"
								className="form-control bg-grey"
								placeholder="FirstName"
								value={stateData.firstName}
								onChange={textChange("firstName")}
							/>
							<label htmlFor="firstName">FirstName</label>
						</div>
						<div className="form-floating mb-3">
							<input
								type="email"
								required
								name="email"
								className="form-control bg-grey"
								placeholder="example@mail.com"
								value={stateData.email}
								onChange={textChange("email")}
							/>
							<label htmlFor="email">Email</label>
						</div>
						<div className="form-floating mb-3">
							<input
								type="number"
								required
								name="phone"
								className="form-control bg-grey"
								placeholder="0810 000 0000"
								value={stateData.phone}
								onChange={textChange("phone")}
							/>
							<label htmlFor="phone">Telephone</label>
						</div>
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
							<EyeToggle typePass={typePass} setTypePass={setTypePass} />
						</div>
						<Buttons
							onClick={handleSubmit}
							loading={loading}
							title={"submit"}
							css="btn btn-primary1 text-capitalize py-3 w-100 my-4"
						/>
					</form>
				</ModalComponents>
			</div>
			{stateAdmin?.length > 0 ? (
				<div className="orderbarType g-4 py-5">
					{stateAdmin?.map((item, index) => (
						<Card
							className="rounded border-0 shadow px-3 py-4 fontReduce"
							key={index}>
							<div className="d-flex align-items-center">
								<div className="me-2">
									<img
										src={item?.avatar ? item?.avatar?.url : user}
										alt={item?.lastName}
										style={{
											height: "4rem",
											width: "4rem",
											objectFit: "cover",
											objectPosition: "center 15%",
										}}
										className="rounded img-fluid mx-auto"
									/>
								</div>
								<div>
									<h6>
										{item?.lastName} {item?.firstName}
									</h6>
									<span className="text-capitalize text-muted">
										{item?.type}
									</span>
								</div>
								{dropdownMenu(item)}
							</div>
							<hr />
							<p>
								<strong>Email:</strong> {item?.email}
							</p>
							<p>
								<strong>Phone:</strong> {item?.phone}
							</p>
						</Card>
					))}
				</div>
			) : (
				<EmptyComponent
					subtitle={`Admin is empty ${
						auth?.properties?.hasNextPage ? "load more" : ""
					}`}
				/>
			)}
			<ActiveSuspend
				loading={loading2}
				handleSubmit={handleSubmit2}
				toggle2={toggle2}
				isOpen2={isOpen2}
				user={actionAdmin}
				active={actionAdmin?.status}
			/>
		</Container>
	);
};

export default Admins;
