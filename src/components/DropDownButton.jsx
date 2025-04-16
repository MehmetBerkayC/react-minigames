import React from "react";
import { useState } from "react";

export default function DropDownButton(props) {
	// THIS COMPONENT IS ONLY FOR 1 DEPTH OBJECTS, SUPPORTS NO ARRAYS OR MORE DEPTH
	// copy and/or change it to work with all similar structured arrays
	// Example:
	// use dropDownItemsList.map(func)
	// and in the handler function change to myfunc(array) instead of myfunc(obj)

	const { dropDownItemsList, onClickFunc = () => {}, text = "" } = props;

	const [toggleDropDown, setToggleDropDown] = useState(false);
	const [selectedItem, setSelectedItem] = useState(dropDownItemsList.None);

	return (
		<div className="bg-slate-800 border-2 border-black rounded-2xl">
			<button
				onClick={() => {
					setToggleDropDown(!toggleDropDown);
				}}
				className={
					`max-w-[400px] m-auto p-4 bg-slate-800 font-semibold text-xl text-white hover:bg-slate-200 hover:text-black` +
					(toggleDropDown
						? " border-b rounded-t-2xl"
						: " rounded-2xl")
				}
			>
				{selectedItem === dropDownItemsList.None
					? text === ""
						? "Select an item"
						: text
					: `${selectedItem}`}
			</button>
			<div>
				{toggleDropDown && (
					<div className="flex flex-col bg-slate-800 rounded-2xl ">
						{
							// Object.func functions are returning keys, then use the values
							Object.keys(dropDownItemsList)
								.filter(
									(itemKey) =>
										dropDownItemsList[itemKey] !==
										dropDownItemsList.None
								) // Filter first
								.map((itemKey, keyIndex, array) => {
									const isLastItem =
										keyIndex === array.length - 1;

									return (
										<button
											onClick={() => {
												setSelectedItem(
													dropDownItemsList[itemKey] //assign the value
												);
												setToggleDropDown(
													!toggleDropDown
												);
												onClickFunc(
													dropDownItemsList[itemKey]
												);
											}}
											className={
												`capitalize p-2 text-white mr-auto w-full hover:text-black hover:bg-slate-200` +
												(isLastItem
													? " rounded-b-2xl"
													: " border-b")
											}
											key={itemKey}
										>
											{dropDownItemsList[itemKey]
												.split("_")
												.join(" ")}
										</button>
									);
								})
						}
					</div>
				)}
			</div>
		</div>
	);
}
