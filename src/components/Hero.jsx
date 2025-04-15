import React from "react";

export default function Hero() {
	const headlineBreakpoints = " text-2xl sm:text-3xl md:text-4xl ";
	const paragraphBreakpoints = " text-xs sm:text-sm md:text-base ";

	return (
		<section className="w-full flex flex-col items-center justify-center py-16 text-center bg-white">
			<h1 className={headlineBreakpoints + " font-bold mb-4 "}>
				Welcome to MinigameWardrobe!
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
