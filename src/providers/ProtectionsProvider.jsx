import React, { useState } from "react";

import { ProtectionsContext } from "../components/contexts";

const ProtectionsProvider = ({ children }) => {

	const [isShowPasswordInput, setIsShowPasswordInput] = useState(false);

	const protectionsValues = {
		isShowPasswordInput,
		setIsShowPasswordInput,
	};

	return (
		<ProtectionsContext.Provider value={protectionsValues}>
			{isShowPasswordInput && (
				<div className="fixed inset-0 flex flex-col items-center bg-opacity-80 justify-center bg-black z-50">
					
				</div>
			)}
			{children}
		</ProtectionsContext.Provider>
	);
};

export default ProtectionsProvider;