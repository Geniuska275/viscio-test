import React, { useContext, useEffect, useState } from "react";
import { Container } from "reactstrap";
import MainProfile from "../../Components/Profile";
import { GlobalState } from "../../Data/Context";

const Profile = () => {
	const { auth, updateAdmin } = useContext(GlobalState);
	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	useEffect(() => {
		if (auth?.user)
			setStateData({
				...auth?.user,
				fullname: `${auth?.user.firstName} ${auth?.user.lastName}`,
			});
	}, [auth?.user]);

	let init = {},
		[stateData, setStateData] = useState(init),
		[loading, setLoading] = useState(false),
		[images, setImages] = useState(false),
		[submit, setSubmit] = useState(false),
		textChange =
			name =>
			({ target: { value } }) => {
				setStateData({ ...stateData, [name]: value });
			},
		handleSubmit = type => async e => {
			e.preventDefault();
			setLoading(true);
			await updateAdmin(
				images ? { ...stateData, image: images } : stateData,
				type
			);
			setLoading(false);
			setSubmit(true);
		};

	useEffect(() => {
		if (submit && auth?.isUpdated) {
			setSubmit(false);
			setImages(false);
			setStateData({
				...auth?.user,
				fullname: `${auth?.user.firstName} ${auth?.user.lastName}`,
			});
		}
	}, [submit, auth?.isUpdated, auth?.user]);
	return (
		<Container className="px-lg-5  pt-3 pt-lg-0">
			<MainProfile
				stateData={stateData}
				textChange={textChange}
				handleSubmit={handleSubmit}
				loading={loading}
				images={images}
				setImages={setImages}
			/>
		</Container>
	);
};

export default Profile;
