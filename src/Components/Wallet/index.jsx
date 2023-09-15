import React, { Fragment, useContext, useEffect, useState } from "react";
import moment from "moment";
import { DefaultBoxing } from "../Error";
import { GlobalState } from "../../Data/Context";
import { Buttons, EmptyComponent } from "../../Utils";
import LoadMore from "../LoadMore";
import { ModalComponents } from "../DefaultHeader";
import { toast } from "react-toastify";

const MainWallets = () => {
	const {
		wallets,
		nairaSign,
		numberWithCommas,
		getWithdrawalIncome,
		updateWallet,
		banks,
		fundWallet,
		getWallet,
	} = useContext(GlobalState);
	let [stateWallet, setStateWallet] = useState(null),
		[stateWalletMain, setStateWalletMain] = useState(null),
		[loading, setLoading] = useState(false),
		[loading2, setLoading2] = useState(false),
		[isOpen, setIsOpen] = useState(false),
		[isOpen2, setIsOpen2] = useState(false),
		[isOpen3, setIsOpen3] = useState(false),
		[bankOpen, setBankOpen] = useState(false),
		[submit, setSubmit] = useState(false),
		[walletActive, setWalletActive] = useState(0),
		banktoggle = () => {
			setBankOpen(!bankOpen);
		},
		toggle = () => {
			setIsOpen(!isOpen);
		},
		toggle2 = () => {
			setIsOpen2(!isOpen2);
		},
		toggle3 = () => {
			setIsOpen3(!isOpen3);
		},
		init = {
			otp: "",
			status: "",
			reason: "",
		},
		[stateData, setStateData] = useState(init),
		textChange =
			name =>
			({ target: { value } }) => {
				setStateData({ ...stateData, [name]: value });
			},
		init2 = {
			accountNumber: "",
			bankCode: "",
			bankId: "",
			amount: "",
		},
		[stateData2, setStateData2] = useState(init2),
		[stateDelete, setStateDelete] = useState({ isDeleted: false, data: "" }),
		toggleDel = () => {
			setStateDelete({ isDeleted: false, data: "" });
		},
		textChange2 =
			name =>
			({ target: { value } }) => {
				setStateData2({ ...stateData2, [name]: value });
			},
		handleSubmit = path => async e => {
			if (e) e.preventDefault();
			setLoading2(true);
			await updateWallet({ ...stateData, id: stateData?._id }, path);
			setLoading2(false);
		};

	const handleAddBank = async e => {
		e.preventDefault();
		if (stateData2?.accountNumber?.length !== 10)
			return toast.info("Account number must be 10 digits");

		setLoading(true);
		await fundWallet("banks", stateData2);
		setLoading(false);
		setSubmit(true);
	};

	const handleInitiateWithdraw = async e => {
		e.preventDefault();
		let errArr = [];
		if (!stateData2?.amount) errArr.push("Amount required");

		if (!stateData2?.bankId) errArr.push("Account Bank required");

		if (errArr.length > 0) return errArr.forEach(item => toast.info(item));

		setLoading(true);
		await fundWallet("initiate", stateData2);
		setLoading(false);
		setSubmit(true);
	};

	useEffect(() => {
		if (submit && wallets?.isAdded) {
			toggle();
			setSubmit(false);
		}
		if (submit && banks?.isAdded) {
			setBankOpen(false);
			setSubmit(false);
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [submit, wallets?.isAdded, banks?.isAdded]);

	useEffect(() => {
		setStateWallet(wallets.withdrawal);
	}, [wallets.withdrawal]);
	useEffect(() => {
		setStateWalletMain(wallets.wallet);
	}, [wallets.wallet]);

	let handleLoadMore = async () => {
		setLoading(true);
		await getWithdrawalIncome({
			limit: Number(wallets?.properties?.nextPage * wallets?.properties?.limit),
		});
		setLoading(false);
	};

	let handleLoadMoreWallet = async () => {
		setLoading(true);
		await getWallet({
			limit: Number(
				wallets?.wallet_properties?.nextPage * wallets?.wallet_properties?.limit
			),
		});
		setLoading(false);
	};

	let walletTab = [
		{
			name: "Transaction history",
			value: "history",
		},
		{
			name: "Wallet History",
			value: "wallet",
		},
		{
			name: "Bank Accounts",
			value: "bank",
		},
	];

	let statusTab = [
		{
			name: "Pending",
			value: "pending",
		},
		{
			name: "Declined",
			value: "declined",
		},
		{
			name: "Approved",
			value: "approved",
		},
	];

	// console.log({ stateData });

	return (
		<>
			<DefaultBoxing>
				<div>
					<p>available balance</p>
					<h1 className="">
						{nairaSign}{" "}
						{numberWithCommas(Number(wallets?.totalBalance).toFixed(2))}
					</h1>
					<button
						type="button"
						onClick={toggle3}
						className="btn btn-white text-capitalize py-3 px-5 mt-5">
						{"withdraw"}
					</button>
				</div>
			</DefaultBoxing>
			<>
				<div className="btn-group w-100 mt-3">
					{walletTab.map((item, ind) => (
						<button
							className={`btn w-100 ${
								walletActive === ind ? "border-bottom roudned-none" : ""
							}`}
							onClick={() => setWalletActive(ind)}
							key={ind}>
							{item?.name}
						</button>
					))}
				</div>
				{walletTab?.[walletActive]?.value === "bank" ? (
					<div className="d-flex justify-content-end align-items-center pt-3">
						<button
							onClick={banktoggle}
							className="btn btn-primary1 text-capitalize">
							add bank
						</button>
						<BankModal
							isOpen={bankOpen}
							toggle={banktoggle}
							banks={banks?.banks}
							loading={loading}
							handleSubmit={handleAddBank}
							textChange={textChange2}
							stateData={stateData2}
						/>
					</div>
				) : null}
				<p className="my-3 text-center text5 fw-normal">
					{walletTab[walletActive]?.name}
				</p>
			</>

			{walletActive === 2 ? (
				<>
					<AccountTable data={banks?.bankAccount} toggle={setStateDelete} />
				</>
			) : walletActive === 1 ? (
				<>
					{stateWalletMain?.length > 0 ? (
						<>
							<table className="table">
								<thead className="">
									<tr className="thead">
										<th>Balance</th>
										<th>Previous balance</th>
										<th>Date</th>
										<th>User</th>
									</tr>
								</thead>
								<tbody>
									{stateWalletMain?.map((item, index) => (
										<Fragment key={index}>
											<tr className="py-1">
												<td className="text-capitalize">
													{nairaSign}
													{numberWithCommas(item?.balance)}
												</td>
												<td className="text-capitalize">
													{nairaSign}
													{numberWithCommas(item?.previousBalance)}
												</td>
												<td className="text-capitalize">
													{moment(item?.createdAt).format("L")}
												</td>
												<td className="text-capitalize">
													{item?.owner?.lastName} {item?.owner?.firstName}
												</td>
												<td className="text-capitalize">{item?.status}</td>
											</tr>
											<tr className="mustSeperate" />
										</Fragment>
									))}
								</tbody>
							</table>
							<LoadMore
								next={wallets?.wallet_properties?.hasNextPage}
								handleLoadMore={handleLoadMoreWallet}
								loading={loading}
							/>
						</>
					) : (
						<div className="pt-4">
							<EmptyComponent subtitle={"No Wallet  history"} />
						</div>
					)}
				</>
			) : (
				<>
					{stateWallet?.length > 0 ? (
						<>
							<table className="table">
								<thead className="">
									<tr className="thead row mx-0">
										<th className="col">Amount</th>
										<th className="col">Date</th>
										<th className="col">User</th>
										<th className="col">Status</th>
										<th className="col col-md-0"></th>
									</tr>
								</thead>
								<tbody>
									{stateWallet?.map((item, index) => (
										<Fragment key={index}>
											<tr className="py-2 row mx-0 border-bottom">
												<td className="text-capitalize col">
													{nairaSign}{" "}
													{numberWithCommas(Number(item?.amount).toFixed(2))}
												</td>
												<td className="text-capitalize col">
													{moment(item?.createdAt).format("L")}
												</td>
												<td className="text-capitalize col">
													{item?.user?.lastName} {item?.user?.firstName}
												</td>
												<td className="text-capitalize col">{item?.status}</td>
												<td className="col">
													<div className="btn-group">
														<button
															onClick={() => {
																toggle2();
																setStateData(item);
															}}
															className="btn btn-primary1 text-capitalize textTrunc">
															update
														</button>
														<button
															onClick={() => {
																toggle();
																setStateData(item);
															}}
															className="btn btn-success2 text-capitalize textTrunc">
															finalize
														</button>
													</div>
												</td>
											</tr>
											<tr className="mustSeperate" />
										</Fragment>
									))}
								</tbody>
							</table>
							<LoadMore
								next={wallets?.properties?.hasNextPage}
								handleLoadMore={handleLoadMore}
								loading={loading}
							/>
						</>
					) : (
						<div className="pt-4">
							<EmptyComponent subtitle={"No Wallet  history"} />
						</div>
					)}
				</>
			)}
			<ModalComponents
				title={"Finalize withdrawal"}
				isOpen={isOpen}
				back={toggle}>
				<form>
					<div>
						<p className="d-flex justify-content-between align-items-center">
							<span className="fw-bold">User: </span>
							<span>
								{stateData?.user?.lastName} {stateData?.user?.firstName}{" "}
							</span>
						</p>
						<p className="d-flex justify-content-between align-items-center">
							<span className="fw-bold">Amount: </span>
							<span>
								{nairaSign}{" "}
								{numberWithCommas(Number(stateData?.amount).toFixed(2))}
							</span>
						</p>
						<p className="d-flex justify-content-between align-items-center">
							<span className="fw-bold">Date: </span>
							<span>{moment(stateData?.createdAt).format("L")}</span>
						</p>
					</div>
					<div className="form-floating mb-3">
						<input
							type="number"
							name="otp"
							placeholder="Otp"
							value={stateData?.otp}
							onChange={textChange("otp")}
							className="form-control"
						/>
						<label htmlFor="otp">Otp</label>
					</div>
					<Buttons
						loading={loading2}
						onClick={handleSubmit("finalize")}
						width="w-50"
						css="btn-primary1 text-capitalize py-3 d-block mx-auto my-4"
						title={"send"}
					/>
				</form>
			</ModalComponents>

			<ModalComponents
				title={"update withdrawal"}
				isOpen={isOpen2}
				back={toggle2}>
				<form>
					<div>
						<p className="d-flex justify-content-between align-items-center">
							<span className="fw-bold">User: </span>
							<span>
								{stateData?.user?.lastName} {stateData?.user?.firstName}{" "}
							</span>
						</p>
						<p className="d-flex justify-content-between align-items-center">
							<span className="fw-bold">Amount: </span>
							<span>
								{nairaSign}{" "}
								{numberWithCommas(Number(stateData?.amount).toFixed(2))}
							</span>
						</p>
						<p className="d-flex justify-content-between align-items-center">
							<span className="fw-bold">Date: </span>
							<span>{moment(stateData?.createdAt).format("L")}</span>
						</p>
					</div>
					<div className="form-floating mb-3">
						<select
							name="bankId"
							className="form-control form-select"
							value={stateData?.status}
							onChange={textChange("status")}>
							<option value=""></option>
							{statusTab?.map((item, i) => (
								<option value={item?.value} key={i}>
									{item?.name}
								</option>
							))}
						</select>
						<label htmlFor="status">Status</label>
					</div>

					<div className="form-floating mb-3">
						<textarea
							name="reason"
							placeholder="Reason"
							value={stateData?.reason}
							onChange={textChange("reason")}
							className="form-control"
							style={{ resize: "none", height: "7rem" }}
						/>
						<label htmlFor="reason">Reason</label>
					</div>
					<Buttons
						loading={loading2}
						onClick={handleSubmit("update")}
						width="w-50"
						css="btn-primary1 text-capitalize py-3 d-block mx-auto my-4"
						title={"send"}
					/>
				</form>
			</ModalComponents>
			<ModalComponents title={"withdraw"} toggle={toggle3} isOpen={isOpen3}>
				<WithdrawFund
					handleSubmit={handleInitiateWithdraw}
					stateData={stateData2}
					textChange={textChange2}
					banks={banks?.bankAccount}
					stateWallet={stateWallet}
					loading={loading}
				/>
			</ModalComponents>
			<ModalComponents
				title={"Delete Account"}
				back={toggleDel}
				isOpen={stateDelete.isDeleted}>
				<div className="downH2 d-flex">
					<form className="d-flex flex-column justify-content-center align-items-center h-100 w-100 m-auto">
						<p>Do you want to delete this account?</p>
						<div className="btn-group mx-auto w-50">
							<Buttons
								loading={loading}
								onClick={async e => {
									e.preventDefault();
									setLoading(true);
									await fundWallet("delete-bank", stateDelete.data);
									setSubmit(true);
									setLoading(false);
								}}
								width="w-50"
								css="btn-success2 text-capitalize py-3 w-50"
								title={"yes"}
							/>
							<Buttons
								onClick={toggleDel}
								width="w-50"
								css="btn-primary1 text-capitalize py-3 w-50"
								title={"no"}
							/>
						</div>
					</form>
				</div>
			</ModalComponents>
		</>
	);
};

export default MainWallets;

const WithdrawFund = ({
	handleSubmit,
	stateData,
	textChange,
	loading,
	banks,
	stateWallet,
}) => {
	let [active, setActive] = useState(0);
	let { referrals, nairaSign, numberWithCommas } = useContext(GlobalState);
	let [charge, setCharge] = useState(0);

	useEffect(() => {
		setCharge(
			Number((stateData?.amount * referrals?.settings?.chargePercentage) / 100)
		);
	}, [stateData?.amount, referrals?.settings]);
	if (!banks) return;

	return (
		<form>
			{active === 1 ? (
				<>
					<div className="px-4">
						<p className="text-center d-flex align-items-center justify-content-between">
							Amount:{" "}
							<strong>
								{nairaSign}{" "}
								{numberWithCommas(Number(stateData?.amount).toFixed(2))}{" "}
							</strong>
						</p>
						<p className="text-center d-flex align-items-center justify-content-between">
							Charge:{" "}
							<strong>
								{nairaSign} {numberWithCommas(Number(charge).toFixed(2))}{" "}
							</strong>
						</p>

						<p className="text-center d-flex align-items-center justify-content-between">
							<span>Total: </span>
							<strong>
								{nairaSign}{" "}
								{numberWithCommas(
									Number(Number(stateData?.amount) + charge).toFixed(2)
								)}{" "}
							</strong>
						</p>
						<button
							type="button"
							onClick={() => {
								setActive(0);
							}}
							className="btn btn-outline-primary1 text-capitalize d-block ms-auto my-4">
							back
						</button>
						<Buttons
							onClick={handleSubmit}
							loading={loading}
							css="btn btn-primary1 text-capitalize py-3 w-50 d-block mx-auto my-4"
							title={"send"}
							width="w-50"
						/>
					</div>
				</>
			) : (
				<>
					<div className="form-floating mb-3">
						<select
							name="bankId"
							className="form-control bg-grey"
							value={stateData?.bankId}
							onChange={textChange("bankId")}>
							<option value="">Select a bank</option>
							{banks?.map((item, i) => (
								<option value={item?._id} key={i}>
									{item?.accountName}, {item?.bankName}
								</option>
							))}
						</select>
						<label htmlFor="bankId" className="textColor2">
							Bank
						</label>
					</div>
					<div className="form-floating mb-3">
						<input
							type="number"
							placeholder="50,000"
							name="amount"
							className="form-control bg-grey"
							value={stateData?.amount}
							onChange={textChange("amount")}
							max={stateWallet?.balance}
						/>
						<label htmlFor="amount" className="textColor2">
							Amount
						</label>
					</div>
					<Buttons
						onClick={e => {
							e.preventDefault();
							let errArr = [];
							if (!stateData?.amount) errArr.push("Amount required");

							if (!stateData?.bankId) errArr.push("Account Bank required");

							if (errArr.length > 0)
								return errArr.forEach(item => toast.info(item));

							setActive(1);
						}}
						css="btn btn-primary1 text-capitalize py-3 w-50 d-block mx-auto my-4"
						title={"next"}
						width="w-50"
					/>
				</>
			)}
		</form>
	);
};

const AccountTable = ({ data, toggle }) => {
	if (!data) return;
	return (
		<>
			{data?.length === 0 ? (
				<div className="pt-4">
					<EmptyComponent subtitle={"No Account  history"} />
				</div>
			) : (
				<table className="table">
					<thead className="">
						<tr className="thead">
							<th>Bank Name</th>
							<th>Account Number</th>
							<th>Account Name</th>
						</tr>
					</thead>
					<tbody>
						{data?.map((item, index) => (
							<Fragment key={index}>
								<tr className="py-1">
									<td className="text-capitalize">{item?.bankName}</td>
									<td className="text-capitalize">{item?.accountNumber}</td>
									<td className="text-capitalize">{item?.accountName}</td>
									<td className="text-capitalize">
										<button
											type="button"
											onClick={() => {
												toggle({ isDeleted: true, data: item });
											}}
											className="btn btn-outline-danger text-capitalize border-bottom">
											delete
										</button>
									</td>
								</tr>
								<tr className="mustSeperate" />
							</Fragment>
						))}
					</tbody>
				</table>
			)}
		</>
	);
};

const BankModal = ({
	isOpen,
	toggle,
	banks,
	stateData,
	textChange,
	loading,
	handleSubmit,
}) => {
	if (!banks) return;
	return (
		<ModalComponents isOpen={isOpen} back={toggle} title="add bank account">
			<form>
				<div className="form-floating mb-3">
					<select
						name="bankCode"
						className="form-control bg-grey"
						value={stateData?.bankCode}
						onChange={textChange("bankCode")}>
						<option value="">Select a bank</option>
						{banks?.map((item, i) => (
							<option value={item?.code} key={i}>
								{item?.name}
							</option>
						))}
					</select>
					<label htmlFor="bankCode" className="textColor2">
						Bank
					</label>
				</div>
				<div className="form-floating mb-3">
					<input
						type="number"
						name="accountNumber"
						placeholder="0254195018"
						className="form-control bg-grey"
						value={stateData?.accountNumber}
						onChange={textChange("accountNumber")}
					/>
					<label htmlFor="accountNumber" className="textColor2">
						Account Number
					</label>
				</div>

				<Buttons
					onClick={handleSubmit}
					loading={loading}
					css="btn btn-primary1 text-capitalize py-3 w-50 d-block mx-auto my-4"
					title={"send"}
					width="w-50"
				/>
			</form>
		</ModalComponents>
	);
};
