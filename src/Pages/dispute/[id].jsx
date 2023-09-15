import React from "react";
import { Container } from "reactstrap";
import { LeftSide, RightSide } from "../../Components/Dispute";
import { useChatLeftSide } from "../../Components/Dispute/useChat";

const SingleChat = () => {
	const { stateChatsUser } = useChatLeftSide();
	if (!stateChatsUser || stateChatsUser === "undefined") return <></>;
	return (
		<Container className="px-lg-5 pt-3 pt-lg-0">
			<div className="row g-4">
				<LeftSide
					stateChatsUser={stateChatsUser}
					css="col-0 col-lg-4 d-none d-lg-block"
				/>
				<RightSide stateChatsUser={stateChatsUser} />
			</div>
		</Container>
	);
};

export default SingleChat;
