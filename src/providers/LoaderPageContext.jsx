import React, { useState } from "react";

import { LoaderPageContext } from "../components/contexts";

const LoaderPageProvider = ({ children }) => {
	const [isLoading, setIsLoading] = useState(false);
	const [size, setSize] = useState("32");
	const [text, setText] = useState("");
	const [typeLoader, setTypeLoader] = useState(3);

	const bg_color = "bg-gradient-to-r from-blue-400 via-pink-500 to-white text-transparent animate-gradient";

	return (
		<LoaderPageContext.Provider value={{ setSize, setText, isLoading, setIsLoading, setTypeLoader, typeLoader }}>
			{isLoading && (
				<div className="fixed inset-0 flex flex-col items-center bg-opacity-80 justify-center bg-black z-50">
					{typeLoader === 0 ?
						<span className={`loading loading-ring ${bg_color} w-${size} h-${size}`}></span>
						: typeLoader === 2 ?
							<span className={`loading loading-infinity ${bg_color} w-${size} h-${size}`}></span>
							: typeLoader === 3 ?
								<span className={`loading loading-ball ${bg_color} w-${size} h-${size}`}></span>
								:
								<span className={`loading loading-dots text-white w-${size} h-${size}`}></span>

					}
					<div style={{ textAlign: "center", alignItems: "center", alignSelf: "center", fontWeight: "bold" }}>
						<p className={`${bg_color} bg-clip-text`}>{text}</p>
					</div>
				</div>
			)}
			{children}
		</LoaderPageContext.Provider>
	);
};

export default LoaderPageProvider;