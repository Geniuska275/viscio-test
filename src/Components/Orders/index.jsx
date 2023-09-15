import React, { useContext, useState } from "react";
import OrderBar from "./OrderBar";
import OrderList from "./OrderList";
import "../../Styles/AuthStyles.css";
import { Loader } from "../../Utils";
import { GlobalState } from "../../Data/Context";

const MainOrder = () => {
	const { orders } = useContext(GlobalState),
		[activeTab, setActiveTab] = useState(0);

	if (orders?.isLoading) return <Loader />;

	return (
		<>
			<OrderBar setActive={setActiveTab} />
			<OrderList active={activeTab} />
		</>
	);
};

export default MainOrder;
