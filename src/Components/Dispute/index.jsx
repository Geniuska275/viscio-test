import React, { useContext, useState, useEffect } from "react";
import { BiArrowBack, BiArrowFromLeft, BiLink } from "react-icons/bi";
import { RiSendPlaneFill } from "react-icons/ri";
import { Container } from "reactstrap";
import user from "../../Assets/avatar3.png";
import "../../Styles/AuthStyles.css";
import moment from "moment";
import { GlobalState } from "../../Data/Context";
import axios from "axios";
import { toast } from "react-toastify";
import { MoonLoader } from "react-spinners";
import { Buttons } from "../../Utils";
import $ from "jquery";
import { Link, useParams, useNavigate } from "react-router-dom";
import { FaCircle } from "react-icons/fa";
import logo from "../../Assets/logo.png";
import LoadMore from "../LoadMore";

export const LeftSide = ({ stateChatsUser, css }) => {
	const { chats } = useContext(GlobalState);

	let [chatList, setChatList] = useState(null);

	useEffect(() => {
		if (stateChatsUser) {
			let data = [];

			for (let i = 0; i < stateChatsUser.length; i++) {
				if (data?.length === 0) data.push(stateChatsUser[i]);
				else {
					let findIt = data?.find(
						item => item?.chat?._id === stateChatsUser?.[i]?.chat?._id
					);
					if (findIt) {
						// data = data?.map(item =>
						// 	item?.chat?._id === stateChatsUser?.[i]?.chat?._id
						// 		? stateChatsUser[i]
						// 		: item
						// );
					} else data?.push(stateChatsUser[i]);
				}
			}

			setChatList(data);
		}
	}, [stateChatsUser]);

	// console.log({ stateChatsUser, chatList });

	return (
		<>
			<div className={`${css} m-0 mb-lg-auto`}>
				<button className="btn btn-primary1 text-capitalize py-3 w-100 d-block mx-auto mb-4 d-flex justify-content-between align-items-center">
					<span>View latest message</span>
					<BiArrowFromLeft size={20} />
				</button>
				<div className="chatWidth">
					{/* <div>
						<input
							type="search"
							name="search"
							placeholder="Search for user"
							className="form-control"
						/>
					</div> */}
					{chats?.isLoading ? (
						<div className="d-flex justify-content-center align-items-center mt-4">
							<MoonLoader className="textColor2" size={24} />
						</div>
					) : (
						<div>
							{chatList
								?.sort(
									(itA, itB) =>
										moment(itB?.chat?.updatedAt) - moment(itA?.chat?.updatedAt)
								)
								?.map((item, index) => (
									<div className="myCursor" key={index}>
										<Link
											to={`/dispute/${item?.chat?._id}`}
											className="border p-2 list-group-item-light rounded my-3 d-flex align-items-center text-decoration-none">
											<div className="me-1">
												<img
													src={
														item?.owner?.avatar?.url
															? item?.owner?.avatar?.url
															: user
													}
													alt={"User"}
													style={{
														height: "2.2rem",
														width: "2.5rem",
													}}
													className="rounded-circle img-fluid"
												/>
											</div>
											<div className="w-100">
												<div className="d-flex justify-content-between align-items-center my-auto">
													<h6 className="textColor2 texTrunc fw-600">
														{item?.owner?.firstName} {item?.owner?.lastName}
													</h6>

													<small>
														{moment(item?.updatedAt).format("hh:mm A")}
													</small>
												</div>
												<div className="d-flex justify-content-between align-items-center my-0">
													<small className="textTrunc m-0 text-muted">
														{item?.message}
													</small>
													{item?.newMessageCount > 0 && (
														<small className="list-group-item-success rounded-pill px-1 my-0">
															{item?.newMessageCount}
														</small>
													)}
												</div>
											</div>
										</Link>
									</div>
								))}
						</div>
					)}
				</div>
			</div>
		</>
	);
};

export const RightSide = ({ stateChatsUser }) => {
	const {
			chats,
			updateChats,
			dispute,
			updateDispute,
			socketList,
			auth,
			orders,
			updateOrderTypes,
		} = useContext(GlobalState),
		[chatsUser, setChatsUser] = useState(null),
		[mainUser, setMainUser] = useState(null),
		[mainChats, setMainChats] = useState(null),
		[loadChat, setLoadChat] = useState(false),
		[loading, setLoading] = useState(false),
		[loadingType, setLoadingType] = useState(""),
		[mainChatsPaginate, setMainChatsPaginate] = useState(null),
		[loading2, setLoading2] = useState(false),
		[message, setMessage] = useState(""),
		[file, setFile] = useState(false),
		[chatDispute, setChatDispute] = useState(null),
		[mainBids, setMainBids] = useState(null),
		params = useParams(),
		navigate = useNavigate();

	useEffect(() => {
		if (stateChatsUser) {
			stateChatsUser?.map(
				item => item?.chat?._id === params?.id && setChatsUser(item)
			);
		}
	}, [params.id, stateChatsUser]);

	useEffect(() => {
		if (chatsUser) {
			// console.log({ chatsUser });
			setMainUser(chatsUser?.owner);
		}
	}, [chatsUser]);

	useEffect(() => {
		if (params?.id && orders?.total_bids) {
			let mainOrders = orders?.total_bids?.filter(
				item => item?.chat?._id === params?.id
			);
			setMainBids(mainOrders[0]);
		}
	}, [params?.id, orders?.total_bids]);

	// console.log({ chatsUser, mainUser });

	useEffect(() => {
		dispute?.total_dispute?.map(
			item => item?.chat?._id === params?.id && setChatDispute(item)
		);
		$("#div1").animate({ scrollTop: $("#div1").prop("scrollHeight") }, 1000);
	}, [dispute?.total_dispute, params?.id]);

	let getChats = async (load, data) => {
		if (!load && !data?.limit) setLoadChat(true);
		try {
			let res = await axios.get(
				`/chat/${params?.id}/message?populate=sender${
					data?.limit ? `&limit=${data?.limit}` : ""
				}`
			);
			// console.log({ res: res?.data });
			setMainChats(res?.data?.data?.docs);
			setMainChatsPaginate({ ...res?.data?.data, docs: null });
			setLoadChat(false);
			if (!load)
				$("#div1").animate(
					{ scrollTop: $("#div1").prop("scrollHeight") },
					1000
				);
		} catch (err) {
			console.log({ error: err.response });
			// window.location.reload(false);
			toast.error(err?.response ? err?.response?.data?.message : err?.message);
			setLoadChat(false);
		}
		setLoadChat(false);
	};

	useEffect(() => {
		if (params?.id) {
			getChats();
		}

		return () => {
			setMainChats(null);
			setMainChatsPaginate(null);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [params.id]);
	// console.log({ mainChatsPaginate });

	let handleLoadMore = async () => {
		setLoading2(true);
		await getChats("load", {
			limit: Number(mainChatsPaginate?.nextPage * mainChatsPaginate?.limit),
		});
		setLoading2(false);
	};
	// console.log({ mainBids });
	let handleSubmit = action => async e => {
		e.preventDefault();
		// setSubmit2(false);
		setLoadingType(action);
		setLoading(true);

		let thisBid = mainBids;

		if (action === "accept") {
			thisBid = mainBids?._id;
		} else if (action === "cancel") {
			thisBid = mainBids?.order?._id;
		} else if (action !== "accept") {
			if (!thisBid) thisBid = mainBids?._id;
			else thisBid = thisBid?._id ? thisBid?._id : thisBid;
		}
		if (!thisBid) return;
		console.log({ thisBid, action, mainBids });
		await updateOrderTypes(
			thisBid,
			action === "delivered" ? "update" : action,
			{
				status: action === "delivered" ? "delivered" : "picked",
			}
		);
		setLoading(false);
		setLoadingType("");
		// setSubmit2(true);
		$("#div1").animate({ scrollTop: $("#div1").prop("scrollHeight") }, 1000);
	};

	useEffect(() => {
		if (file) handleSendFile();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [file]);

	useEffect(() => {
		if (chats?.newChat?.chat === params?.id) {
			let newChat = [];
			if (mainChats) {
				let findOne = mainChats?.find(
					item => item?._id === chats?.newChat?._id
				);
				if (findOne) {
					newChat = [...mainChats];
				} else {
					newChat = [...mainChats, chats?.newChat];
				}
			} else {
				newChat = [chats?.newChat];
			}
			setMainChats(newChat);

			setFile(false);
			setLoadingType("");
			setMessage("");
			$("#div1").animate({ scrollTop: $("#div1").prop("scrollHeight") }, 1000);
			getChats(null, {
				limit: Number(mainChatsPaginate?.limit),
			});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [chats?.isAdded, chats?.newChat, params?.id]);

	if (!stateChatsUser || !mainUser || !chatsUser) return;
	// console.log({ stateChatsUser });

	// console.log({ mainBids });
	let handleSendMessage = async e => {
		e.preventDefault();
		if (!message) return;
		console.log({ message });
		setLoading(true);
		setLoadingType("message");
		await updateChats({ content: message, chatId: params?.id });
		setLoading(false);
		setLoadingType("");
	};

	let handleSendFile = async () => {
		if (!file) return;
		console.log({ file });
		setLoading(true);
		setLoadingType("file");
		for (let j = 0; j < file?.length; j++) {
			await updateChats(
				{ type: "file", file: file?.[j], chatId: params?.id },
				"file"
			);
		}
		setLoading(false);
		setLoadingType("");
	};

	let handleChangeImage = e => {
		const files = [...e.target.files];
		let err = "",
			newImages = [];

		files.forEach(file => {
			if (!file) return (err = "File does not exist");
			if (!file.type.includes("image"))
				return (err = `File, ${file?.name} format not supported`);
			return newImages.push(file);
		});
		if (err) {
			return toast.error(err);
		} else {
			setFile(file ? [...file, ...newImages] : [...newImages]);
		}
	};

	let handleDispute = path => async e => {
		e.preventDefault();
		setLoading(true);
		setLoadingType("dispute");
		await updateDispute({ dispute: chatDispute?._id }, path);
		setLoading(false);
		setLoadingType("");
	};

	return (
		<>
			<div className="col-lg-8 rounded border bg-notify p-0 minFullHeight aboutScreen position-relative m-0 m-lg-auto">
				{mainUser && (
					<div className="bg-select-2 p-3 rounded text-white d-flex align-items-center justify-content-between">
						<div className="d-flex align-items-center">
							<BiArrowBack
								className="me-lg-3 me-1 myCursor d-lg-none"
								onClick={() => navigate(-1)}
							/>
							<Link
								to={`/user/${mainUser?._id}`}
								className="text-decoration-none text-white">
								<div className="d-flex align-items-center">
									<div className="position-relative">
										<img
											src={mainUser?.avatar?.url ? mainUser?.avatar?.url : user}
											alt={"User"}
											style={{
												height: "3.5rem",
												width: "3.5rem",
											}}
											className="rounded-circle img-fluid mx-3"
										/>
										{socketList?.find(
											item => item?.userId === mainUser?._id && item?.isOnline
										) ? (
											<FaCircle
												className="text-success-2 position-absolute"
												style={{ bottom: 0, right: "10px" }}
											/>
										) : null}
									</div>
									<div>
										<h6 className="m-0 fontReduce">
											{mainUser
												? `${mainUser?.firstName} ${mainUser?.lastName}`
												: "Viscio"}
										</h6>
										{socketList?.find(
											item => item?.userId === mainUser?._id && item?.isOnline
										) ? (
											<span className="fontReduce">online</span>
										) : null}
									</div>
								</div>
							</Link>
						</div>
						{mainChats && chatDispute?.status !== "resolved" && (
							<div>
								<Buttons
									loading={loadingType === "dispute" && loading}
									title={"resolve"}
									css={
										"btn-outline-white text-capitalize text-white fontReduce"
									}
									onClick={handleDispute("update")}
								/>
							</div>
						)}
					</div>
				)}
				<div className="chatScreen pb-2" id="div1">
					{mainChats && (
						<Container className="">
							{loadChat ? (
								<div className="my-3 d-flex">
									<MoonLoader className="textColor2 mx-auto" size={24} />
								</div>
							) : (
								<>
									<LoadMore
										next={mainChatsPaginate?.hasNextPage}
										handleLoadMore={handleLoadMore}
										loading={loading2}
									/>
									{mainChats
										?.filter(e => e)
										?.sort(
											(itA, itB) =>
												moment(itA?.createdAt) - moment(itB?.createdAt)
										)
										?.map((item, index) => (
											<div className="d-flex my-1" key={index}>
												<div
													className={`w-75 p-3 rounded ${
														item?.sender?.isAdmin
															? "ms-auto bg-white"
															: "me-auto bg-light"
													}`}>
													{item?.type === "file" ? (
														<ChatImage
															data={item?.content}
															bg={
																item?.sender?.isAdmin ? "bg-white" : "bg-light"
															}
														/>
													) : (
														<p className="textColor2 m-0">{item?.content}</p>
													)}
													<div className="d-flex">
														{item?.sender?._id !== auth?.user?._id && (
															<small className="textTrunc">
																{item?.sender?.firstName}{" "}
																{item?.sender?.lastName}{" "}
																{item?.sender?.isAdmin ? `(Admin)` : ""}
															</small>
														)}
														<small className="ms-auto">
															{moment(item?.createdAt).diff(moment(), "years") <
															0
																? moment(item?.createdAt).format(
																		"Do MMM, YYYY hh:mm A"
																  )
																: moment(item?.createdAt).diff(
																		moment(),
																		"months"
																  ) < 0
																? moment(item?.createdAt).format(
																		"Do MMM hh:mm A"
																  )
																: moment(item?.createdAt).diff(
																		moment(),
																		"days"
																  ) < 0
																? moment(item?.createdAt).format(
																		"Do MMM hh:mm A"
																  )
																: moment(item?.createdAt).format("hh:mm A")}
														</small>
													</div>
												</div>
											</div>
										))}
									<div className="d-flex pt-3">
										<div className="row g-4 w-75 fullWidth">
											{mainBids?.status !== "completed" ? (
												<>
													<Buttons
														loading={loadingType === "cancel" && loading}
														title={"cancel-order"}
														loadCss={"textColor2 bg-select-2 "}
														css={`
															${auth?.user?.type === "user"
																? "bg-white"
																: "btn-light"} text-capitalize mx-1 fontBtn text-muted col-3 fontReduce
														`}
														width={"col-3"}
														onClick={handleSubmit("cancel")}
													/>
													<Buttons
														loading={loadingType === "complete" && loading}
														title={"mark as received"}
														loadCss={"textColor2 bg-select-2 "}
														css={`
															${auth?.user?.type === "user"
																? "bg-white"
																: "btn-light"} text-capitalize mx-1 fontBtn text-muted col-3 fontReduce
														`}
														width={"col-3"}
														onClick={handleSubmit("complete")}
													/>
												</>
											) : null}
										</div>
									</div>
								</>
							)}
						</Container>
					)}
				</div>

				{mainChats && chatDispute?.status !== "resolved" && (
					<div className="sticky-bottom mainTabs  border-top w-100 py-3 d-flex justify-content-around align-items-center bg-light mainMaxWidth mt-auto d-flex flex-column">
						<div className="rounded py-1 w-100 mx-2 d-flex align-items-center px-3">
							<input
								type="text"
								className="form-control w-100 me-1 fontReduce bg-white fontReduce"
								value={message}
								onChange={e => setMessage(e.target.value)}
								placeholder="Type your message here"
								autoFocus
							/>
							<div className="d-flex align-items-center btn-group">
								<div className="file_upload d-flex myCursor btn">
									<Buttons
										loading={loadingType === "file" && loading}
										loadCss={"textColor2 bg-select-2 "}
										css="bg-light"
										title=" "
										width={"auto"}>
										<BiLink
											title="Upload image"
											className="textColor2"
											size={20}
										/>
									</Buttons>
									<input
										title="Upload file"
										type="file"
										name="file"
										id="file"
										multiple
										className="myCursor"
										accept="image/*"
										onChange={handleChangeImage}
									/>
								</div>
								<Buttons
									css="bg-light"
									title=" "
									width={"auto"}
									disabled={loadingType === "message" && loading}
									onClick={handleSendMessage}>
									<RiSendPlaneFill className="textColor2" size={20} />
								</Buttons>
							</div>
						</div>
					</div>
				)}
			</div>
		</>
	);
};

export const DefaultRight = () => {
	return (
		<div className="col-0 col-lg-8 rounded border bg-notify p-0 minFullHeight aboutScreen position-relative d-none d-lg-flex justify-content-center align-items-center m-0 m-lg-auto">
			<div
				className="d-flex justify-content-center 
                align-items-center flex-column h-100 m-auto">
				<img src={logo} alt="logo" className="img-fluid my-3" />
				<small className="d-block">
					Interact with your customer seamlessly
				</small>
			</div>
		</div>
	);
};

export let ChatImage = ({ data, bg }) => {
	let [err, setErr] = useState(false);

	let errorHandler = () => setErr(true);

	useEffect(() => {
		return () => setErr(false);
	}, [data]);

	return (
		<div className={`${bg ? bg : "bg-white"} h-100`}>
			{err ? (
				<div className="d-flex justify-content-center align-items-center h-100">
					<p className="fontReduce text-capitalize">could not load resources</p>
				</div>
			) : (
				<img
					alt="img"
					src={data}
					className="w-100 h-100"
					onError={errorHandler}
					loading="lazy"
					style={{
						maxHeight: "40vh",
						objectFit: "contain",
					}}
				/>
			)}
		</div>
	);
};
