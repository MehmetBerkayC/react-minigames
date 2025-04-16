import React from "react";

export default function Hero() {
	const headlineBreakpoints =
		" text-2xl sm:text-3xl md:text-4xl text-slate-800 ";
	const paragraphBreakpoints =
		" text-xs sm:text-sm md:text-base text-slate-800 ";

	return (
		<section className="w-full flex flex-col items-center justify-center py-16 text-center bg-gradient-to-b from-amber-500 via-50% via-white to-amber-500">
			<h1 className={headlineBreakpoints + " font-bold mb-4 "}>
				Welcome to{" "}
				<span className="bg-clip-text text-transparent bg-gradient-to-r from-black via-40% via-amber-700 to-amber-500">
					MinigameWardrobe!
				</span>
			</h1>
			<p className={paragraphBreakpoints + " mb-2 "}>
				These are made entirely to practice and/or learn algorithms,
				syntax and design.
			</p>
			<p className={paragraphBreakpoints}>
				Please click the minigame menu in the navigation bar up top to
				continue.
			</p>
		</section>
	);
}
