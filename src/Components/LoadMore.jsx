import React from "react";
import { Buttons } from "../Utils";

const LoadMore = ({ handleLoadMore, next, loading }) => {
	return (
		<>
			{!next ? (
				""
			) : (
				<Buttons
					onClick={handleLoadMore}
					title="load more"
					css={"btn btn-primary1 text-uppercase my-4 mx-auto py-3"}
					width="w-50 w50"
					loading={loading}
				/>
			)}
		</>
	);
};

export default LoadMore;
