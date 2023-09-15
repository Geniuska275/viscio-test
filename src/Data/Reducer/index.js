// Root reducer to combine all reducers in the app

import { combineReducers } from "redux";
import AuthReducer from "./AuthReducer";
import ErrorReducer from "./ErrorReducer";
import OrderReducer from "./OrderReducer";
import PriceCheckerReducer from "./PriceCheckerReducer";
import ReferralReducer from "./ReferralReducer";
import RewardReducer, { FeedbackReducer } from "./RewardReducer";
import ChatReducer, { DisputeReducer } from "./ChatReducer";
import socketReducer from "./SocketReducer";
import WalletReducer from "./WalletReducer";
import BankReducer from "./BankReducer";

export default combineReducers({
	auth: AuthReducer,
	errors: ErrorReducer,
	orders: OrderReducer,
	referrals: ReferralReducer,
	prices: PriceCheckerReducer,
	rewards: RewardReducer,
	chats: ChatReducer,
	socket: socketReducer,
	feedbacks: FeedbackReducer,
	dispute: DisputeReducer,
	wallets: WalletReducer,
	banks: BankReducer,
});
