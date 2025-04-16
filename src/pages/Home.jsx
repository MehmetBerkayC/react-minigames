import React from "react";
import Header from "../components/Header";
import Hero from "../components/Hero";
import Footer from "../components/Footer";

export default function Home() {
	const screenSizes = " max-w-lg md:max-w-2xl lg:max-w-5xl ";

	return (
		<div className="w-screen min-h-screen background-with-tint-1 flex flex-col items-center">
			<div
				className={screenSizes + " w-full px-4 flex flex-col flex-grow"}
			>
				<Header />
				<main className="flex flex-grow">
					<Hero />
				</main>
				<Footer />
			</div>
		</div>
	);
}
