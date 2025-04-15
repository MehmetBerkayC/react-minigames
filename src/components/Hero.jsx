import React from "react";

export default function Hero() {
	return (
		<section className="w-full flex flex-col items-center justify-center py-16 text-center bg-white">
			<h1 className="text-3xl md:text-5xl font-bold mb-4">
				Welcome to MinigameWardrobe!
			</h1>
			<p className="text-base md:text-lg mb-2 max-w-xl">
				These are made entirely to practice and/or learn algorithms,
				syntax and design.
			</p>
			<p className="text-base md:text-lg max-w-xl">
				Please click the minigame menu in the navigation bar up top to
				continue.
			</p>
		</section>
	);
}
