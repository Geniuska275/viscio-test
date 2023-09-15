import React, { useEffect } from "react";
import { Container } from "reactstrap";
import MainOrder from "../../Components/Orders";

const Orders = () => {
	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);
	return (
		<Container className="px-lg-5  pt-3 pt-lg-0">
			<MainOrder />
		</Container>
	);
};

export default Orders;
