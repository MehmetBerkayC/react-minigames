import React from "react";
import { NavLink } from "react-router-dom";

export default function Header() {
	const textBreakpoints = " text-base sm:text-lg md:text-xl ";
	const smallTextBreakpoints = " text-sm sm:text-base md:text-lg ";

	return (
		<header className="w-full h-16 bg-white border-b shadow-sm ">
			<nav className="h-full flex justify-between items-center px-4 md:px-8">
				<h1 className={textBreakpoints + " font-bold "}>
					<span className="bg-clip-text text-transparent bg-gradient-to-r from-black via-40% via-amber-700 to-amber-500">
						MinigameWardrobe
					</span>
				</h1>
				<ul className={"flex gap-4 " + smallTextBreakpoints}>
					<li className="cursor-pointer hover:underline">
						<NavLink to={"/"}>
							<p>Home</p>
						</NavLink>
					</li>
					<li className="cursor-pointer hover:underline">
						<NavLink to={"/menu"}>
							<p>Minigame Menu</p>
						</NavLink>
					</li>
				</ul>
			</nav>
		</header>
	);
}
