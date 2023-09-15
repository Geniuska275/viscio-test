import React, { useState, useContext, useEffect } from "react";
import { Container } from "reactstrap";
import user from "../../Assets/avatar3.png";
import { BtnGroupUser } from "../../Utils";
import { useParams } from "react-router-dom";
import { GlobalState } from "../../Data/Context";

const SingleRider = () => {
	let folders = [
			"Driver License",
			"Car Document",
			"Medical Clearance",
			"Quality Check",
		],
		{ auth } = useContext(GlobalState),
		params = useParams();
	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	let init = { dial_code: "+234" },
		[stateData, setStateData] = useState(init),
		textChange =
			name =>
			({ target: { value } }) => {
				setStateData({ ...stateData, [name]: value });
			};

	useEffect(() => {
		auth?.complete_user?.map(
			item =>
				item?._id === params.id &&
				setStateData({
					...stateData,
					...item,
					fullname: `${item?.firstName} ${item?.lastName}`,
				})
		)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [auth, params.id]);

	return (
		<Container className="px-lg-5 pt-3 pt-lg-0">
			<div className="">
				<p className="text3 textColor2 fw-600 text-capitalize">profile rider</p>
			</div>
			<div className="row g-4">
				<div className="col-lg-6">
					<div className="mx-auto">
						<img
							alt={`${stateData?.firstName} ${stateData?.lastName}`}
							src={stateData?.avatar ? stateData?.avatar?.url : user}
							style={{
								height: "15rem",
								width: "15rem",
							}}
							className="rounded-circle img-fluid mx-auto"
						/>
					</div>
				</div>
				<form className="col-lg-6">
					<div className="w-75">
						<BtnGroupUser active={stateData?.status} user={stateData} />
						<div className="form-floating mb-4">
							<input
								type="email"
								required
								name="email"
								className="form-control bg-grey borderColor textColor2"
								placeholder="Email"
								value={stateData.email}
								onChange={textChange("email")}
							/>
							<label className="textColor2" htmlFor="email">
								Email
							</label>
						</div>
						<div className="form-floating mb-4">
							<input
								type="text"
								required
								name="lastNname"
								className="form-control bg-grey borderColor textColor2"
								placeholder="First name"
								value={stateData.lastName}
								onChange={textChange("lastName")}
							/>
							<label className="textColor2" htmlFor="lastNname">
								First name
							</label>
						</div>
						<div className="form-floating mb-4">
							<input
								type="text"
								required
								name="firstNname"
								className="form-control bg-grey borderColor textColor2"
								placeholder="Last name"
								value={stateData.firstName}
								onChange={textChange("firstName")}
							/>
							<label className="textColor2" htmlFor="firstNname">
								First name
							</label>
						</div>
						<div className="form-floating mb-4">
							<input
								type="tel"
								required
								name="phone"
								className="form-control bg-grey borderColor textColor2"
								placeholder="813 537 3695"
								value={stateData.phone}
								onChange={textChange("phone")}
							/>
							<label className="textColor2" htmlFor="phone">
								Phone
							</label>
						</div>
						<div className="form-floating mb-4">
							<input
								type="date"
								required
								name="date of birth"
								className="form-control bg-grey borderColor textColor2"
								placeholder="Date of birth"
								value={stateData.dob}
								onChange={textChange("dob")}
							/>
							<label
								className="textColor2 text-capitalize"
								htmlFor="date of birth">
								date of birth
							</label>
						</div>
						<div className="form-floating mb-4">
							<input
								type="text"
								required
								name="Delivery mode"
								className="form-control bg-grey borderColor textColor2"
								placeholder="Delivery mode"
								value={stateData.delivery_mode}
								onChange={textChange("delivery_mode")}
							/>
							<label className="textColor2" htmlFor="Delivery mode">
								Delivery mode
							</label>
						</div>
						<div className="form-floating mb-4">
							<input
								type="number"
								required
								name="Vehicle number"
								className="form-control bg-grey borderColor textColor2"
								placeholder="Vehicle number"
								value={stateData.vehicle_number}
								onChange={textChange("vehicle_number")}
							/>
							<label className="textColor2" htmlFor="Vehicle number">
								Vehicle number
							</label>
						</div>
						<div className="form-floating mb-4">
							<input
								type="number"
								required
								name="Vehicle year"
								className="form-control bg-grey borderColor textColor2"
								placeholder="Vehicle year"
								value={stateData.year}
								onChange={textChange("year")}
							/>
							<label className="textColor2" htmlFor="Vehicle year">
								Vehicle year
							</label>
						</div>
					</div>
				</form>
			</div>
			<div className="row g-4 py-5">
				{folders.map((item, index) => (
					<div className="col-6 col-lg-3" key={index}>
						<div
							className="rounded bg-grey"
							style={{
								height: "15rem",
								width: "15rem",
							}}></div>
						<p className="pt-3 text-center text-capitalize">{item}</p>
					</div>
				))}
			</div>
		</Container>
	);
};

export default SingleRider;
