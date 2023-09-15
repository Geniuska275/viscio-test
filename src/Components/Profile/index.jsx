import React from "react";
import { BsUpload } from "react-icons/bs";
import { toast } from "react-toastify";
import { Container } from "reactstrap";
import user from "../../Assets/avatar3.png";
import { Buttons } from "../../Utils";

const MainProfile = ({
	userType,
	handleSubmit,
	loading,
	stateData,
	textChange,
	images,
	setImages,
}) => {
	let handleChangeImage = e => {
		const file = e.target.files[0];
		let err = "";

		if (!file) return (err = `File, ${file?.name} does not exist`);
		if (!file.type.includes("image"))
			return (err = `File, ${file?.name} format not supported`);

		if (err) {
			return toast.error(err);
		} else {
			setImages(file);
		}
	};

	return (
		<Container className="px-lg-5">
			<div className="row g-4">
				<div className="col-lg-6">
					<div className="mx-auto position-relative">
						<img
							src={
								images
									? URL.createObjectURL(images)
									: stateData?.avatar
									? stateData?.avatar?.url
									: user
							}
							alt={stateData?.fullName}
							style={{
								height: "15rem",
								width: "15rem",
							}}
							className="rounded-circle img-fluid mx-auto"
						/>
						<div className="file_upload d-flex myCursor mt-auto">
							<BsUpload
								size={22}
								title="Upload image"
								className="mx-2 myCursor statusIcon"
							/>
							<input
								title="Upload file"
								type="file"
								name="file"
								id="file"
								multiple
								className="myCursor"
								accept="image/*"
								onChange={handleChangeImage}
							/>
						</div>
						{images && (
							<Buttons
								onClick={handleSubmit("profile-image")}
								loading={images && loading}
								css="btn btn-primary1 text-capitalize py-3 w-50 d-block me-auto my-4"
								width={"w-50"}
								title={"Update profile image"}
							/>
						)}
					</div>
					{userType && (
						<div className="mx-auto mt-5">
							<div
								className="rounded bg-grey"
								style={{
									height: "15rem",
									width: "15rem",
								}}></div>
							<p className="pt-3">C.A.C.</p>
						</div>
					)}
				</div>
				<form className="col-lg-6">
					<div className="w-75">
						<div className="form-floating mb-4">
							<input
								type="text"
								required
								name="lastNname"
								className="form-control bg-grey"
								placeholder="First name"
								value={stateData.lastName}
								onChange={textChange("lastName")}
							/>
							<label htmlFor="lastNname">First name</label>
						</div>
						<div className="form-floating mb-4">
							<input
								type="text"
								required
								name="firstNname"
								className="form-control bg-grey"
								placeholder="Last name"
								value={stateData.firstName}
								onChange={textChange("firstName")}
							/>
							<label htmlFor="firstNname">First name</label>
						</div>
						<div className="form-floating mb-4">
							<input
								type="email"
								required
								name="email"
								className="form-control bg-grey"
								placeholder="Email"
								value={stateData.email}
								onChange={textChange("email")}
							/>
							<label htmlFor="email">Email</label>
						</div>
						<div className="form-floating mb-4">
							<input
								type="tel"
								required
								name="phone"
								className="form-control bg-grey"
								placeholder="Phone Number"
								value={stateData.phone}
								onChange={textChange("phone")}
							/>
							<label htmlFor="Phone Number">Phone Number</label>
						</div>
						<Buttons
							onClick={handleSubmit("profile")}
							loading={!images && !stateData?.newPassword && loading}
							css="btn btn-primary1 text-capitalize py-3 w-50 d-block mx-auto my-4"
							width={"w-50"}
							title={"Update profile"}
						/>
						<div className="form-floating mb-4">
							<input
								type="password"
								required
								name="password"
								className="form-control bg-grey"
								placeholder="Old Password"
								value={stateData.oldPassword}
								onChange={textChange("oldPassword")}
							/>
							<label htmlFor="Old Password">Old Password</label>
						</div>
						<div className="form-floating mb-4">
							<input
								type="password"
								required
								name="password"
								className="form-control bg-grey"
								placeholder="New Password"
								value={stateData.newPassword}
								onChange={textChange("newPassword")}
							/>
							<label htmlFor="New Password">New Password</label>
						</div>

						<Buttons
							onClick={handleSubmit("change-password")}
							loading={stateData?.newPassword && loading}
							css="btn btn-primary1 text-capitalize py-3 w-50 d-block mx-auto my-4"
							width={"w-50"}
							title={"change password"}
						/>
					</div>
				</form>
			</div>
		</Container>
	);
};

export default MainProfile;
