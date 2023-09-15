import React, { useState, useEffect } from "react";
import { Container } from "reactstrap";
import { MainWallet } from "../../Components";

export const transactionHistory = [
	{ amount: "3,000", detail: "Inter-City Door to Doors" },
	{ amount: "3,000", detail: "Inter-City Door to Doors" },
	{ amount: "3,000", detail: "Inter-City Door to Doors" },
	{ amount: "3,000", detail: "Inter-City Door to Doors" },
	{ amount: "3,000", detail: "Inter-City Door to Doors" },
	{ amount: "3,000", detail: "Inter-City Door to Doors" },
	{ amount: "3,000", detail: "Inter-City Door to Doors" },
	{ amount: "3,000", detail: "Inter-City Door to Doors" },
	{ amount: "3,000", detail: "Inter-City Door to Doors" },
	{ amount: "3,000", detail: "Inter-City Door to Doors" },
	{ amount: "3,000", detail: "Inter-City Door to Doors" },
	{ amount: "3,000", detail: "Inter-City Door to Doors" },
	{ amount: "3,000", detail: "Inter-City Door to Doors" },
];

const Wallet = () => {
	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);
	let [isOpen, setIsOpen] = useState(false),
		toggle = () => {
			setIsOpen(!isOpen);
		},
		handleSubmit = async e => {
			e.preventDefault();
			toggle();
		};

	return (
		<Container className="px-lg-5  pt-3 pt-lg-0">
			<MainWallet
				transactionHistory={transactionHistory}
				toggle={toggle}
				isOpen={isOpen}
				handleSubmit={handleSubmit}
			/>
		</Container>
	);
};

export default Wallet;
