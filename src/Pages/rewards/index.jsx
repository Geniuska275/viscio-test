import React, { Fragment, useState, useEffect, useContext } from "react";
import { Container } from "reactstrap";
import { ModalComponents } from "../../Components/DefaultHeader";
import { GlobalState } from "../../Data/Context";
import { Buttons, Loader } from "../../Utils";
import moment from "moment";

export const category = ["Referral", "Deliveries"];

const Rewards = () => {
	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);
	const { rewards, updateReward } = useContext(GlobalState);

	let [isOpen, setIsOpen] = useState(false),
		[statePrices, setStatePrices] = useState(null),
		init = {
			name: "",
			category: "",
			amount: "",
			count: "",
			description: "",
			startDate: "",
			endDate: "",
		},
		[stateData, setStateData] = useState(init),
		textChange =
			name =>
			({ target: { value } }) => {
				setStateData({ ...stateData, [name]: value });
			},
		toggle = () => {
			if (isOpen) {
				setStateData(init);
				setStateEdit(false);
			}
			setIsOpen(!isOpen);
		},
		[stateEdit, setStateEdit] = useState(false),
		[stateDelete, setStateDelete] = useState({ isDeleted: false, data: "" }),
		toggleDel = () => {
			setStateDelete({ isDeleted: false, data: "" });
		},
		[loading, setLoading] = useState(false),
		[submit, setSubmit] = useState(false),
		handleSubmit = async e => {
			e.preventDefault();

			setLoading(true);
			await updateReward(stateData, stateEdit ? "update" : "add");
			setSubmit(true);
			setLoading(false);
		};

	useEffect(() => {
		if (submit && rewards?.isUpdated) {
			setSubmit(false);
			setStateEdit(false);
			setIsOpen(false);
		}
		if (submit && rewards?.isDeleted) {
			setSubmit(false);
			toggleDel();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [submit, rewards?.isUpdated, rewards?.isDeleted]);

	useEffect(() => {
		setStatePrices(rewards.rewards);
	}, [rewards.rewards]);

	if (rewards?.isLoading) return <Loader />;
	if (!statePrices) return <></>;
	// console.log({ statePrices });

	return (
		<Container className="px-lg-5  pt-3 pt-lg-0 aboutScreen minFullHeight d-flex flex-column">
			<p className="my-3 fw-bold text3">Referral list</p>
			<table className="table">
				<thead className="">
					<tr className="thead bg-select-2 pricing">
						<th className="text-white">Name</th>
						<th className="text-white">Category</th>
						<th className="text-white">Description</th>
						<th className="text-white">Amount</th>
						<th className="text-white"></th>
					</tr>
				</thead>
				<tbody>
					{statePrices.map((item, index) => (
						<Fragment key={index}>
							<tr className="py-1">
								<td className="text-capitalize">{item?.name}</td>
								<td className="text-capitalize">{item?.category}</td>
								<td className="text-capitalize">{item?.description}</td>
								<td className="text-capitalize">{item?.amount}</td>
								<td className="text-capitalize d-flex justify-content-end">
									<div className="btn-group w-100">
										<button
											onClick={() => {
												setStateEdit(true);
												toggle();
												setStateData(item);
											}}
											className="btn btn-primary1 text-capitalize w-50">
											edit
										</button>
										<button
											onClick={() => {
												setStateDelete({ isDeleted: true, data: item });
											}}
											className="btn btn-success2 text-capitalize w-50">
											delete
										</button>
									</div>
								</td>
							</tr>
						</Fragment>
					))}
				</tbody>
			</table>
			<button
				onClick={toggle}
				className="btn btn-primary1 text-capitalize py-3 w-50 d-block mx-auto mt-auto">
				add new
			</button>
			<ModalComponents
				title={stateEdit ? "Update Reward" : "Reward"}
				toggle={toggle}
				isOpen={isOpen}>
				<div className="downH2">
					<form>
						<div className="form-floating mb-3">
							<input
								type={"text"}
								required
								name="Name"
								className="form-control text-capitalize"
								placeholder="Name"
								value={stateData.name}
								onChange={textChange("name")}
							/>
							<label htmlFor="Name">Name</label>
						</div>
						<div className="form-floating mb-3">
							<select
								required
								name="Category"
								className="form-control text-capitalize form-select"
								placeholder="Category"
								value={stateData.category}
								onChange={textChange("category")}>
								<option value="">Select a category</option>
								{category.map((item, index) => (
									<option value={item} key={index}>
										{item}
									</option>
								))}
							</select>
							<label htmlFor="Category">Category</label>
						</div>
						<div className="form-floating mb-3">
							<input
								type="number"
								required
								name="Amount"
								className="form-control"
								placeholder="Amount"
								value={stateData.amount}
								onChange={textChange("amount")}
							/>
							<label htmlFor="Amount">Amount</label>
						</div>
						{!stateEdit && (
							<div className="form-floating mb-3">
								<input
									type="number"
									required
									name="Count"
									className="form-control"
									placeholder="Count"
									value={stateData.count}
									onChange={textChange("count")}
								/>
								<label htmlFor="Count">Count</label>
							</div>
						)}
						<div className="form-floating mb-3">
							<input
								type="date"
								required
								name="Start Date"
								className="form-control"
								placeholder="Start Date"
								value={stateData.startDate}
								onChange={textChange("startDate")}
								min={moment().format("YYYY-MM-DD")}
							/>
							<label htmlFor="Start Date">Start Date</label>
						</div>
						<div className="form-floating mb-3">
							<input
								type="date"
								required
								name="End Date"
								className="form-control"
								placeholder="End Date"
								value={stateData.endDate}
								onChange={textChange("endDate")}
								min={moment().format("YYYY-MM-DD")}
							/>
							<label htmlFor="End Data">End Date</label>
						</div>
						<div className="form-floating mb-3">
							<textarea
								required
								name="Description"
								className="form-control"
								placeholder="Description"
								value={stateData.description}
								onChange={textChange("description")}
								style={{ height: "7rem", resize: "none" }}
							/>
							<label htmlFor="Description">Description</label>
						</div>
						{stateEdit && (
							<div className="mb-3">
								<input
									required
									name="Available"
									className="form-check-input form-check-inline"
									type={"checkbox"}
									placeholder="Available"
									value={stateData.available}
									checked={stateData.available}
									onChange={textChange("available")}
								/>
								<label htmlFor="Available">Available</label>
							</div>
						)}
						<Buttons
							loading={loading}
							onClick={handleSubmit}
							width="w-50"
							css="btn-primary1 text-capitalize py-3 d-block mx-auto my-4"
							title={stateEdit ? "update" : "add"}
						/>
					</form>
				</div>
			</ModalComponents>
			<ModalComponents
				title={"Delete Reward"}
				back={toggleDel}
				isOpen={stateDelete.isDeleted}>
				<div className="downH2">
					<form className="d-flex flex-column justify-content-center align-items-center h-100">
						<p>Do you want to delete this item?</p>
						<div className="btn-group mx-auto w-50">
							<Buttons
								loading={loading}
								onClick={async e => {
									e.preventDefault();
									setLoading(true);
									await updateReward(stateDelete.data, "delete");
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
		</Container>
	);
};

export default Rewards;
