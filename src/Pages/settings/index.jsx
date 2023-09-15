import React, { useEffect, useContext, useState } from "react";
import { Container } from "reactstrap";
import { GlobalState } from "../../Data/Context";
import { Buttons } from "../../Utils";

const LateDelivery = () => {
	const { referrals, notifySettings, numberWithCommas, nairaSign } =
		useContext(GlobalState);

	let [businessPercentage, setBusinessPercentage] = useState(""),
		[latePercentage, setLatePercentage] = useState(""),
		[chargePercentage, setChargePercentage] = useState(""),
		[insurancePercentage, setInsurancePercentage] = useState(""),
		[cancellationPercentage, setCancellationPercentage] = useState(""),
		[minimumBonusPayout, setMinimumPayout] = useState(""),
		[stateData, setStateData] = useState(null),
		[loading, setLoading] = useState(false),
		[loadingType, setLoadingType] = useState(false),
		[submit, setSubmit] = useState(false);

	useEffect(() => {
		setStateData(referrals?.settings);
	}, [referrals?.settings]);

	useEffect(() => {
		if (submit && referrals?.isSet) {
			setChargePercentage("");
			setBusinessPercentage("");
			setLatePercentage("");
			setInsurancePercentage("");
			setCancellationPercentage("");
			setMinimumPayout("");
			setSubmit(false);
		}
	}, [referrals?.isSet, submit]);

	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	let handleSubmit = type => async () => {
		if (type === "charge") if (!chargePercentage) return;
		if (type === "late-delivery") if (!latePercentage) return;
		if (type === "insurance") if (!insurancePercentage) return;
		if (type === "business-cut") if (!businessPercentage) return;
		if (type === "cancellation") if (!cancellationPercentage) return;
		if (type === "minimum-payout") if (!minimumBonusPayout) return;

		let data;
		if (type === "charge")
			data = {
				chargePercentage: chargePercentage
					? chargePercentage
					: stateData?.chargePercentage,
			};
		if (type === "late-delivery")
			data = {
				latePercentage: latePercentage
					? latePercentage
					: stateData?.latePercentage,
			};
		if (type === "insurance")
			data = {
				insurancePercentage: insurancePercentage
					? insurancePercentage
					: stateData?.insurancePercentage,
			};
		if (type === "business-cut")
			data = {
				businessPercentage: businessPercentage
					? businessPercentage
					: stateData?.businessPercentage,
			};
		if (type === "cancellation")
			data = {
				cancellationPercentage: cancellationPercentage
					? cancellationPercentage
					: stateData?.cancellationPercentage,
			};
		if (type === "minimum-payout")
			data = {
				minimumBonusPayout: minimumBonusPayout
					? minimumBonusPayout
					: stateData?.minimumBonusPayout,
			};
		// console.log({ data, state });
		setLoadingType(type);
		setLoading(true);
		await notifySettings(data, "settings");
		setLoading(false);
		setLoadingType(false);
		setSubmit(false);
	};

	return (
		<Container className="px-lg-5  pt-3 pt-lg-0">
			<div>
				<p>Late delivery percentage: {stateData?.latePercentage}%</p>
				<p>
					Insurance percentage:
					{stateData?.insurancePercentage}%
				</p>
				<p>Charge percentage: {stateData?.chargePercentage}%</p>
				<p>Business cut percentage: {stateData?.businessPercentage}%</p>
				<p>Cacellation percentage: {stateData?.cancellationPercentage}%</p>
				<p>
					Minimum withdrawal that vendor can initiate: {nairaSign}{" "}
					{numberWithCommas(Number(stateData?.minimumBonusPayout).toFixed(2))}
				</p>
			</div>
			<div className="row mx-0 g-4 pt-5">
				<div className="mb-3 d-flex justify-content-center col-md-6">
					<div className="w-75 w75">
						<label htmlFor="Price" className="mb-3 textColor2 text-capitalize">
							Late delivery Percentage
						</label>
						<input
							type="number"
							name="Price"
							className="form-control w-100 py-3 borderColor"
							placeholder="2%"
							value={latePercentage}
							onChange={e => setLatePercentage(e.target.value)}
						/>
						<Buttons
							loading={loadingType === "late-delivery" && loading}
							title="update"
							css="btn btn-primary1 text-capitalize py-3 w-75 w75 d-block mx-auto my-4"
							width={"w-75 w75"}
							onClick={handleSubmit("late-delivery")}
						/>
					</div>
				</div>
				<div className="mb-3 d-flex justify-content-center col-md-6">
					<div className="w-75 w75">
						<label htmlFor="Price" className="mb-3 textColor2 text-capitalize">
							Insurance Percentage
						</label>
						<input
							type="number"
							name="Price"
							className="form-control w-100 py-3 borderColor"
							placeholder="2,000"
							value={insurancePercentage}
							onChange={e => setInsurancePercentage(e.target.value)}
						/>
						<Buttons
							loading={loadingType === "insurance" && loading}
							title="update"
							css="btn btn-primary1 text-capitalize py-3 w-75 w75 d-block mx-auto my-4"
							width={"w-75 w75"}
							onClick={handleSubmit("insurance")}
						/>
					</div>
				</div>
				<div className="mb-3 d-flex justify-content-center col-md-6">
					<div className="w-75 w75">
						<label htmlFor="Price" className="mb-3 textColor2 text-capitalize">
							Charge Percentage
						</label>
						<input
							type="number"
							name="Price"
							className="form-control w-100 py-3 borderColor"
							placeholder="2%"
							value={chargePercentage}
							onChange={e => setChargePercentage(e.target.value)}
						/>
						<Buttons
							loading={loadingType === "charge" && loading}
							title="update"
							css="btn btn-primary1 text-capitalize py-3 w-75 w75 d-block mx-auto my-4"
							width={"w-75 w75"}
							onClick={handleSubmit("charge")}
						/>
					</div>
				</div>
				<div className="mb-3 d-flex justify-content-center col-md-6">
					<div className="w-75 w75">
						<label htmlFor="Price" className="mb-3 textColor2 text-capitalize">
							Business cut Percentage
						</label>
						<input
							type="number"
							name="Price"
							className="form-control w-100 py-3 borderColor"
							placeholder="2%"
							value={businessPercentage}
							onChange={e => setBusinessPercentage(e.target.value)}
						/>
						<Buttons
							loading={loadingType === "business-cut" && loading}
							title="update"
							css="btn btn-primary1 text-capitalize py-3 w-75 w75 d-block mx-auto my-4"
							width={"w-75 w75"}
							onClick={handleSubmit("business-cut")}
						/>
					</div>
				</div>
				<div className="mb-3 d-flex justify-content-center col-md-6">
					<div className="w-75 w75">
						<label htmlFor="Price" className="mb-3 textColor2 text-capitalize">
							Cancellation Percentage
						</label>
						<input
							type="number"
							name="Price"
							className="form-control w-100 py-3 borderColor"
							placeholder="2%"
							value={cancellationPercentage}
							onChange={e => setCancellationPercentage(e.target.value)}
						/>
						<Buttons
							loading={loadingType === "cancellation" && loading}
							title="update"
							css="btn btn-primary1 text-capitalize py-3 w-75 w75 d-block mx-auto my-4"
							width={"w-75 w75"}
							onClick={handleSubmit("cancellation")}
						/>
					</div>
				</div>
				<div className="mb-3 d-flex justify-content-center col-md-6">
					<div className="w-75 w75">
						<label htmlFor="Price" className="mb-3 textColor2 text-capitalize">
							minimum withdrawal that vendor can initiate
						</label>
						<input
							type="number"
							name="Price"
							className="form-control w-100 py-3 borderColor"
							placeholder="2,000"
							value={minimumBonusPayout}
							onChange={e => setMinimumPayout(e.target.value)}
						/>
						<Buttons
							loading={loadingType === "minimum-payout" && loading}
							title="update"
							css="btn btn-primary1 text-capitalize py-3 w-75 w75 d-block mx-auto my-4"
							width={"w-75 w75"}
							onClick={handleSubmit("minimum-payout")}
						/>
					</div>
				</div>
			</div>
		</Container>
	);
};

export default LateDelivery;
