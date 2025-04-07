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
	const [mineDensity, setMineDensity] = useState(0.3);
	const [dimensionX, setDimensionX] = useState(3);
	const [dimensionY, setDimensionY] = useState(3);
	const [totalMines, setTotalMines] = useState(0);
	const [unrevealedPieces, setUnrevealedPieces] = useState(0);

	const [isGridInitialized, setIsGridInitialized] = useState(false);
	const [isGameRenderReady, setIsGameRenderReady] = useState(false);
	const [isGameOver, setIsGameOver] = useState(false);

	function initializeGrid() {
		resetGameStates();
		let placeHolderGrid = [];

		// ORDER in piece -> [PieceState, PieceInfo, NeighbourInfo]
		for (let x = 0; x < dimensionX; x++) {
			// row
			placeHolderGrid.push([]);
			for (let y = 0; y < dimensionY; y++) {
				// col
				placeHolderGrid[x].push([
					PieceStates.Closed,
					PieceInfo.Empty,
					0,
				]); // Change to
			}
		}
		// console.log("Initial grid:", placeHolderGrid);

		setUnrevealedPieces(dimensionX * dimensionY);
		setGrid(placeHolderGrid);
		setIsGridInitialized(true);
	}

	function resetGameStates() {
		setIsGameRenderReady(false);
		setIsGameOver(false);
	}

	function plantMines() {
		let placeHolderGrid = JSON.parse(JSON.stringify(grid)); // Deep copy

		const rows = grid.length;
		const cols = grid[0].length;

		const amountOfMinesToPlant = Math.round(rows * cols * mineDensity);
		setTotalMines(amountOfMinesToPlant);

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
				piece = resetPiece(piece);

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
		setIsGameRenderReady(true);
		setIsGameOver(false);
	}

	function resetPiece(piece) {
		if (piece) {
			piece[0] = PieceStates.Closed;
			piece[1] = PieceInfo.Empty;
			piece[2] = 0;
		}
		return piece;
	}

	function revealPiece(x, y) {
		if (isGameOver) return;

		// Validation for safety
		if (!(x >= 0 && x < grid.length && y >= 0 && y < grid[0].length)) {
			console.log("Invalid Piece");
			return;
		}

		// Reveal Piece
		let placeHolderGrid = JSON.parse(JSON.stringify(grid)); // Deep copy
		placeHolderGrid[x][y][0] = PieceStates.Open;

		setUnrevealedPieces(unrevealedPieces - 1);
		setGrid(placeHolderGrid);

		// Game Conditions
		if (placeHolderGrid[x][y][1] === PieceInfo.Mine) {
			// Loss
			console.log("You Lost!");
			setIsGameOver(true);
		}

		if (totalMines === unrevealedPieces) {
			// Win
			console.log("You Win!");
			setIsGameOver(true);
		}
	}

	/*	TODO:
	- Reveal around 0
	- Flagging
	- Better UI : DONE
	- Better Gameplay Loop
		* Grid Initialization : DONE
		* Grid Sizing and Mine Density : DONE
		* Game Conditions : DONE
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
											revealPiece(rowIndex, colIndex);
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

	const inputClass =
		"border border-sky-800 w-[50px] rounded-sm bg-white text-center";
	return (
		<div>
			<h1 className="text-3xl text-center font-semibold mt-5">
				Mine Sweeper
			</h1>
			<div className="flex flex-col gap-2 justify-center items-center m-3">
				<p className="text-xl text-center">Enter Grid Properties</p>
				<div className="flex flex-row gap-3">
					<label htmlFor="grid-dimensions-x" className="text-xl">
						X:
					</label>
					<input
						className={`${inputClass}`}
						id="grid-dimensions-x"
						name="grid-x"
						type="number"
						min={3}
						max={50}
						step={1}
						onChange={(e) => setDimensionX(e.target.value)}
						placeholder="3"
					/>
					<label htmlFor="grid-dimensions-y" className="text-xl">
						Y:
					</label>
					<input
						className={`${inputClass}`}
						id="grid-dimensions-y"
						name="grid-y"
						type="number"
						min={3}
						max={50}
						step={1}
						onChange={(e) => setDimensionY(e.target.value)}
						placeholder="3"
					/>
					<label htmlFor="mine-density" className="text-xl">
						Mine Density:
					</label>
					<input
						className={`${inputClass}`}
						id="mine-density"
						name="mine-density"
						type="number"
						min={0.1}
						step={0.05}
						max={0.9}
						onChange={(e) => setMineDensity(e.target.value)}
						placeholder="0.3"
					/>
				</div>
			</div>
			<div className="flex flex-row items-center justify-center gap-5 m-5">
				<button
					onClick={() => {
						initializeGrid();
					}}
					className={
						buttonClassActive +
						" p-2 rounded-xl " +
						(isGridInitialized && !isGameOver ? " hidden " : "")
					}
				>
					Initialize Grid
				</button>
				<button
					onClick={() => {
						plantMines();
					}}
					className={
						buttonClassActive +
						" p-2 rounded-xl " +
						(isGridInitialized ? "" : " hidden ")
					}
				>
					{!isGameOver ? "Start Game" : "Play Again"}
				</button>
			</div>
			<div className="min-h-screen w-full flex justify-center">
				{isGameRenderReady && drawGrid()}
			</div>
		</div>
	);
}
