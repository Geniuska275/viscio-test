import { useEffect } from "react";
import "./App.css";
import { Provider } from "react-redux";
import DataProvider from "./Data/Context";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap";
import $ from "jquery";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter as Router } from "react-router-dom";
import Routers from "./Routes";
import Store from "./Data/Store";
import { SetAuthToken, SetDefaultHeaders } from "./Data/Config";
import { loadUser } from "./Data/Actions/AuthAction";

// Preloader
$(window).on("load", function () {
	$(".lds-ellipsis").fadeOut(); // will first fade out the loading animation
	$(".preloader").delay(333).fadeOut("slow"); // will fade out the white DIV that covers the website.
	$("body").delay(333);
});

SetDefaultHeaders();

if (localStorage.VISCIO_TOKEN) {
	SetAuthToken(localStorage.VISCIO_TOKEN);
}

const App = () => {
	useEffect(() => {
		Store.dispatch(loadUser());
	}, []);
	return (
		<Provider store={Store}>
			<DataProvider>
				<Router>
					<Routers />
				</Router>
			</DataProvider>
		</Provider>
	);
};

export default App;
