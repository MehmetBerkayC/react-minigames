import { useState } from "react";
import TicTacToe from "./components/TicTacToe";
import GameSelection from "./components/GameSelection";
import MineSweeper from "./components/MineSweeper";

function App() {
	// Enum-ish, don't like strings
	const minigamesList = Object.freeze({
		None: "none",
		TicTacToe: "tic_tac_toe",
		MineSweeper: "mine_sweeper",
	});

	const [selectedGame, setSelectedGame] = useState(minigamesList.None);

	return (
		<main className="flex flex-col items-center justify-center">
			<section className="w-[300px] sm:w-[500px] lg:w-1/2 flex flex-col justify-center min-h-screen">
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
			</section>
		</main>
	);
}

export default App;
