import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { Container } from "reactstrap";
import user from "../../Assets/avatar3.png";
import { GlobalState } from "../../Data/Context";
import { BtnGroupUser } from "../../Utils";
import { useParams } from "react-router-dom";

const SingleUser = () => {
	const { auth } = useContext(GlobalState),
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
				<p className="text3 textColor2 fw-600 text-capitalize">
					profile customer
				</p>
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
							<label htmlFor="lastNname" className="textColor2">
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
							<label htmlFor="firstNname" className="textColor2">
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
					</div>
				</form>
			</div>
		</Container>
	);
};

export default SingleUser;
