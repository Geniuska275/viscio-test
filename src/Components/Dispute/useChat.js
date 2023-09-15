import { useContext, useState, useEffect } from "react";
import { GlobalState } from "../../Data/Context";
import $ from "jquery";

export const useChatLeftSide = () => {
	const { dispute } = useContext(GlobalState),
		[stateChatsUser, setStateChatsUser] = useState([]);
	useEffect(() => {
		setStateChatsUser(dispute.total_dispute?.filter(item=> item?.status !== 'resolved'));
		$("#div1").animate({ scrollTop: $("#div1").prop("scrollHeight") }, 1000);
	}, [dispute]);
	return { stateChatsUser };
};
