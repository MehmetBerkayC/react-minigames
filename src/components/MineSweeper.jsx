import React from "react";
import { useEffect } from "react";
import { useState } from "react";

export default function MineSweeper() {
	/*
	Grid
		[	
			[ Empty	][ Empty ][ Empty ][ Empty ][ Bomb  ]
			[ Bomb  ][ Bomb  ][ Empty ][ Empty ][ Bomb  ]
			[ Empty ][ Empty ][ Empty ][ Bomb  ][ Empty ]
			[ Bomb  ][ Empty ][ Empty ][ Empty ][ Empty	]
			[ Empty ][ Bomb  ][ Empty ][ Empty ][ Bomb  ]
		]
	
	Piece
		[PieceStatus, PieceInfo, NeighbourInfo]
		
	PieceState
		Empty - Mine

	NeighbourInfo
		Amount of mines around this piece
------------------------------------------------------------------------
	* Game Board 					-> 2D Matrix
		- [n][m] pieces matrix
		- x amount of mines
	* Piece Info 					-> Enum, FrozenObj
		-> Mine
		-> Empty
	* Neighbour Info
		-> Nearby mines amount
	* Piece Status 					-> Enum, FrozenObj
		-> Open
		-> Flagged
		-> Closed
	* Piece Actions 				-> State(boolean)
		-> Flag - (HOLD M1 or Flag Placement Mode)
		-> Open
------------------------------------------------------------------------
	* Functionality
		-/ Nearby Mines Number 		-> constant number
			-> Indexes
				- Horizontal
				[-1][0]
				[1] [0]
				- Vertical
				[0] [1]
				[0] [-1]
				- Diagonal
				[-1][1]
				[-1][-1]
				[1] [1]
				[1] [-1]
		-/ Total Mines Management
			-> Flagged Mines Management
				- Basic increment 	-> State(number)
		-/ Game End Conditions
			- Bomb stepped on 		-> State(boolean)
			- All empty pieces open -> State(boolean)
	
	*/

	const PieceInfo = Object.freeze({
		Empty: "empty",
		Mine: "mine",
	});

	const PieceStates = Object.freeze({
		Open: "open",
		Closed: "closed",
		Flagged: "flagged",
	});

	const [grid, setGrid] = useState([]);
	const [isGameReady, setIsGameReady] = useState(false);
	const [isGameOver, setIsGameOver] = useState(false);

	function initializeGrid(n, m) {
		setIsGameReady(false);
		let placeHolderGrid = [];

		// ORDER in piece -> [PieceState, PieceInfo, NeighbourInfo]
		for (let x = 0; x < n; x++) {
			// row
			placeHolderGrid.push([]);
			for (let y = 0; y < m; y++) {
				// col
				placeHolderGrid[x].push([
					PieceStates.Closed,
					PieceInfo.Empty,
					0,
				]); // Change to
			}
		}
		// console.log("Initial grid:", placeHolderGrid);

		setGrid(placeHolderGrid);
	}

	function plantMines(mineDensity) {
		let placeHolderGrid = JSON.parse(JSON.stringify(grid)); // Deep copy

		const rows = grid.length;
		const cols = grid[0].length;

		const amountOfMinesToPlant = Math.round(rows * cols * mineDensity);

		// Determine mine locations
		let flatMineGrid = new Array(rows * cols).fill(PieceInfo.Empty);
		flatMineGrid.fill(PieceInfo.Mine, 0, amountOfMinesToPlant);

		// console.log("Flat mine grid:", flatMineGrid, placeHolderGrid);

		/* b is the part we change 
		[ 	x-> rows y-> cols
			[a,b,c],[a,b,c],[a,b,c]
			[a,b,c],[a,b,c],[a,b,c]
			[a,b,c],[a,b,c],[a,b,c]
		]
		*/

		// Insert mines in grid
		for (let x = 0; x < rows; x++) {
			for (let y = 0; y < cols; y++) {
				let piece = placeHolderGrid[x][y];
				// Reset Piece
				piece = ResetPiece(piece);

				// Insert Mine
				piece[1] = flatMineGrid[x * cols + y];

				placeHolderGrid[x][y] = piece;
			}
		}

		// console.log("After mine insertion:", placeHolderGrid);

		// Shuffle
		for (let x = 0; x < rows; x++) {
			for (let y = 0; y < cols; y++) {
				// Choose a random position
				let randomRow = Math.floor(Math.random() * rows);
				let randomCol = Math.floor(Math.random() * cols);

				const randomPiece = placeHolderGrid[randomRow][randomCol];
				const piece = placeHolderGrid[x][y];

				placeHolderGrid[randomRow][randomCol] = piece;
				placeHolderGrid[x][y] = randomPiece;
			}
		}

		// Identify Danger Numbers
		for (let x = 0; x < rows; x++) {
			for (let y = 0; y < cols; y++) {
				// console.log(`At location ${x}-${y}`, placeHolderGrid[x][y]);
				const currentPiece = placeHolderGrid[x][y];

				const isMinePresentAtLocation =
					currentPiece[1] === PieceInfo.Mine;

				if (!isMinePresentAtLocation) continue; // Skip

				// Neighbour Bound Validation
				// Left
				if (x > 0) {
					placeHolderGrid[x - 1][y][2] += 1;
				}
				// Right
				if (x < rows - 1) {
					placeHolderGrid[x + 1][y][2] += 1;
				}
				// Top
				if (y > 0) {
					placeHolderGrid[x][y - 1][2] += 1;
				}
				// Bottom
				if (y < cols - 1) {
					placeHolderGrid[x][y + 1][2] += 1;
				}
				// Top Left
				if (x > 0 && y > 0) {
					placeHolderGrid[x - 1][y - 1][2] += 1;
				}
				// Bottom Left
				if (x > 0 && y < cols - 1) {
					placeHolderGrid[x - 1][y + 1][2] += 1;
				}
				// Top Right
				if (x < rows - 1 && y > 0) {
					placeHolderGrid[x + 1][y - 1][2] += 1;
				}
				// Bottom Right
				if (x < rows - 1 && y < cols - 1) {
					placeHolderGrid[x + 1][y + 1][2] += 1;
				}
			}
		}

		// console.log("After shuffle:", placeHolderGrid);
		setGrid(placeHolderGrid);
		setIsGameReady(true);
		setIsGameOver(false);
	}

	function ResetPiece(piece) {
		if (piece) {
			piece[0] = PieceStates.Closed;
			piece[1] = PieceInfo.Empty;
			piece[2] = 0;
		}
		return piece;
	}

	function RevealPiece(x, y) {
		if (isGameOver) return;

		// Validation for safety
		if (!(x >= 0 && x < grid.length && y >= 0 && y < grid[0].length)) {
			console.log("Invalid Piece");
			return;
		}

		let placeHolderGrid = JSON.parse(JSON.stringify(grid)); // Deep copy
		placeHolderGrid[x][y][0] = PieceStates.Open;

		setGrid(placeHolderGrid);
		// Check bomb
		if (placeHolderGrid[x][y][1] === PieceInfo.Mine) {
			requestAnimationFrame(() => {
				// Wait for grid visual update
				console.log("You lost!");
				setIsGameOver(true);
			});
		}
	}

	function startGame() {
		// Screen ratio max grid sizes
		const belowSmallScreenGrid = [12, 8];
		const smallToLargeScreenGrid = [20, 11];
		const aboveLargeScreenGrid = [20, 22];

		let mineDensity;

		// Compare with screen sizes
		/* 0<=640px 1<=1024px 2>=1024 */
		let screenSize;
		if (window.innerWidth <= 640) {
			screenSize = 0;
			mineDensity = 0.4;
		}
		if (window.innerWidth > 640 && window.innerWidth <= 1024) {
			screenSize = 1;
			mineDensity = 0.5;
		}
		if (window.innerWidth > 1024) {
			screenSize = 2;
			mineDensity = 0.6;
		}

		// console.log(screenSize, mineDensity);
		// Begin the game
		switch (screenSize) {
			case 0:
				initializeGrid(
					belowSmallScreenGrid[0],
					belowSmallScreenGrid[1]
				);
				break;
			case 1:
				initializeGrid(
					smallToLargeScreenGrid[0],
					smallToLargeScreenGrid[1]
				);
				break;
			case 2:
				initializeGrid(
					aboveLargeScreenGrid[0],
					aboveLargeScreenGrid[1]
				);
				break;
		}

		// Skip one frame before planting mines
		requestAnimationFrame(() => {
			plantMines(mineDensity);
		});
	}

	// Get values by usestate - input field
	// function startGameWithDimensions() {}

	/*	TODO:
	- Reveal around 0
	- Add End Conditions
	- Better UI
	*/

	// General
	const buttonHover =
		" duration-200 hover:scale-110 hover:border-sky-800 hover:bg-sky-50 hover:text-sky-800 ";
	const buttonSpacing = " p-1 ";

	const buttonText = " text-sky-400 text-sm sm:text-base lg:text-xl ";
	const buttonTextDisabled = " text-sky-500 text-sm sm:text-base lg:text-xl ";

	const buttonBackground = " bg-slate-800 ";
	const buttonBackgroundDisabled = " bg-slate-900 ";

	const buttonBorder = " border border-sky-600 ";
	const buttonBorderDisabled = " border border-sky-600";

	const buttonClassInactive =
		buttonBorderDisabled +
		buttonSpacing +
		buttonBackgroundDisabled +
		buttonTextDisabled;

	const buttonClassActive =
		buttonBorder +
		buttonSpacing +
		buttonBackground +
		buttonText +
		buttonHover;

	const drawGrid = () => {
		return (
			<div
				className={`w-fit h-fit border-2 p-4 bg-slate-900 flex flex-col justify-center items-center `}
			>
				{grid.map((row, rowIndex) => {
					return (
						<div
							className="w-full h-full flex flex-row justify-center items-center"
							key={rowIndex}
						>
							{row.map((col, colIndex) => {
								return (
									<button
										disabled={
											col[0] === PieceStates.Open
												? true
												: false
										}
										onClick={() => {
											RevealPiece(rowIndex, colIndex);
											console.log("Clicked a button!");
										}}
										className={
											"min-w-[30px] sm:w-[35px] lg:w-[40px] min-h-[30px] sm:h-[35px] lg:h-[40px] mx-auto" +
											(col[0] === PieceStates.Open
												? buttonClassInactive
												: buttonClassActive)
										}
										key={colIndex}
									>
										{col[0] === PieceStates.Closed
											? " "
											: col[1] === PieceInfo.Empty
											? col[2]
											: "X"}
									</button>
								);
							})}
						</div>
					);
				})}
			</div>
		);
	};

	useEffect(() => {
		console.clear();
	}, []);

	return (
		<div>
			<div className="flex flex-col items-center justify-center gap-5 m-5">
				<h1>Mine Sweeper</h1>
				<button
					onClick={() => {
						initializeGrid(20, 11);
					}}
					className={buttonClassActive + " p-2 rounded-xl"}
				>
					Initialize Grid
				</button>
				<button
					onClick={() => {
						startGame();
					}}
					className={buttonClassActive + " p-2 rounded-xl"}
				>
					Start Defaults
				</button>
				<button
					onClick={() => {
						plantMines(0.3);
					}}
					className={buttonClassActive + " p-2 rounded-xl"}
				>
					Plant Mines
				</button>
			</div>
			<div className="min-h-screen w-full flex justify-center">
				{isGameReady && drawGrid()}
			</div>
		</div>
	);
}
