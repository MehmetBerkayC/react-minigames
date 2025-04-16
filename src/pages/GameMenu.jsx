import React, { useState } from "react";
import Header from "../components/Header";
import TicTacToe from "../components/TicTacToe";
import MineSweeper from "../components/MineSweeper";
import Footer from "../components/Footer";
import GameSelection from "../components/GameSelection";

export default function GameMenu() {
	// Enum-ish, don't like strings
	const minigamesList = Object.freeze({
		None: "none",
		TicTacToe: "tic_tac_toe",
		MineSweeper: "mine_sweeper",
	});

	const [selectedGame, setSelectedGame] = useState(minigamesList.None);

	const screenSizes = " max-w-lg md:max-w-2xl lg:max-w-5xl ";

	return (
		<div className="w-screen min-h-screen background-with-tint-2 flex flex-col items-center">
			<div
				className={screenSizes + "w-full px-4 flex flex-col flex-grow"}
			>
				<Header />
				<main className="flex flex-grow justify-center bg-gradient-to-b from-amber-700 via-slate-100 to-amber-700">
					{selectedGame === minigamesList.None ? (
						<GameSelection
							minigamesList={minigamesList}
							selectedGame={selectedGame}
							setSelectedGame={setSelectedGame}
						/>
					) : selectedGame === minigamesList.TicTacToe ? (
						<TicTacToe />
					) : (
						<MineSweeper />
					)}
				</main>
				<Footer />
			</div>
		</div>
	);
}
