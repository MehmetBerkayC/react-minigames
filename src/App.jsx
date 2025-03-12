import TicTacToe from "./components/TicTacToe";

function App() {
	return (
		<main className="flex flex-col items-center justify-center min-h-screen">
			<section
				id="#tictactoe"
				className="w-[300px] sm:w-[500px] lg:w-[800px] min-h-screen bg-amber-200 flex flex-col justify-center"
			>
				<TicTacToe />
			</section>
		</main>
	);
}

export default App;
