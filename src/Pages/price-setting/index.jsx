import React, { Fragment, useState, useEffect, useContext } from "react";
import { Container } from "reactstrap";
import { LoadMore } from "../../Components";
import { ModalComponents } from "../../Components/DefaultHeader";
import { GlobalState } from "../../Data/Context";
import { Buttons, Loader } from "../../Utils";

export const vehicleType = ["bike", "car", "bicycle", "truck"];
export const deliveryType = [
	"City (delivery within same state or city)",
	"Inter-State",
	"Inter-Country",
];

const Pricing = () => {
	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);
	const { prices, updatePriceChecker, getPriceChecker } =
		useContext(GlobalState);

	let [isOpen, setIsOpen] = useState(false),
		[statePrices, setStatePrices] = useState(null),
		init = {
			vehicleType: "",
			pricePerKm: "",
			deliveryType: "",
		},
		[loading2, setLoading2] = useState(false),
		[stateData, setStateData] = useState(init),
		textChange =
			name =>
			({ target: { value } }) => {
				setStateData({ ...stateData, [name]: value });
			},
		toggle = () => {
			if (isOpen) {
				setIsOpen(false);
				setStateData(init);
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
			await updatePriceChecker(stateData, stateEdit ? "update" : "add");
			setSubmit(true);
			setLoading(false);
		};

	let handleLoadMore = async () => {
		setLoading2(true);
		await getPriceChecker({
			limit: Number(prices?.properties?.nextPage * prices?.properties?.limit),
		});
		setLoading2(false);
	};

	useEffect(() => {
		if (submit && prices?.isUpdated) {
			setSubmit(false);
			setStateEdit(false);
			setIsOpen(false);
		}
		if (submit && prices?.isDeleted) {
			setSubmit(false);
			toggleDel();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [submit, prices?.isUpdated, prices?.isDeleted]);

	useEffect(() => {
		setStatePrices(prices.price);
	}, [prices.price]);

	if (prices?.isLoading) return <Loader />;
	if (!statePrices) return <></>;
	// console.log({ statePrices });

	return (
		<Container className="px-lg-5  pt-3 pt-lg-0 aboutScreen minFullHeight d-flex flex-column">
			<table className="table">
				<thead className="">
					<tr className="thead bg-select-2 pricing">
						<th className="text-white">Delivery Type</th>
						<th className="text-white">Delivery mode</th>
						<th className="text-white">Price/km</th>
						<th className="text-white"></th>
					</tr>
				</thead>
				<tbody>
					{statePrices.map((item, index) => (
						<Fragment key={index}>
							<tr className="py-1">
								<td className="text-capitalize">{item?.deliveryType}</td>
								<td className="text-capitalize">{item?.vehicleType}</td>
								<td className="text-capitalize">{item?.pricePerKm}</td>
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
			<div className="mt-auto btn-group mx-auto w-50 w50">
				<LoadMore
					next={prices?.properties?.hasNextPage}
					handleLoadMore={handleLoadMore}
					loading={loading2}
				/>
				<button
					onClick={toggle}
					className="btn btn-primary3 text-capitalize py-3 my-4 w-50 w50">
					add new
				</button>
			</div>
			<ModalComponents title={"Pricing"} toggle={toggle} isOpen={isOpen}>
				<div className="downH2">
					<form>
						<div className="form-floating mb-3">
							<select
								required
								name="Delivery type"
								className="form-control form-select text-capitalize"
								placeholder="Delivery category"
								value={stateData.deliveryType}
								onChange={textChange("deliveryType")}>
								<option value="">Select a delivery category</option>
								{deliveryType.map((item, index) => (
									<option value={item} key={index}>
										{item}
									</option>
								))}
							</select>
							<label htmlFor="Delivery type">Delivery category</label>
						</div>
						<div className="form-floating mb-3">
							<select
								required
								name="Delivery mode"
								className="form-control form-select text-capitalize"
								placeholder="Delivery mode"
								value={stateData.vehicleType}
								onChange={textChange("vehicleType")}>
								<option value="">Select a delivery mode</option>
								{vehicleType.map((item, index) => (
									<option value={item} key={index}>
										{item}
									</option>
								))}
							</select>
							<label htmlFor="Delivery mode">Delivery mode</label>
						</div>
						<div className="form-floating mb-3">
							<input
								type="number"
								required
								name="Base Fee (Per KM)"
								className="form-control"
								placeholder="Base Fee (Per KM)"
								value={stateData.pricePerKm}
								onChange={textChange("pricePerKm")}
							/>
							<label htmlFor="Base Fee (Per KM)">Base Fee (Per KM)</label>
						</div>
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
				title={"Delete Pricing"}
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
									await updatePriceChecker(stateDelete.data, "delete");
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

export default Pricing;
