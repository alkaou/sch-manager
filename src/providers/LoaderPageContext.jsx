import React, { useState } from "react";

import { LoaderPageContext } from "../components/contexts";

const LoaderPageProvider = ({ children }) => {
	const [isLoading, setIsLoading] = useState(true);
	const [typeLoader, setTypeLoader] = useState(0);

	return (
		<LoaderPageContext.Provider value={{ isLoading, setIsLoading, setTypeLoader, typeLoader }}>
			{isLoading && (
				<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-100">
					<span className="loading loading-ring loading-lg"></span>
				</div>
			)}
			{children}
		</LoaderPageContext.Provider>
	);
};

export default LoaderPageProvider;