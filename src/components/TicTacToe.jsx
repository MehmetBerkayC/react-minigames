import React from "react";
import { useState } from "react";

export default function TicTacToe() {
	// Enum-likes
	const PieceStates = Object.freeze({
		EMPTY: "Empty",
		X: "X",
		Y: "Y",
	});

	const GameEndStates = Object.freeze({
		NONE: null,
		X: "X",
		Y: "Y",
		Tie: "Tie",
	});

	/* 
			Required States
			- Player Turn
			- Board State -> Button/Piece States -> FOR EACH BUTTON or just an array of pieceStates
			- Game Start/End
		*/
	const [didGameStart, setDidGameStart] = useState(false);
	const [isGameOver, setIsGameOver] = useState(false); // Change
	const [gameBoard, setGameBoard] = useState(null); /* pieces array */
	const [turnOfX, setTurnOfX] = useState(true);
	const [gameEndState, setGameEndState] = useState(GameEndStates.NONE);

	// Game Functionality
	function startGame() {
		setDidGameStart(true);

		// reset states
		setTurnOfX(true);
		setIsGameOver(false);

		// begin the game
		initializeGameBoard();
	}

	function initializeGameBoard() {
		let newGameBoard = new Array(9);
		for (let i = 0; i < newGameBoard.length; i++) {
			newGameBoard[i] = PieceStates.EMPTY;
		}

		setGameBoard(newGameBoard);
		// console.log("Beginning the game with board: ", newGameBoard);
	}

	function switchTurn() {
		// Check Win Conditions this needs to run each frame start or variable change, maybe useeffect?
		checkIsGameOver();

		setTurnOfX(!turnOfX); // Switch sides
	}

	const isBoardFull = () => {
		// console.log("--------- Full Board Check --------");
		// If empty piece present returns true
		return !gameBoard.some((piece) => piece === PieceStates.EMPTY);
	};

	function checkIsGameOver() {
		// console.log("Checking gameover!");

		if (isBoardFull()) {
			setIsGameOver(true);
			setGameEndState(GameEndStates.Tie);
			// console.log("Game ends by Tie");
		}

		// ROWS
		// 1st row - 0 1 2
		isConditionsMetAtPositions(0, 1, 2);
		// 2nd row - 3 4 5
		isConditionsMetAtPositions(3, 4, 5);
		// 3rd row - 6 7 8
		isConditionsMetAtPositions(6, 7, 8);

		// COLS
		// 1st col - 0 3 6
		isConditionsMetAtPositions(0, 3, 6);
		// 2nd col - 1 4 7
		isConditionsMetAtPositions(1, 4, 7);
		// 3rd col - 2 5 8
		isConditionsMetAtPositions(2, 5, 8);

		// DIAGONALS
		// left diag - 0 4 8
		isConditionsMetAtPositions(0, 4, 8);
		// right diag - 2 4 6
		isConditionsMetAtPositions(2, 4, 6);
	}

	function isConditionsMetAtPositions(x, y, z) {
		if (
			gameBoard[x] !== PieceStates.EMPTY &&
			gameBoard[x] === gameBoard[y] &&
			gameBoard[y] === gameBoard[z]
		) {
			// alert(`${gameBoard[x]} +  Wins!`); // can change later onto something else
			setIsGameOver(true);
			const winner =
				gameBoard[x] == GameEndStates.X
					? GameEndStates.X
					: GameEndStates.Y;
			setGameEndState(winner);
			// console.log("Game Ends by Win");
		}
	}

	function handlePieceClick(pieceIndex) {
		// Game is on
		if (!didGameStart || isGameOver) return;

		// Check button availability
		if (gameBoard[pieceIndex] !== PieceStates.EMPTY) return;

		// Play turn
		// console.log("Clicked on a active piece!");

		let currentGameBoard = gameBoard;

		if (turnOfX) {
			currentGameBoard[pieceIndex] = PieceStates.X;
		} else {
			currentGameBoard[pieceIndex] = PieceStates.Y;
		}

		// Update Board
		// console.log("Updating board, on next frame:", gameBoard);
		setGameBoard(currentGameBoard);

		// Next turn
		switchTurn();
	}

	function playAgain() {
		if (!isGameOver) return;

		startGame();
	}

	// Component
	function PinkButton(props) {
		const { onClickFunc = () => {}, extraClass = "", text = "" } = props;

		return (
			<button
				onClick={onClickFunc}
				className={`m-auto p-4 border-2 rounded-2xl border-pink-800 bg-slate-800 font-semibold text-xl sm:text-2xl lg:text-3xl text-white hover:bg-slate-200 hover:text-pink-700 ${extraClass}`}
			>
				{text}
			</button>
		);
	}

	// console.log(board);
	// CSS Breakpoints -> default sm lg
	return (
		<div className="flex flex-col items-center justify-center h-screen gap-4">
			{!didGameStart && (
				<PinkButton onClickFunc={startGame} text="Play Tic-Tac-Toe" />
			)}
			{didGameStart && (
				<>
					<h1 className="border-4 border-pink-800 rounded-xl p-4 text-center bg-slate-800 text-white text-xl sm:text-3xl lg:text-5xl">
						{!isGameOver
							? `${turnOfX ? "X" : "Y"}'s Turn`
							: `${
									gameEndState !== GameEndStates.Tie
										? gameEndState + " Wins!"
										: "Tie"
							  }`}
					</h1>
					<div className="grid grid-cols-3 gap-4 border-16 border-y-pink-950 bg-slate-800 p-4">
						{gameBoard.map((piece, pieceIndex) => {
							return (
								<div
									key={pieceIndex}
									className="flex items-center justify-center"
								>
									<button
										onClick={() => {
											handlePieceClick(pieceIndex);
										}}
										className="w-[50px] sm:w-[100px] lg:w-[150px] h-[50px] sm:h-[100px] lg:h-[150px] bg-slate-900 hover:bg-pink-200 active:scale-150 duration-300"
									>
										<p className="font-bold text-2xl sm:text-4xl lg:text-6xl text-white hover:text-pink-800 border-4 border-pink-700 w-full h-full flex items-center justify-center">
											{
												/*pieceIndex + " " + */ piece !==
												PieceStates.EMPTY
													? piece
													: ""
											}
										</p>
									</button>
								</div>
							);
						})}
					</div>
				</>
			)}
			{isGameOver && (
				<div>
					<PinkButton onClickFunc={playAgain} text="Play Again" />
				</div>
			)}
		</div>
	);
}
