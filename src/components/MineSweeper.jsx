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

	const horizontalMin = 3;
	const horizontalMax = 22;
	const verticalMin = 3;
	const verticalMax = 17;
	const minMineDensity = 0.1;
	const maxMineDensity = 0.9;

	const [grid, setGrid] = useState([]);
	const [mineDensity, setMineDensity] = useState(0.2);
	const [vertical, setVertical] = useState(3);
	const [horizontal, setHorizontal] = useState(3);
	const [totalMines, setTotalMines] = useState(0);

	const [unrevealedPieces, setUnrevealedPieces] = useState(0);

	const [isGridInitialized, setIsGridInitialized] = useState(false);
	const [isGameRenderReady, setIsGameRenderReady] = useState(false);
	const [isGameOver, setIsGameOver] = useState(true);

	function initializeGrid() {
		let placeHolderGrid = [];

		// ORDER in piece -> [PieceState, PieceInfo, NeighbourInfo]
		for (let x = 0; x < vertical; x++) {
			// row
			placeHolderGrid.push([]);
			for (let y = 0; y < horizontal; y++) {
				// col
				placeHolderGrid[x].push([
					PieceStates.Closed,
					PieceInfo.Empty,
					0,
				]); // Change to
			}
		}
		// console.log("Initial grid:", placeHolderGrid);

		setUnrevealedPieces(vertical * horizontal);
		setGrid(placeHolderGrid);
		setIsGridInitialized(true);
	}

	function resetGameStates() {
		setUnrevealedPieces(0);
		setTotalMines(0);
		setIsGridInitialized(false);
		setIsGameOver(true);
		// // Can't reset below until I make some other render option
		// setIsGameRenderReady(false);
		// setGrid([]);
	}

	function checkSizeValidity(value, isVertical) {
		if (isVertical) {
			// Valid X
			setVertical(
				value < verticalMin
					? verticalMin
					: value <= verticalMax
					? value
					: verticalMax
			);
		} else {
			// Valid Y
			setHorizontal(
				value < horizontalMin
					? horizontalMin
					: value <= horizontalMax
					? value
					: horizontalMax
			);
		}
	}

	function plantMines() {
		let placeHolderGrid = JSON.parse(JSON.stringify(grid)); // Deep copy

		const rows = grid.length;
		const cols = grid[0].length;

		const amountOfMinesToPlant = Math.round(
			rows *
				cols *
				(minMineDensity > mineDensity
					? minMineDensity
					: maxMineDensity < mineDensity
					? maxMineDensity
					: mineDensity)
		);
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
		let placeholderGrid = JSON.parse(JSON.stringify(grid)); // Deep copy
		const piece = placeholderGrid[x][y];

		// Already Open
		if (piece[0] === PieceStates.Open) return;

		// Open all 0's when clicked on a 0
		if (piece[2] === 0 && piece[1] != PieceInfo.Mine) {
			// x-y, placeholderGrid, 0
			floodFill(x, y, placeholderGrid, 0);
		} else {
			piece[0] = PieceStates.Open;

			setUnrevealedPieces((prev) => prev - 1);
			setGrid(placeholderGrid);
		}

		// Game Conditions
		if (piece[1] === PieceInfo.Mine) {
			// Loss
			alert("You Lost!");
			resetGameStates();
		}

		console.log(
			totalMines,
			unrevealedPieces,
			" TotalMines, UnrevealedPieces"
		);
		if (totalMines === unrevealedPieces) {
			// Win
			alert("You Win!");
			resetGameStates();
		}
	}

	// current piece indexes, grid itself, searching for which neighbourInfo
	function floodFill(x, y, placeholderGrid, neighbourInfoToReveal) {
		// TRY BFS NEXT
		const visited = new Set();
		let revealedPiecesCount = 0;

		// This function being nested bad for long-term
		function searchDFS(x, y) {
			/*
			DFS - Recursive Function
			- Check Boundaries
			-> Current piece is not a mine, not open, not visited, Inbounds of the grid 
				-> Reveal
				-> call neighbours if we are 0
			-> Off Limits
				-> Go back/stop
			*/
			const key = `${x},${y}`; // Store x-y pairs

			// Bounds and Visited Already Check
			if (
				x < 0 ||
				x >= placeholderGrid.length ||
				y < 0 ||
				y >= placeholderGrid[0].length ||
				visited.has(key)
			) {
				return;
			}

			// Validity
			const piece = placeholderGrid[x][y];
			if (piece[0] === PieceStates.Open && piece[1] === PieceInfo.Mine) {
				return;
			}

			visited.add(key);
			piece[0] = PieceStates.Open;
			revealedPiecesCount++;

			// Call neighbours if we are 0
			if (piece[2] === neighbourInfoToReveal) {
				searchDFS(x + 1, y);
				searchDFS(x + 1, y - 1);
				searchDFS(x + 1, y + 1);
				searchDFS(x - 1, y);
				searchDFS(x - 1, y + 1);
				searchDFS(x - 1, y - 1);
				searchDFS(x, y + 1);
				searchDFS(x, y - 1);
			}
		}

		// Update
		searchDFS(x, y);
		setUnrevealedPieces((prev) => prev - revealedPiecesCount);
		setGrid(placeholderGrid);
	}

	/*	TODO:
	- Reveal around 0 - DONE -> Suboptimal
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

	const buttonBackground = " bg-slate-700 ";
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
				<p className="text-xl text-center">
					Enter Grid Properties &rarr; Max {horizontalMax}x
					{verticalMax}
				</p>
				<div className="flex flex-row gap-3">
					<label htmlFor="grid-horizontal" className="text-xl">
						Width:
					</label>
					<input
						className={`${inputClass}`}
						id="grid-horizontal"
						name="grid-horizontal"
						type="number"
						onChange={(e) =>
							checkSizeValidity(e.target.value, false)
						}
						placeholder="3"
					/>
					<label htmlFor="grid-vertical" className="text-xl">
						Height:
					</label>
					<input
						className={`${inputClass}`}
						id="grid-vertical"
						name="grid-vertical"
						type="number"
						min={3}
						max={22}
						step={1}
						onChange={(e) =>
							checkSizeValidity(e.target.value, true)
						}
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
					{isGameOver ? "Start Game" : "Play Again"}
				</button>
			</div>
			<div className="min-h-screen w-full flex justify-center">
				{isGameRenderReady && drawGrid()}
			</div>
		</div>
	);
}
