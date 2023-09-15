import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { BiTrashAlt } from "react-icons/bi";
import { BsStar, BsStarFill } from "react-icons/bs";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Card, Container } from "reactstrap";
import user from "../../Assets/avatar3.png";
import { GlobalState } from "../../Data/Context";
import { Buttons, EmptyComponent, Loader } from "../../Utils";
import { ModalComponents } from "../DefaultHeader";

const UserSearch = () => {
	const { feedbacks, auth, updateFeedback } = useContext(GlobalState);
	let [stateUser, setStateUser] = useState(null),
		{ id } = useParams(),
		[loading, setLoading] = useState(false),
		[loading2, setLoading2] = useState(false),
		[feedback, setFeedback] = useState([]),
		[totalRating, setTotalRating] = useState(0),
		[isOpen2, setIsOpen2] = useState(false),
		[submit, setSubmit] = useState(false),
		toggle2 = () => {
			setIsOpen2(!isOpen2);
		};

	useEffect(() => {
		let getUser = async () => {
			setLoading(true);
			try {
				let res = await axios.get(`/data/user/${id}?populate=avatar`);
				setLoading(false);
				// console.log({ res: res.data });
				setStateUser(res.data.data);
			} catch (err) {
				setLoading(false);
				console.log({ err: err.response });

				toast.error(
					err?.response ? err?.response?.data?.message : err?.message
				);
			}
			setLoading(false);
		};

		getUser();
	}, [id]);

	useEffect(() => {
		setFeedback(
			feedbacks?.feedback?.filter(item => item?.receiver === stateUser?._id)
		);
	}, [stateUser, feedbacks?.feedback]);

	useEffect(() => {
		if (feedback?.length > 0) {
			let total = feedback?.reduce((acc, it) => (acc += it?.rating), 0);
			setTotalRating(Math.floor(total / feedback?.length));
			// console.log({ total });
		} else {
			setTotalRating(0);
		}
	}, [feedback]);

	useEffect(() => {
		if (submit && feedbacks?.isDeleted) {
			toggle2();
			setSubmit(false);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [feedbacks?.isDeleted, submit]);

	if (loading) return <Loader />;

	if (!stateUser) return <></>;
	let star = ["", "", "", "", ""];

	return (
		<Container className="px-lg-5 pt-4 pt-lg-0">
			<div className="row g-4">
				<div className="col-lg-4">
					<div className="mx-auto position-relative">
						<div
							className="position-absolute d-none d-lg-flex"
							style={{ top: "-3.6rem" }}>
							<p className="text3 textColor2 fw-600 text-capitalize">
								profile customer
							</p>
						</div>
						<img
							src={stateUser?.avatar ? stateUser?.avatar.url : user}
							alt={stateUser?.lastName}
							style={{
								height: "15rem",
								width: "15rem",
							}}
							className="rounded-circle img-fluid mx-auto d-block"
						/>
					</div>
				</div>
				<div
					className="col-lg-6"
					style={{
						display: "grid",
						placeItems: "start",
						alignItems: "center",
					}}>
					<div>
						<div>
							{star?.slice(0, totalRating)?.map((item, index) => (
								<BsStarFill
									key={index}
									title={item}
									size={30}
									className="mx-1 mb-3 textColor2"
								/>
							))}
							{star?.slice(totalRating)?.map((item, index) => (
								<BsStar
									key={index}
									title={item}
									size={30}
									className="mx-1 mb-3 textColor2"
								/>
							))}
						</div>
						<p className="textColor2">
							Fullname:{" "}
							<strong>
								{stateUser?.firstName} {stateUser?.lastName}
							</strong>
						</p>
						<p className="textColor2 text-capitalize">
							Phone number: <strong>{stateUser?.phone}</strong>
						</p>
					</div>
				</div>
			</div>
			{feedback?.length === 0 ? (
				<EmptyComponent subtitle={"No review yet"} />
			) : (
				<div className="row g-4 my-3">
					{feedback?.map((item, ind) => (
						<Card
							key={ind}
							className="col-2 col-lg-4 border-0"
							style={{ background: "#D9D9D9" }}>
							<div className="d-flex justify-content-between align-items-center py-3">
								<img
									src={item?.avatar ? stateUser?.avatar.url : user}
									alt={item?.lastName}
									style={{
										height: "2.5rem",
										width: "2.5rem",
									}}
									className="rounded-circle img-fluid"
								/>
								<div>
									{star?.slice(0, item?.rating)?.map((item, index) => (
										<BsStarFill
											key={index}
											title={item}
											size={20}
											className="mx-1 mb-3 textColor2"
										/>
									))}
									{star?.slice(item?.rating)?.map((item, index) => (
										<BsStar
											key={index}
											title={item}
											size={20}
											className="mx-1 mb-3 textColor2"
										/>
									))}
								</div>
							</div>
							<p className="fontReduce">{item?.description}</p>
							{item?.createdBy?._id === auth?.user?._id && (
								<div className="btn-group ms-auto w-50 pb-3">
									<button
										onClick={() => {
											toggle2();
										}}
										className="btn btn-danger text-capitalize w-50">
										<BiTrashAlt />
									</button>
									<ModalComponents
										isOpen={isOpen2}
										title="Delete review"
										back={toggle2}>
										<div className="downH2">
											<form className="d-flex flex-column justify-content-center align-items-center h-100">
												<p>
													Do you want to delete rating for{" "}
													{stateUser?.firstName} {stateUser?.lastName}
												</p>
												<div className="btn-group mx-auto w-50">
													<Buttons
														loading={loading2}
														onClick={async e => {
															e.preventDefault();
															setLoading2(true);
															await updateFeedback(item, "delete");
															setSubmit(true);
															setLoading2(false);
														}}
														width="w-50"
														css="btn-success2 text-capitalize py-3 w-50"
														title={"yes"}
													/>
													<Buttons
														onClick={toggle2}
														width="w-50"
														css="btn-primary1 text-capitalize py-3 w-50"
														title={"no"}
													/>
												</div>
											</form>
										</div>
									</ModalComponents>
								</div>
							)}
						</Card>
					))}
				</div>
			)}
		</Container>
	);
};

export default UserSearch;
