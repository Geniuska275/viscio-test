import React, { useEffect, useState } from "react";
import "../../Styles/AuthStyles.css";
import { useParams } from "react-router-dom";
import { useContext } from "react";
import { GlobalState } from "../../Data/Context";

export let colors = [
	"#E93BED",
	"#0BCE83",
	"#001B87",
	"#010e44",
	"hsla(157, 90%, 43%, 0.203)",
];

const OrderBar = ({ setActive, type, css }) => {
	const { auth, numberWithCommas, orders } = useContext(GlobalState);
	let [stateOrder, setStateOrder] = useState(null),
		params = useParams(),
		orderbarType = [
			{
				name: "Total Customers",
				number: numberWithCommas(auth?.all_customers?.length),
				display: "customers",
				url: "/users",
			},
			{
				name: "Logistics operators",
				number: numberWithCommas(auth?.all_vendors?.length),
				display: "Logistics operators",
				url: "/logistics",
			},
			{
				name: "Total Riders",
				number: numberWithCommas(auth?.all_users?.length),
				display: "riders",
				url: "/riders",
			},
		],
		orderbarType2 = [
			{
				name: "pending order",
				number: numberWithCommas(
					orders?.total_bids?.filter(item => item?.status === "pending")?.length
				),
			},
			{
				name: "pickup order",
				number: numberWithCommas(
					orders?.total_bids?.filter(item => item?.status === "picked")?.length
				),
			},
			{
				name: "completed order",
				number: numberWithCommas(
					orders?.total_bids?.filter(item => item?.status === "completed")
						?.length
				),
			},
		];

	useEffect(() => {
		if (params.page)
			params.page !== "orders"
				? setStateOrder(type ? type : orderbarType)
				: setStateOrder(orderbarType2);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [
		auth?.all_vendors,
		params.page,
		orders?.order,
		orders?.bids,
		auth?.all_users,
		auth?.all_customers,
	]);

	if (!stateOrder) return <></>;

	return (
		<div className={`${css ? css : ""} orderbarType`}>
			{stateOrder.map((item, index) => (
				<div
					onClick={setActive ? () => setActive(index) : () => {}}
					className="shadow p-2 py-4 text-center rounded myCursor"
					key={index}>
					<p
						className="mb-3 fw-600 text5"
						style={{
							color: colors[index],
						}}>
						{item.number}
					</p>
					<p className="text-capitalize">{item.name}</p>
				</div>
			))}
		</div>
	);
};

export default OrderBar;
