import React from "react";

export default function Footer() {
	return (
		<footer className="py-4 text-sm bg-white text-gray-600 border-t w-full text-center font-bold">
			<p>{new Date().getFullYear()} MinigameWardrobe</p>
		</footer>
	);
}
