import React, { useEffect, useState, useContext, Fragment } from "react";
import { Container } from "reactstrap";
import { GlobalState } from "../../../Data/Context";
import { useParams } from "react-router-dom";
import { EmptyComponent } from "../../../Utils";
import { BsPlusCircleFill } from "react-icons/bs";
import { colors } from "../../../Components/Orders/OrderBar";
import { ViewComponents } from "../../../Components/Orders/OrderList";

const OperatorBids = () => {
	const { orders } = useContext(GlobalState);
	let [stateBid, setStateBids] = useState(null),
		params = useParams();

	useEffect(() => {
		let filterOut = orders?.total_orders?.filter(
			item => item?.user === params?.step
		);
		setStateBids(filterOut);
	}, [orders?.total_orders, params.step]);

	if (!stateBid) return;

	return <BidTable stateBid={stateBid} />;
};

export default OperatorBids;

export const BidTable = ({ stateBid }) => {
	const { numberWithCommas, nairaSign } = useContext(GlobalState);

	let [orderToAccept, setOrderToAccept] = useState(null),
		[isOpen, setIsOpen] = useState(false),
		[isOpen2, setIsOpen2] = useState(false),
		toggle2 = () => {
			setIsOpen2(!isOpen2);
			setOrderToAccept(null);
		},
		toggle = () => {
			setIsOpen(!isOpen);
		},
		textChange =
			name =>
			({ target: { value } }) => {};
	if (!stateBid) return;
	return (
		<Container className="px-lg-5 pt-3 pt-lg-0">
			<div className="">
				<p className="text3 textColor2 fw-600 text-capitalize">user's trips</p>
			</div>

			<div className="">
				{stateBid?.length === 0 ? (
					<EmptyComponent subtitle={"Your bid list is empty"} />
				) : (
					<table className="table mt-5">
						<thead className="">
							<tr className="thead orderGrid bg-select-2 orderGridNew orderGrid2 trFull py-2">
								<th className="text-white fw-normal">tracking ID</th>
								<th className="d-none d-md-flex text-white fw-normal">
									fare price
								</th>
								<th className="text-white fw-normal">Insured</th>
								<th className="text-white fw-normal">Status</th>
							</tr>
						</thead>
						<thead className="mustSeperate" />
						<tbody>
							{stateBid?.map((item, index) => (
								<Fragment key={index}>
									<tr
										className="shadow rounded tr myCursor orderGrid orderGridNew orderGrid2 trFull py-2 textColor2"
										onClick={() => {
											setOrderToAccept(item);
											setIsOpen2(true);
										}}>
										<td className="">
											{item?.items?.length > 1 && (
												<BsPlusCircleFill className="text-success" />
											)}{" "}
											{item?.orderId}
										</td>
										<td className="text-capitalize d-none d-md-flex">
											{item?.bid?.price && nairaSign}
											{item?.bid?.price && numberWithCommas(item?.bid?.price)}
										</td>
										<td className="text-capitalize textTrunc textTrunc4">
											{item?.items?.[0]?.insured ? "Yes" : "No"}
										</td>
										<td className="text-capitalize">
											<button
												className="btn text-capitalize text-white"
												style={{
													background: `${
														item?.bid?.status === "completed"
															? colors[2]
															: item?.bid?.status === "accepted"
															? colors[1]
															: item?.bid?.status === "picked"
															? colors[3]
															: colors[0]
													}`,
												}}>
												{item?.bid?.status ? item?.bid?.status : "created"}
											</button>
										</td>
									</tr>
									<tr className="mustSeperate" />
								</Fragment>
							))}
						</tbody>
					</table>
				)}
			</div>
			<ViewComponents
				toggle={toggle}
				toggle2={toggle2}
				isOpen={isOpen}
				isOpen2={isOpen2}
				textChange={textChange}
				active={0}
				orderToAccept={orderToAccept}
			/>
		</Container>
	);
};
