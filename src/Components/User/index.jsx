import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { BsStar, BsStarFill } from "react-icons/bs";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Card, Container } from "reactstrap";
import user from "../../Assets/avatar3.png";
import { GlobalState } from "../../Data/Context";
import { EmptyComponent, Loader } from "../../Utils";

const UserSearch = () => {
	const { feedbacks } = useContext(GlobalState);
	let [stateUser, setStateUser] = useState(null),
		{ id } = useParams(),
		[loading, setLoading] = useState(false),
		[feedback, setFeedback] = useState([]),
		[totalRating, setTotalRating] = useState(0),
		[isOpen, setIsOpen] = useState(false),
		[isOpen2, setIsOpen2] = useState(false),
		[submit, setSubmit] = useState(false),
		toggle = () => {
			setIsOpen(!isOpen);
		},
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
		if (submit && feedbacks?.isUpdated) {
			toggle();
			setSubmit(false);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [feedbacks?.isDeleted, feedbacks?.isUpdated, submit]);

	if (loading) return <Loader />;

	if (!stateUser) return <></>;
	let star = ["", "", "", "", ""];

	return (
		<Container className="px-lg-5">
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
							className="rounded-circle img-fluid mx-auto"
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
						</Card>
					))}
				</div>
			)}
		</Container>
	);
};

export default UserSearch;
