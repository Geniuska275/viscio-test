import React, { Fragment, useContext, useEffect, useState } from "react";
import { LoadMore } from "../../Components";
import { GlobalState } from "../../Data/Context";
import { EmptyComponent } from "../../Utils";

const ReferralHistory = () => {
	const { referrals, getReferral } = useContext(GlobalState),
		[stateReferrals, setStateReferrals] = useState(null);
	let [loading, setLoading] = useState(false);

	useEffect(() => {
		setStateReferrals(referrals.referral);
	}, [referrals.referral]);

	let handleLoadMore = async () => {
		setLoading(true);
		await getReferral({
			limit: Number(
				referrals?.properties?.nextPage * referrals?.properties?.limit
			),
		});
		setLoading(false);
	};

	if (!stateReferrals) return;
	return (
		<>
			<p className="my-3 text-center text5 fw-normal">Referral list</p>
			{stateReferrals?.length === 0 ? (
				<EmptyComponent />
			) : (
				<table className="table">
					<thead className="">
						<tr className="thead">
							<th>Name</th>
							<th>Category</th>
							<th>Withdraw</th>
							<th>Pending</th>
						</tr>
					</thead>
					<tbody>
						{stateReferrals.map((item, index) => (
							<Fragment key={index}>
								<tr className="py-1">
									<td className="text-capitalize">
										{item?.receiver?.lastName} {item?.receiver?.firstName}
									</td>
									<td className="text-capitalize">{item?.category}</td>
									<td className="text-capitalize">{item?.withdraw}</td>
									<td className="text-capitalize">{item?.pending}</td>
								</tr>
								<tr className="mustSeperate" />
							</Fragment>
						))}
					</tbody>
				</table>
			)}
			<LoadMore
				next={referrals?.properties?.hasNextPage}
				handleLoadMore={handleLoadMore}
				loading={loading}
			/>
		</>
	);
};

export default ReferralHistory;
