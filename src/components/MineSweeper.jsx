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

	const [grid, setGrid] = useState([]); // Global
	const [isGameReady, setIsGameReady] = useState(false);

	function initializeGrid(n, m) {
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
		// Validation for safety
		if (!(x >= 0 && x < grid.length && y >= 0 && y < grid[0].length)) {
			console.log("Invalid Piece");
			return;
		}

		let placeHolderGrid = JSON.parse(JSON.stringify(grid)); // Deep copy
		placeHolderGrid[x][y][0] = PieceStates.Open;

		setGrid(placeHolderGrid);
	}

	const buttonClasses =
		"p-1 border-2 border-sky-400 bg-slate-800 text-sky-400 hover:border-slate-600 hover:bg-sky-200 hover:text-slate-800";

	/*	TODO:
	- Reveal around 0
	- Add End Conditions
	- Better UI
	- 
	*/

	const drawGrid = () => {
		return (
			<div
				className={`w-fit h-fit border-2 p-4 border-white bg-slate-700 flex flex-col justify-center items-center gap-2`}
			>
				{grid.map((row, rowIndex) => {
					return (
						<div
							className="w-full h-full p-1 flex flex-row gap-1 justify-center items-center"
							key={rowIndex}
						>
							{row.map((col, colIndex) => {
								return (
									<button
										onClick={() => {
											RevealPiece(rowIndex, colIndex);
										}}
										className={
											"w-[40px] h-[40px] p-1 mx-auto" +
											buttonClasses +
											(col[0] === PieceStates.Open)
												? " bg-white text-black"
												: " "
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
			<h1>Mine Sweeper</h1>
			<button
				onClick={() => {
					initializeGrid(15, 15);
				}}
				className={buttonClasses}
			>
				Initialize Grid
			</button>
			<button
				onClick={() => {
					plantMines(0.3);
				}}
				className={buttonClasses}
			>
				Plant Mines
			</button>

			<div className="min-h-screen w-full flex justify-center">
				{isGameReady && drawGrid()}
			</div>
		</div>
	);
}
