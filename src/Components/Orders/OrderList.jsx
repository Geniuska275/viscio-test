import React, { Fragment, useContext, useEffect, useState } from "react";
import { colors } from "./OrderBar";
import "../../Styles/AuthStyles.css";
import { Buttons, EmptyComponent } from "../../Utils";
import { GlobalState } from "../../Data/Context";
import { BsPlusCircleFill } from "react-icons/bs";
import { ModalComponents } from "../DefaultHeader";
import moment from "moment";
import map from "../../Assets/Rectangle.png";
import LoadMore from "../LoadMore";
import { BiPhone } from "react-icons/bi";
import { HiOutlineMail } from "react-icons/hi";

const OrderList = ({ active }) => {
	const { orders, getBids, getOrders } = useContext(GlobalState),
		[stateOrders, setStateOrders] = useState(null),
		[orderToAccept, setOrderToAccept] = useState(null),
		[isOpen, setIsOpen] = useState(false),
		[isOpen2, setIsOpen2] = useState(false),
		[loading, setLoading] = useState(false),
		toggle = () => {
			setIsOpen(!isOpen);
		},
		toggle2 = () => {
			setIsOpen2(!isOpen2);
			setOrderToAccept(null);
		},
		textChange =
			name =>
			({ target: { value } }) => {};

	let handleLoadMore = async () => {
		setLoading(true);
		if (active !== 0) {
			await getBids({
				limit: Number(
					orders?.properties_bid?.nextPage * orders?.properties_bid?.limit
				),
			});
		} else
			await getOrders({
				limit: Number(orders?.properties?.nextPage * orders?.properties?.limit),
			});
		setLoading(false);
	};

	useEffect(() => {
		if (active === 2) {
			setStateOrders(orders.bids?.filter(item => item?.status === "completed"));
		} else if (active === 1) {
			setStateOrders(orders.bids?.filter(item => item?.status === "picked"));
		} else {
			setStateOrders(orders.order);
		}
	}, [orders.order, active, orders.bids]);

	// useEffect(() => {
	// 	if (orderToAccept) setIsOpen(true);
	// }, [orderToAccept]);

	if (!stateOrders) return;
	// console.log({ stateOrders, active });

	return (
		<div className="">
			{stateOrders?.length === 0 ? (
				<EmptyComponent />
			) : (
				<table className="table mt-5">
					<thead className="">
						<tr className="thead orderGrid orderGrid3 bg-select-2 orderGridNew trFull py-2">
							<th className="text-white fw-normal">Pickup Address</th>
							<th className="text-white fw-normal">Drop Off Address</th>
							<th className="text-white fw-normal d-none d-md-flex ">
								tracking ID
							</th>
							<th className="d-none d-md-flex text-white fw-normal">
								{active === 0 ? "Deliver type" : "price"}
							</th>
							<th className="text-white fw-normal">Date</th>
							<th className="text-white fw-normal">Status</th>
						</tr>
					</thead>
					<thead className="mustSeperate" />
					<tbody>
						{stateOrders?.map((item, index) => (
							<Fragment key={index}>
								<tr
									className="shadow rounded tr myCursor orderGrid orderGridNew orderGrid3 trFull py-2"
									onClick={() => {
										setOrderToAccept(item);
										setIsOpen2(true);
									}}>
									<td className="text-capitalize textTrunc textTrunc4">
										{active !== 0
											? item?.order?.items?.[0]?.pickupLocation
											: item?.items?.[0]?.pickupLocation}
									</td>
									<td className="text-capitalize textTrunc textTrunc4">
										{active !== 0
											? item?.order?.items?.length > 1 && (
													<BsPlusCircleFill className="text-success" />
											  )
											: item?.items?.length > 1 && (
													<BsPlusCircleFill className="text-success" />
											  )}{" "}
										{active !== 0
											? item?.order?.items?.[0]?.dropoffLocation
											: item?.items?.[0]?.dropoffLocation}
									</td>
									<td className="d-none d-md-flex">
										{active !== 0 ? item?.order?.orderId : item?.orderId}
									</td>
									<td className="text-capitalize d-none d-md-flex">
										{active === 0
											? item?.items?.[0]?.deliveryMode
											: item?.price}
									</td>
									<td>
										{active !== 0
											? moment(item?.order?.createdAt).format("DD MMM, YYYY")
											: moment(item?.createdAt).format("DD MMM, YYYY")}
									</td>
									<td className="text-capitalize">
										<button
											className="btn text-capitalize text-white"
											style={{
												background: `${
													active !== 0
														? item?.status === "completed"
															? colors[2]
															: item?.status === "accepted"
															? colors[1]
															: item?.status === "picked"
															? colors[3]
															: colors[0]
														: item?.bid?.status === "completed"
														? colors[2]
														: item?.bid?.status === "accepted"
														? colors[1]
														: item?.bid?.status === "picked"
														? colors[3]
														: colors[0]
												}`,
											}}>
											{active !== 0
												? item?.status
												: item?.bid?.status
												? item?.bid?.status
												: "created"}
										</button>
									</td>
								</tr>
								<tr className="mustSeperate" />
							</Fragment>
						))}
					</tbody>
				</table>
			)}
			<LoadMore
				next={
					active !== 0
						? orders?.properties_bid?.hasNextPage
						: orders?.properties?.hasNextPage
				}
				handleLoadMore={handleLoadMore}
				loading={loading}
			/>
			<ViewComponents
				toggle={toggle}
				toggle2={toggle2}
				isOpen={isOpen}
				isOpen2={isOpen2}
				textChange={textChange}
				active={active}
				orderToAccept={orderToAccept}
			/>
		</div>
	);
};

export default OrderList;

export const OrderStatus = ({ toggle, data, isOpen }) => {
	let [active, setActive] = useState(0),
		[err, setErr] = useState(false),
		[subActive, setSubActive] = useState(false);

	let orderMap = [
		{
			title: "order received",
			date: moment(),
		},
		{
			title: "on the way",
			date: moment(),
		},
		{
			title: "delivered",
			date: moment(),
		},
	];
	// console.log({ data });

	useEffect(() => {
		if (data?.bid) {
			setSubActive(true);
			data?.bid?.status === "accepted"
				? setActive(1)
				: data?.bid?.status === "picked"
				? setActive(2)
				: data?.bid?.status === "completed"
				? setActive(3)
				: setActive(0);
		} else {
			setSubActive(false);
			data?.status === "accepted"
				? setActive(1)
				: data?.status === "picked"
				? setActive(2)
				: data?.status === "completed"
				? setActive(3)
				: setActive(0);
		}
	}, [data?.bid, data]);

	return (
		<ModalComponents
			title={"order status"}
			toggle={toggle}
			isOpen={isOpen}
			notHeader={true}
			size="lg">
			<div className="row g-4 downH3">
				<div className="col-5 m-auto">
					<div className="ps-5">
						<h3 className="text-capitalize textColor2 mb-0">order status</h3>
						<div
							className="bg-select-2 rounded-pill mb-3"
							style={{
								height: "3px",
								width: "6rem",
							}}
						/>
					</div>
					<div className="d-flex align-items-center flex-column">
						{active === 0 ? (
							<p>Order await bidding/acceptance</p>
						) : (
							<div className="borderLeft w-75">
								{orderMap.map((item, index) => (
									<div className="position-relative py-2 ps-5" key={index}>
										<div
											className={`position-absolute startTransition ${
												active > index ? "startTransition2" : ""
											}`}
										/>
										<div>
											<h5
												className={`${
													active > index ? "textColor2" : "text-muted"
												} text-capitalize`}>
												{item?.title}
											</h5>
											{/* {index !== orderMap.length - 1 && (
												<p className="textColor2">
													{moment().format("DD MMM YYYY, hh:mm A")}
												</p>
											)} */}
										</div>
									</div>
								))}
							</div>
						)}
						<button
							onClick={toggle}
							className="btn btn-primary1 text-capitalize py-3 w-75 d-block mx-auto mt-4">
							close
						</button>
						<a
							href={`https://www.google.com/maps/dir/?api=1&origin=${
								!subActive
									? data?.order?.items[0]?.pickupLocation
									: data?.items?.[0]?.pickupLocation
							}&destination=${
								!subActive
									? data?.order?.items[0]?.dropoffLocation
									: data?.items?.[0]?.dropoffLocation
							}&destination_place_id=:${
								!subActive
									? data?.order?.items[0]?.dropoffLocation
									: data?.items?.[0]?.dropoffLocation
							}`}
							className="btn btn-primary1 text-capitalize py-3 w-75 d-block mx-auto mt-4 text-decoration-none text-white"
							target={"_blank"}
							rel="noreferrer">
							view map
						</a>
					</div>
				</div>
				<div
					className="col-7 backgroundMap p-0"
					style={{ background: `url(${map})` }}>
					{!err && (
						<iframe
							src={`https://www.google.com/maps/dir/?api=1&origin=${
								!subActive
									? data?.order?.items[0]?.pickupLocation
									: data?.items?.[0]?.pickupLocation
							}&destination=${
								!subActive
									? data?.order?.items[0]?.dropoffLocation
									: data?.items?.[0]?.dropoffLocation
							}&destination_place_id=:${
								!subActive
									? data?.order?.items[0]?.dropoffLocation
									: data?.items?.[0]?.dropoffLocation
							}`}
							className="h-100 w-100"
							onError={() => setErr(true)}
							title={
								!subActive
									? data?.order?.items[0]?.pickupLocation
									: data?.items?.[0]?.pickupLocation
							}
						/>
					)}
				</div>
			</div>
		</ModalComponents>
	);
};

const ViewOrderFormModal = ({ stateData, textChange, toggle, active }) => {
	let { updateOrderTypes } = useContext(GlobalState);
	let [subActive, setSubActive] = useState(0),
		[loading, setLoading] = useState(false);
	// console.log({ stateData });
	let handleSubmit = action => async e => {
		e.preventDefault();
		setLoading(true);

		await updateOrderTypes(stateData?._id, action);
		setLoading(false);
	};

	let noFactor = ["completed", "cancel", "rejected"];

	return (
		<>
			<ViewOrderForm
				textChange={textChange}
				stateData={stateData}
				subActive={subActive}
				active={active}
			/>
			{stateData?.items?.length > 1 && (
				<div className="d-flex align-items-center">
					<span>
						{subActive + 1}/{stateData?.items.length} items
					</span>
					<button
						className="btn btn-outline-primary1 text-capitalize ms-auto d-block"
						onClick={() =>
							setSubActive(
								stateData?.items?.length - 1 === subActive ? 0 : ++subActive
							)
						}>
						next
					</button>
				</div>
			)}
			{stateData?.bid && !noFactor?.includes(stateData?.bid?.status) && (
				<Buttons
					loading={loading}
					title={"mark as received"}
					css={
						"btn btn-primary1 text-capitalize py-3 w-50 d-block mx-auto my-4"
					}
					width={"w-50"}
					onClick={handleSubmit("complete")}
				/>
			)}
			<Buttons
				onClick={toggle}
				css="btn btn-primary1 text-capitalize py-3 w-50 d-block mx-auto my-4"
				title={"view order status"}
				width="w-50"
			/>
			{active === 0 ? (
				<UserData stateData={stateData?.user} />
			) : (
				<UserData stateData={stateData?.order?.user} />
			)}
			{active === 0 ? (
				stateData?.bid && (
					<UserData stateData={stateData?.bid?.vendor} user="Vendor" />
				)
			) : (
				<UserData stateData={stateData?.vendor} user="Vendor" />
			)}
		</>
	);
};

let UserData = ({ stateData, user = "User" }) => {
	return (
		<>
			<div className="mb-4 border-bottom">
				<h5 className="text-capitalize">{user} detail</h5>
				<p className="text-center d-flex align-items-center justify-content-between">
					<span>Name: </span>
					<strong>
						{stateData?.firstName} {stateData?.lastName}
					</strong>
				</p>
				<p className="text-center d-flex align-items-center justify-content-between">
					<span>Email: </span>
					<strong>
						{stateData?.email}
						{stateData?.email && (
							<a href={`mailto:${stateData?.email}`}>
								<HiOutlineMail className="textColor2" size={24} />
								{"	 "}
							</a>
						)}
					</strong>
				</p>
				<p className="text-center d-flex align-items-center justify-content-between">
					<span>Telephone: </span>
					<strong>
						{stateData?.phone}
						{stateData?.phone && (
							<a href={`tel:${stateData?.phone}`}>
								<BiPhone className="textColor2" size={24} />
								{"	 "}
							</a>
						)}
					</strong>
				</p>
			</div>
		</>
	);
};

const ViewOrderForm = ({ textChange, stateData, subActive, active }) => {
	return (
		<form>
			<div className="form-floating mb-3">
				<input
					type="text"
					required
					name="fullname"
					className="form-control bg-grey"
					placeholder="Pick up full name"
					value={
						active === 0
							? stateData?.items?.[subActive]?.pickupName
							: stateData?.order?.items?.[subActive]?.pickupName
					}
					readOnly
					onChange={textChange("pickupName")}
				/>
				<label htmlFor="fullname">Pick up full name</label>
				<small className="mb-4 d-block">
					Name of the person we are picking item from{" "}
				</small>
			</div>
			<div className="form-floating mb-3">
				<input
					type="text"
					required
					name="address"
					className="form-control bg-grey"
					placeholder="Pick up address"
					value={
						active === 0
							? stateData?.items?.[subActive]?.pickupLocation
							: stateData?.order?.items?.[subActive]?.pickupLocation
					}
					readOnly
					onChange={textChange("pickupLocation")}
				/>
				<label htmlFor="fullname">Pick up address</label>
				<small className="mb-4 d-block">Kindly give detailed adress </small>
			</div>
			<div className="form-floating mb-3">
				<input
					type="tel"
					required
					name="telephone"
					className="form-control bg-grey"
					placeholder="Pick up telephone"
					value={
						active === 0
							? stateData?.items?.[subActive]?.pickupPhone
							: stateData?.order?.items?.[subActive]?.pickupPhone
					}
					readOnly
					onChange={textChange("pickupPhone")}
				/>
				<label htmlFor="fullname">Pick up phone number</label>
				<small className="mb-4 d-block">
					Provide phone number and other line{" "}
				</small>
			</div>
			<div className="form-floating mb-3">
				<input
					type="text"
					required
					name="item"
					className="form-control bg-grey"
					placeholder="Pick up item"
					value={
						active === 0
							? stateData?.items?.[subActive]?.pickupItem
							: stateData?.order?.items?.[subActive]?.pickupItem
					}
					readOnly
					onChange={textChange("pickupItem")}
				/>
				<label htmlFor="fullname">Pick up item</label>
			</div>

			<p>Delivery Mode</p>
			<div className="row mb-4">
				<div className="col-3">
					<input
						type="radio"
						name="deliveryMode"
						className="form-check-input me-2 borderColor"
						title="bicycle"
						id="Bicycle"
						value={
							active === 0
								? stateData?.items?.[subActive]?.deliveryMode
								: stateData?.order?.items?.[subActive]?.deliveryMode
						}
						readOnly
						onChange={textChange("deliveryMode")}
						checked={
							active === 0
								? stateData?.items?.[subActive]?.deliveryMode === "bicycle"
								: stateData?.order?.items?.[subActive]?.deliveryMode ===
								  "bicycle"
						}
					/>
					<label htmlFor="Bicycle"> Bicycle</label>
				</div>
				<div className="col-3">
					<input
						type="radio"
						name="deliveryMode"
						className="form-check-input me-2 borderColor"
						title="bike"
						id="Bike"
						value={
							active === 0
								? stateData?.items?.[subActive]?.deliveryMode
								: stateData?.order?.items?.[subActive]?.deliveryMode
						}
						readOnly
						onChange={textChange("deliveryMode")}
						checked={
							active === 0
								? stateData?.items?.[subActive]?.deliveryMode === "bike"
								: stateData?.order?.items?.[subActive]?.deliveryMode === "bike"
						}
					/>
					<label htmlFor="Bike"> Bike</label>
				</div>
				<div className="col-3">
					<input
						type="radio"
						name="deliveryMode"
						className="form-check-input me-2 borderColor"
						title="car"
						id="Car"
						value={
							active === 0
								? stateData?.items?.[subActive]?.deliveryMode
								: stateData?.order?.items?.[subActive]?.deliveryMode
						}
						readOnly
						onChange={textChange("deliveryMode")}
						checked={
							active === 0
								? stateData?.items?.[subActive]?.deliveryMode === "car"
								: stateData?.order?.items?.[subActive]?.deliveryMode === "car"
						}
					/>
					<label htmlFor="Car"> Car</label>
				</div>
				<div className="col-3">
					<input
						type="radio"
						name="deliveryMode"
						className="form-check-input me-2 borderColor"
						title="truck"
						id="Truck"
						value={
							active === 0
								? stateData?.items?.[subActive]?.deliveryMode
								: stateData?.order?.items?.[subActive]?.deliveryMode
						}
						readOnly
						onChange={textChange("deliveryMode")}
						checked={
							active === 0
								? stateData?.items?.[subActive]?.deliveryMode === "truck"
								: stateData?.order?.items?.[subActive]?.deliveryMode === "truck"
						}
					/>
					<label htmlFor="Truck"> Truck</label>
				</div>
			</div>
			<div className="form-floating mb-3">
				<input
					type="text"
					required
					name="fullname"
					className="form-control bg-grey"
					placeholder="Drop off full name"
					value={
						active === 0
							? stateData?.items?.[subActive]?.dropoffName
							: stateData?.order?.items?.[subActive]?.dropoffName
					}
					readOnly
					onChange={textChange("dropoffName")}
				/>
				<label htmlFor="fullname">Drop off full name</label>
				<small className="mb-4 d-block">Receiver's name </small>
			</div>
			<div className="form-floating mb-3">
				<input
					type="text"
					required
					name="address"
					className="form-control bg-grey"
					placeholder="Drop off address"
					value={
						active === 0
							? stateData?.items?.[subActive]?.dropoffLocation
							: stateData?.order?.items?.[subActive]?.dropoffLocation
					}
					readOnly
					onChange={textChange("dropoffLocation")}
				/>
				<label htmlFor="fullname">Drop off address</label>
				<small className="mb-4 d-block">Receiver's address </small>
			</div>
			<div className="form-floating mb-3">
				<input
					type="tel"
					required
					name="telephone"
					className="form-control bg-grey"
					placeholder="Drop off telephone"
					value={
						active === 0
							? stateData?.items?.[subActive]?.dropoffPhone
							: stateData?.order?.items?.[subActive]?.dropoffPhone
					}
					readOnly
					onChange={textChange("dropoffPhone")}
				/>
				<label htmlFor="fullname">Drop off phone number</label>
				<small className="mb-4 d-block">
					Kindly provide main line and other line{" "}
				</small>
			</div>
			<p>Delivery Type</p>
			<div className="mb-4">
				<div className="">
					<input
						type="radio"
						name="deliveryType"
						readOnly
						className="form-check-input me-2 borderColor"
						value={
							active === 0
								? stateData?.items?.[subActive]?.deliveryType
								: stateData?.order?.items?.[subActive]?.deliveryType
						}
						onChange={textChange("deliveryType")}
						title="City (delivery within same state or city)"
						id="City (delivery within same state or city)"
						checked={
							active === 0
								? stateData?.items?.[subActive]?.deliveryType ===
								  "City (delivery within same state or city)"
								: stateData?.order?.items?.[subActive]?.deliveryType ===
								  "City (delivery within same state or city)"
						}
					/>
					<label htmlFor="City (delivery within same state or city)">
						{" "}
						City (delivery within same state or city)
					</label>
				</div>
				<div className="">
					<input
						type="radio"
						readOnly
						name="deliveryType"
						className="form-check-input me-2 borderColor"
						value={
							active === 0
								? stateData?.items?.[subActive]?.deliveryType
								: stateData?.order?.items?.[subActive]?.deliveryType
						}
						onChange={textChange("deliveryType")}
						title="Inter-State"
						id="Inter-State"
						checked={
							active === 0
								? stateData?.items?.[subActive]?.deliveryType === "Inter-State"
								: stateData?.order?.items?.[subActive]?.deliveryType ===
								  "Inter-State"
						}
					/>
					<label htmlFor="Inter-State"> Inter-State</label>
				</div>
				<div className="">
					<input
						type="radio"
						readOnly
						name="deliveryType"
						className="form-check-input me-2 borderColor"
						value={
							active === 0
								? stateData?.items?.[subActive]?.deliveryType
								: stateData?.order?.items?.[subActive]?.deliveryType
						}
						onChange={textChange("deliveryType")}
						title="Inter-Country"
						id="Inter-Country"
						checked={
							active === 0
								? stateData?.items?.[subActive]?.deliveryType ===
								  "Inter-Country"
								: stateData?.order?.items?.[subActive]?.deliveryType ===
								  "Inter-Country"
						}
					/>
					<label htmlFor="Inter-Country"> Inter-Country</label>
				</div>
			</div>
			<div className="form-floating mb-3">
				<input
					type="text"
					required
					name="itemWorth"
					className="form-control bg-grey"
					placeholder="Item value"
					value={
						active === 0
							? stateData?.items?.[subActive]?.itemWorth
							: stateData?.order?.items?.[subActive]?.itemWorth
					}
					readOnly
					onChange={textChange("itemWorth")}
				/>
				<label htmlFor="fullname">Item value</label>
			</div>
			<div className="form-floating mb-3">
				<input
					type="text"
					required
					name="itemWorth"
					className="form-control bg-grey"
					placeholder="Tracking ID"
					value={active === 0 ? stateData?.orderId : stateData?.order?.orderId}
					readOnly
					onChange={textChange("orderId")}
				/>
				<label htmlFor="fullname">Tracking ID</label>
			</div>
		</form>
	);
};

export const ViewComponents = ({
	toggle2,
	isOpen2,
	toggle,
	orderToAccept,
	textChange,
	active,
	isOpen,
}) => {
	return (
		<>
			<ModalComponents title={"view order"} back={toggle2} isOpen={isOpen2}>
				<ViewOrderFormModal
					toggle={toggle}
					stateData={orderToAccept}
					textChange={textChange}
					active={active}
				/>
			</ModalComponents>
			<OrderStatus isOpen={isOpen} toggle={toggle} data={orderToAccept} />
		</>
	);
};
