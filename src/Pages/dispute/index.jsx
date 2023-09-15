import React from "react";
import "../../Styles/AuthStyles.css";
import { DefaultRight, LeftSide } from "../../Components/Dispute";
import { useChatLeftSide } from "../../Components/Dispute/useChat";
import { Container } from "reactstrap";

const Chats = () => {
	const { stateChatsUser } = useChatLeftSide();

	if (!stateChatsUser || stateChatsUser === "undefined") return <></>;

	return (
		<Container className="px-lg-5 pt-3 pt-lg-0">
			<div className="row g-4">
				<LeftSide stateChatsUser={stateChatsUser} css="col-12 col-lg-4" />
				<DefaultRight />
			</div>
		</Container>
	);
};

export default Chats;
