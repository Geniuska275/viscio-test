import React, { Fragment, useState, useEffect, useContext } from "react";
import { BiCar, BiPhone } from "react-icons/bi";
import { Link } from "react-router-dom";
import { Container } from "reactstrap";
import image from "../../Assets/avatar3.png";
import { LoadMore } from "../../Components";
import { MainNotify } from "../../Components/DefaultHeader";
import OrderBar from "../../Components/Orders/OrderBar";
import OrderList from "../../Components/Orders/OrderList";
import { GlobalState } from "../../Data/Context";
import { EmptyComponent, Loader } from "../../Utils";

const Users = () => {
	const {
		auth,
		numberWithCommas,
		getAllUser,
		orders,
		getUsersReload,
		referrals,
		notifySettings,
		getAllVendors,
	} = useContext(GlobalState);

	let [stateDetails, setStateDetails] = useState({
			customer: 0,
			vendors: 0,
			trips: 0,
			riders: 0,
		}),
		[isOpen, setIsOpen] = useState(false),
		[loading, setLoading] = useState(false),
		[search, setSearch] = useState(""),
		toggle = () => {
			setIsOpen(!isOpen);
		},
		[user, setUser] = useState(false),
		[loading2, setLoading2] = useState(false),
		[submit, setSubmit] = useState(false),
		init = {
			message: "",
			title: "",
			as: "notification",
			user: user?._id,
		},
		[state, setState] = useState(init),
		handleSubmit = async e => {
			e.preventDefault();
			setLoading2(true);
			await notifySettings({ ...state, userIds: [user?._id] });
			setLoading2(false);
			setSubmit(true);
		},
		textChange =
			name =>
			({ target: { value } }) => {
				setState({ ...state, [name]: value });
			};

	useEffect(() => {
		if (submit && referrals?.notify) {
			setSubmit(false);
			setIsOpen(false);
			setUser(null);
			setState(init);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [submit, referrals?.notify]);

	useEffect(() => {
		window.scrollTo(0, 0);
		setSearch("");
	}, []);

	let handleLoadMore = async () => {
		setLoading(true);
		if (search) {
			await getAllUser(
				{
					limit: Number(
						auth?.properties_search?.nextPage * auth?.properties_search?.limit
					),
				},
				search
			);
		} else {
			await getAllUser({
				limit: Number(auth?.properties?.nextPage * auth?.properties?.limit),
			});
		}
		setLoading(false);
	};
	let handleLoadMoreVendors = async () => {
		setLoading(true);
		await getAllVendors({
			limit: Number(
				auth?.properties_vendors?.nextPage * auth?.properties_vendors?.limit
			),
		});

		setLoading(false);
	};

	useEffect(() => {
		setStateDetails({
			customer: auth?.totalUsers,
			vendors: auth?.totalVendors,
			trips: orders?.properties?.totalDocs,
			riders: auth?.complete_user?.filter(item => item?.type === "rider")
				?.length,
		})
	}, [
		auth?.complete_user,
		orders?.properties?.totalDocs,
		auth?.totalUsers,
		auth?.totalVendors,
	])
	let orderbarType = [
		{
			name: "Total Customers",
			number: numberWithCommas(
				stateDetails?.customer ? stateDetails?.customer : auth?.totalUsers
			),
			display: "customers",
			url: "/users",
		},
		{
			name: "Logistics operators",
			number: numberWithCommas(
				stateDetails?.vendors ? stateDetails?.vendors : auth?.totalVendors
			),
			display: "Logistics operators",
			url: "/logistics",
		},
		{
			name: "Total trips",
			number: numberWithCommas(
				stateDetails?.trips ? stateDetails?.trips : orders?.order?.length
			),
			display: "trips",
			url: "/trips",
		},
		{
			name: "Total Riders",
			number: numberWithCommas(stateDetails?.riders),
			display: "riders",
			url: "/riders",
		},
	];
	let [active, setActive] = useState(0),
		[mainUsers, setMainUsers] = useState(null),
		[stateUsers, setStateUsers] = useState(null);

	useEffect(() => {
		if (auth?.isFound) setMainUsers(auth?.mainSearch);
		else setMainUsers(auth?.all_users);
	}, [auth]);

	useEffect(() => {
		if (active === 0) {
			setStateUsers(mainUsers?.filter(item => item?.type === "user"));
		} else if (active === 1) {
			setStateUsers(
				search
					? mainUsers?.filter(item => item?.type === "vendor")
					: auth?.all_vendors
			);
		} else if (active === 3) {
			setStateUsers(mainUsers?.filter(item => item?.type === "rider"));
		} else if (active === 2) {
			setStateUsers(orders?.order);
		}
	}, [auth, active, mainUsers, orders?.order, auth?.all_vendors, search]);

	useEffect(() => {
		if (search) {
			document.getElementById("Search").addEventListener("search", () => {
				getUsersReload();
			});
			let handleSubmit = async () => {
				if (!search) return;

				await getAllUser(null, search);
			};
			handleSubmit();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [search]);

	if (auth?.get_loading) return <Loader />;

	if (!stateUsers) return;
	// console.log({ active, orderbarType });

	return (
		<Container className="px-lg-5  pt-3 pt-lg-0">
			<div className="mb-4">
				<OrderBar
					setActive={setActive}
					type={orderbarType}
					css="orderbarTypeMain"
				/>
			</div>
			<div className="mb-3 d-flex justify-content-end">
				{active !== 2 && (
					<div className="w-50">
						<input
							type="search"
							name="search"
							id="Search"
							className="form-control w-100 py-3 borderColor2"
							placeholder="type here to search"
							value={search}
							onChange={e => setSearch(e.target.value)}
						/>
					</div>
				)}
			</div>
			<div className="my-3 bg-select-2 text-center text-capitalize py-3 text-white rounded fw-600">
				{orderbarType[active].display}
			</div>
			<div>
				{stateUsers?.length === 0 ? (
					<EmptyComponent />
				) : active === 2 ? (
					<>
						<OrderList active={0} />
					</>
				) : (
					<table className="table">
						<thead className="">
							<tr className="thead align-items-center midAlign">
								<th>S/N</th>
								<th className="ps-lg-5">Name</th>
								<th>status</th>
								<th>notification</th>
							</tr>
						</thead>
						<tbody>
							{stateUsers?.map((item, index) => (
								<Fragment key={index}>
									<tr className="shadow rounded tr align-items-center midAlign">
										<td>{index + 1}.</td>
										<td className="text-capitalize">
											<Link
												to={`${orderbarType[active].url}/${item?._id}`}
												className="text-dark text-decoration-none">
												<span className="d-flex align-items-center">
													<span className="d-none d-md-flex me-3">
														<img
															alt={`${item?.firstName} ${item?.lastName}`}
															src={item?.avatar ? item?.avatar?.url : image}
															style={{
																height: "3rem",
																width: "3rem",
																objectFit: "cover",
																objectPosition: "center 15%",
															}}
															className="rounded-circle img-fluid"
														/>
													</span>
													<span className="fontReduce">
														{item?.firstName} {item?.lastName}
													</span>
												</span>
											</Link>
										</td>
										<td className="text-capitalize fontReduce">
											{item?.status}
										</td>
										<td className="text-capitalize">
											<button
												onClick={() => {
													toggle();
													setUser(item);
												}}
												className="btn btn-primary1 text-capitalize text-white text-decoration-none fontReduce px-1 px-lg-auto">
												send message
											</button>
										</td>
										<td>
											{active === 0 ? (
												<Link to={`/users/trips/${item?._id}`} className="me-2">
													<BiCar className="textColor2" size={24} />{" "}
												</Link>
											) : null}
											{item?.phone && (
												<a href={`tel:${item?.phone}`}>
													<BiPhone className="textColor2" size={24} />
													{"	 "}
												</a>
											)}
										</td>
									</tr>
									<tr className="mustSeperate" />
								</Fragment>
							))}
						</tbody>
					</table>
				)}
			</div>
			{active !== 2 &&
				(!auth?.isFound ? (
					active === 1 ? (
						<LoadMore
							next={auth?.properties_vendors?.hasNextPage}
							handleLoadMore={handleLoadMoreVendors}
							loading={loading}
						/>
					) : (
						<LoadMore
							next={
								search
									? auth?.properties_search?.hasNextPage
									: auth?.properties?.hasNextPage
							}
							handleLoadMore={handleLoadMore}
							loading={loading}
						/>
					)
				) : (
					<LoadMore
						next={
							search
								? auth?.properties_search?.hasNextPage
								: auth?.properties?.hasNextPage
						}
						handleLoadMore={handleLoadMore}
						loading={loading}
					/>
				))}
			<MainNotify
				isOpen={isOpen}
				toggle={toggle}
				title="message"
				state={state}
				textChange={textChange}
				loading={loading2}
				handleSubmit={handleSubmit}
			/>
		</Container>
	);
};

export default Users;
