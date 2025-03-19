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
		[PieceStatus, PieceInfo, DangerInfo]
		
	PieceState
		Empty - Mine

	DangerInfo
		Amount of mines around this piece
------------------------------------------------------------------------
	* Game Board 					-> 2D Matrix
		- [n][m] pieces matrix
		- x amount of mines
	* Piece Info 					-> Enum, FrozenObj
		-> Mine
		-> Empty
	* Danger Info
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
	const [gridRows, setGridRows] = useState(0);

	function initializeGrid(n, m) {
		let placeHolderGrid = [];

		// ORDER in piece -> PieceState, PieceInfo, DangerInfo
		const placeHolderDangerInfo = 0;

		for (let x = 0; x < n; x++) {
			// row
			placeHolderGrid.push([]);
			for (let y = 0; y < m; y++) {
				// col
				placeHolderGrid[x].push([
					PieceStates.Open, // Change to closed
					PieceInfo.Empty,
					placeHolderDangerInfo,
				]); // Change to [PieceState, PieceInfo, DangerInfo]
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
				piece[1] = flatMineGrid[x * cols + y];
				// console.log(
				// 	"item, index:",
				// 	flatMineGrid[x * cols + y],
				// 	x * cols + y
				// );
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

		// console.log("After shuffle:", placeHolderGrid);
		setGrid(placeHolderGrid);
		setIsGameReady(true);
	}

	const buttonClasses =
		"p-1 rounded-lg border-2 border-sky-400 bg-slate-800 text-sky-400 hover:border-slate-600 hover:bg-sky-200 hover:text-slate-800";

	const gridPieceVisual = <button className={buttonClasses}>Piece</button>;
	const gridVisual = <div>Grid</div>;
	const amountOfMinesLeftVisual = <p>Amount</p>;

	useEffect(() => {
		console.clear();
	}, []);

	return (
		<div>
			<h1>Mine Sweeper</h1>
			<button
				onClick={() => {
					initializeGrid(4, 4);
					setGridRows(4);
				}}
				className={buttonClasses}
			>
				Initialize Grid
			</button>
			<button
				onClick={() => {
					plantMines(0.1);
				}}
				className={buttonClasses}
			>
				Plant Mines
			</button>

			<div className="min-h-screen w-full flex justify-center">
				{isGameReady && (
					<div
						className={`w-fit h-fit border-2 p-6 border-white bg-slate-700 flex flex-col justify-center items-center gap-2`}
					>
						{grid.map((row, index) => {
							return (
								<div
									className="w-full h-full p-1 border-2 flex flex-row gap-2 justify-center items-center"
									key={index}
								>
									{row.map((col, index) => {
										return (
											<button
												className={
													"p-1 mx-auto w-[40px} h-[40px]" +
													buttonClasses
												}
												key={index}
											>
												{col[1] === PieceInfo.Empty
													? "O"
													: "X"}
											</button>
										);
									})}
								</div>
							);
						})}
					</div>
				)}
			</div>
		</div>
	);
}
