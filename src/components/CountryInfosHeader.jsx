import React from "react";

export default function CountryInfosHeader({
	live_language,
	centerType = "CAP",
	school_name = "Groupe Scolaire Alkaou Dembele",
	school_short_name = "GSAD",
	school_zone_name="SAN",
	padding="p-2",
	margLeft="ml-2",
}) {
	return (
		<>

			<div className={`flex justify-between text-center ${padding}`}>
				<div className="uppercase font-bold">Ministère de l'éducation nationale</div>
				<div>
					<div className="uppercase font-bold">République du Mali</div>
					<div className="text-sm">Un peuple-un but-une foi</div>
				</div>
			</div>

			<div className="-mt-4">
				<div className="ml-20">************</div>

				{centerType ?
					(
						<>
							<div className={`${margLeft} uppercase font-bold`}>
								{centerType === "CAP" ?
									"Direction nationale de l'enseignement fondamental" :
									"CENTRE NATIONAL DES EXAMENS ET CONCOURS DE L'EDUCATION"
								}
							</div>
							<div className="ml-20">************</div>
							<div className={`${margLeft} uppercase font-bold`}>
								{centerType === "CAP" ?
									"Centre d'animation pédagogique de" :
									"ACADEMIE D'ENSEIGNEMENT DE"
								} {school_zone_name}
							</div>
							<div className="ml-20">************</div>
						</>
					)
					: null
				}

				<div className={`${margLeft} flex justify-between`}>
					<div className="uppercase font-bold">{school_name}</div>
					<div className="uppercase font-bold">=== {school_short_name} ===</div>
				</div>
			</div>
		</>
	);
};
