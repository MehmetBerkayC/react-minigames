import React from "react";

export default function Hero() {
	const headlineBreakpoints =
		" text-2xl md:text-3xl lg:text-4xl text-slate-800";
	const paragraphBreakpoints =
		" text-xs md:text-sm lg:text-base text-slate-800";

	return (
		<section className="flex w-full justify-center bg-gradient-to-b from-amber-700 via-slate-100 to-amber-700">
			<div className="mx-4 text-center gap-2 py-8 md:py-16 flex flex-col items-center justify-center">
				<h1 className={headlineBreakpoints + " font-bold mb-4 mx-4 "}>
					Welcome to{" "}
					<span className=" bg-clip-text text-transparent bg-gradient-to-r from-black via-40% via-amber-700 to-amber-500">
						MinigameWardrobe!
					</span>
				</h1>
				<p className={paragraphBreakpoints}>
					These are made entirely to practice and/or learn algorithms,
					syntax and design.
				</p>
				<p className={paragraphBreakpoints}>
					You might see more available games later, check it from time
					to time!
				</p>
				<p className={paragraphBreakpoints}>
					Please click the '
					<span className="font-bold text-amber-700">
						Minigame Menu
					</span>
					' in the navigation bar up top to continue.
				</p>
				<p className="max-w-md text-xs p-3 md:text-base mt-10 lg:mt-20 text-red-600 bg-slate-900 rounded-2xl mx-16 lg:mx-24">
					Currently to choose a new game, you have to refresh (F5) or
					switch between 'Home' and 'Minigame Menu' pages. This will
					be fixed later on...
				</p>
			</div>
		</section>
	);
}
