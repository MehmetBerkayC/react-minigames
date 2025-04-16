import React from "react";

export default function Footer() {
	return (
		<footer className="py-4 text-black text-xs md:text-sm bg-gradient-to-b from-white via-80% via-white to-transparent border-t-2 rounded-b-2xl border-black w-full text-center font-bold">
			<p> &copy; {new Date().getFullYear()} MinigameWardrobe</p>
		</footer>
	);
}
