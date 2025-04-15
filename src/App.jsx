import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import GameMenu from "./pages/GameMenu";

function App() {
	return (
		<Routes>
			<Route path="/" element={<Home />} />
			<Route path="/menu" element={<GameMenu />} />
		</Routes>
	);
}

export default App;
