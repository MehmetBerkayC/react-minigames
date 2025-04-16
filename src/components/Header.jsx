import React from "react";
import { NavLink } from "react-router-dom";

export default function Header() {
	const textBreakpoints = " text-sm md:text-lg lg:text-xl ";
	const smallTextBreakpoints = " text-xs md:text-base lg:text-lg ";

	return (
		<header className="w-full h-16 bg-gradient-to-b from-transparent to-15% to-white rounded-t-2xl border-b-2 shadow-sm ">
			<nav className="h-full flex justify-between items-center px-2 md:px-6 lg:px-10">
				<h1 className={textBreakpoints + " font-bold "}>
					<span className="bg-clip-text text-transparent bg-gradient-to-r from-black via-40% via-amber-700 to-amber-500">
						MinigameWardrobe
					</span>
				</h1>
				<ul
					className={
						"flex gap-1 md:gap-2 lg:gap-4 text-center " +
						smallTextBreakpoints
					}
				>
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
