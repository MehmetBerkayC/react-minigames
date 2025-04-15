import React from "react";
import Header from "../components/Header";
import Hero from "../components/Hero";
import Footer from "../components/Footer";

export default function Home() {
	return (
		<div className="min-h-screen background-with-tint-1 flex flex-col items-center">
			<div className="w-full max-w-5xl px-4 flex flex-col flex-grow">
				<Header />
				<main className="flex flex-grow">
					<Hero />
				</main>
				<Footer />
			</div>
		</div>
	);
}
