import React from "react";

export default function Footer() {
	return (
		<footer className="py-4 text-white text-xs md:text-sm bg-gradient-to-b from-amber-600 to-black border-t w-full text-center font-bold">
			<p> &copy; {new Date().getFullYear()} MinigameWardrobe</p>
		</footer>
	);
}
