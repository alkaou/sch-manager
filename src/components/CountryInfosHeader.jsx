import React from "react";
import { textToUppercase } from "../utils/helpers";

export default function CountryInfosHeader({
	Head_language = "Français",
	centerType = "CAP",
	school_name = "Groupe Scolaire Alkaou Dembele",
	school_short_name = "GSAD",
	school_zone_name = "SAN",
	padding = "p-2",
	margLeft = "ml-2",
}) {
	return (
		<>
			<div className={`flex justify-between text-center ${padding}`}>
				<div className="uppercase font-bold">
					{Head_language === "Français" ? "Ministère de l'éducation nationale" :
						Head_language === "Anglais" ? "Ministry of National Education" :
							"Jamana Kalan Minisiriso"
					}
				</div>
				<div>
					<div className="uppercase font-bold">
						{Head_language === "Français" ? "République du Mali" :
							Head_language === "Anglais" ? "Republic of Mali" :
								"Mali Fasojamana"}
					</div>
					<div className="text-sm">
						{Head_language === "Français" ? "Un peuple-Un but-Une foi" :
							Head_language === "Anglais" ? "One people-One goal-One faith" :
								`Jamakulu kelen-Hakilina kelen-${textToUppercase("ɲ")}aniya kelen`}
					</div>
				</div>
			</div>

			<div className="-mt-4">
				<div className="ml-20">************</div>

				{centerType ?
					(
						<>
							<div className={`${margLeft} uppercase font-bold`}>
								{centerType === "CAP" ?
									(Head_language === "Français" ? "Direction nationale de l'enseignement fondamental" :
										Head_language === "Anglais" ? "National Directorate of Basic Education" :
											"Kalan Jɔyɔrɔ Fɔlɔ Kuntigiya") :
									(Head_language === "Français" ? "CENTRE NATIONAL DES EXAMENS ET CONCOURS DE L'EDUCATION" :
										Head_language === "Anglais" ? "NATIONAL CENTER FOR EDUCATION EXAMS AND COMPETITIONS" :
											"KALAN SƐGƐSƐGƐLI NI KONKURU KUNTIGIYA")
								}
							</div>
							<div className="ml-20">************</div>
							<div className={`${margLeft} uppercase font-bold`}>
								{centerType === "CAP" ?
									(Head_language === "Français" ? "Centre d'animation pédagogique de" :
										Head_language === "Anglais" ? "Pedagogical Animation Center of" :
											"Kalan Kɛcogo Jɔyɔrɔ") :
									(Head_language === "Français" ? "ACADEMIE D'ENSEIGNEMENT DE" :
										Head_language === "Anglais" ? "TEACHING ACADEMY OF" :
											"KALAN JƆYƆRƆ")
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