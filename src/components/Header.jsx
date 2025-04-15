import React from "react";
import { NavLink } from "react-router-dom";

export default function Header() {
	return (
		<header className="w-full h-16 bg-white border-b shadow-sm ">
			<nav className="h-full flex justify-between items-center px-4 md:px-8">
				<h1 className="text-lg font-bold">MinigameWardrobe</h1>
				<ul className="flex gap-4 text-sm md:text-base">
					<li className="cursor-pointer hover:underline">
						<NavLink to={"/"}>
							<p>Home</p>
						</NavLink>
					</li>
					<li className="cursor-pointer hover:underline">
						<NavLink to={"/menu"}>
							<p>Game Menu</p>
						</NavLink>
					</li>
				</ul>
			</nav>
		</header>
	);
}
