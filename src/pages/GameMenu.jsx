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

	return (
		<div className="min-h-screen background-with-tint-2 flex flex-col items-center">
			<div className="w-full max-w-5xl px-4 flex flex-col flex-grow">
				<Header />
				<main className="flex flex-grow justify-center bg-white">
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
