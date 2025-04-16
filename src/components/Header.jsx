import React from "react";
import { NavLink } from "react-router-dom";

export default function Header() {
	const textBreakpoints = " text-base sm:text-lg md:text-xl ";
	const smallTextBreakpoints = " text-sm sm:text-base md:text-lg ";

	return (
		<header className="w-full h-16 bg-gradient-to-b from-transparent to-15% to-white rounded-t-2xl border-b-2 shadow-sm ">
			<nav className="h-full flex justify-between items-center px-4 md:px-8">
				<h1 className={textBreakpoints + " font-bold "}>
					<span className="bg-clip-text text-transparent bg-gradient-to-r from-black via-40% via-amber-700 to-amber-500">
						MinigameWardrobe
					</span>
				</h1>
				<ul className={"flex gap-4 " + smallTextBreakpoints}>
					<li className="cursor-pointer hover:underline">
						<NavLink
							to={"/"}
							className={({ isActive }) =>
								`${
									isActive
										? " text-amber-700 "
										: " text-slate-800 "
								}`
							}
						>
							<p>Home</p>
						</NavLink>
					</li>
					<li className="cursor-pointer hover:underline">
						<NavLink
							to={"/menu"}
							className={({ isActive }) =>
								`${
									isActive
										? " text-amber-700 "
										: " text-slate-800 "
								}`
							}
						>
							<p>Minigame Menu</p>
						</NavLink>
					</li>
				</ul>
			</nav>
		</header>
	);
}
