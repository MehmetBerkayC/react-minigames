import React from "react";
import DropDownButton from "./DropDownButton";

export default function GameSelection(props) {
	const { minigamesList, setSelectedGame } = props;

	function handleSelectGame(selectedGame) {
		setSelectedGame(selectedGame); // Make sure selectedGame is returning the value not the key of the list/object
	}

	return (
		<div className="flex flex-col justify-center items-center">
			<DropDownButton
				dropDownItemsList={minigamesList}
				text={"Choose a Minigame"}
				onClickFunc={handleSelectGame}
			/>
		</div>
	);
}
