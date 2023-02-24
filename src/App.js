import logo from "./logo.svg";
import "./index.css";
import QuestsHero from "./components/QuestsHero";
import QuestsMenu from "./components/QuestsMenu";
import { ChainId, ThirdwebProvider } from "@thirdweb-dev/react";

function App() {
	return (
		<ThirdwebProvider activeChain={ChainId.Mumbai}>
			<div className="App">
				<QuestsHero />
				<QuestsMenu />
			</div>
		</ThirdwebProvider>
	);
}

export default App;
