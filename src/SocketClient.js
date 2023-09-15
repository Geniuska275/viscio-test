import React, { useContext, useEffect, useRef, useMemo, useState } from "react";
import { GlobalState } from "./Data/Context";
import audio from "./Assets/juntos-607.mp3";
import audio2 from "./Assets/message-tone-checked-off.mp3";
import { io } from "socket.io-client";
import { useLocation } from "react-router-dom";

const SocketClient = () => {
	const {
		socketNewMessage,
		mainSocket,
		auth,
		socketProfile,
		chats,
		getBids,
		getChats,
		getOrders,
	} = useContext(GlobalState);

	let [socket, setSocket] = useState(null);
	const setUpSocket = async () => {
		let newSocket = io(process.env.REACT_APP_MAIN_BASE_URL, {
			query: {
				userId: auth?.user?._id,
			},
			transports: ["websocket"],
		});
		newSocket.on("disconnect", () => {
			setSocket(null);
			setTimeout(setUpSocket, 3000);
		});
		setSocket(newSocket);
	};

	useEffect(() => {
		if (socket) {
			socketProfile(socket);
			// setReconn(true);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [socket]);

	let audioRef = useRef(),
		audioRef2 = useRef(),
		location = useLocation();

	useMemo(
		() => {
			setUpSocket();
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[]
	);

	useEffect(() => {
		mainSocket?.socket?.on("message", value => {
			console.log({ value }, "message");
		});
		// console.log({ socket });
		return () => {
			mainSocket?.socket?.off("message");
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [mainSocket]);

	useEffect(() => {
		mainSocket?.socket?.on("user-status", value => {
			if (!value.isOnline) {
				console.log({ value }, "user-status");
				setUpSocket();
			}
		});
		// console.log({ socket });
		return () => {
			mainSocket?.socket?.off("user-status");
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [mainSocket]);

	useEffect(() => {
		mainSocket?.socket?.on("chat", value => {
			let loci = location.pathname.split("/");
			if (
				location?.pathname?.includes("/dispute") &&
				loci?.[loci.length - 1] === value?.chatId
			) {
				console.log({ value }, "chat");
				socketNewMessage(value.message);
				audioRef2.current.play();
			} else {
				audioRef.current.play();
			}
			getBids("load");
			getOrders(null, "load");
			getChats(
				{
					limit: Number(chats?.properties?.limit),
				},
				"load"
			);
		});
		// console.log({ socket });
		return () => {
			mainSocket?.socket?.off("chat");
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [mainSocket, location.pathname]);

	return (
		<>
			<audio controls ref={audioRef} className="notificationSound">
				<source src={audio} type="audio/mp3" />
			</audio>
			<audio
				controls
				ref={audioRef2}
				className="notificationSound"
				style={{ display: "none" }}>
				<source src={audio2} type="audio/mp3" />
			</audio>
		</>
	);
};

export default SocketClient;
