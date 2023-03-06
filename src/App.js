import "./index.css";
import QuestsHero from "./components/QuestsHero";
import QuestsMenu from "./components/QuestsMenu";
import { ChainId, ThirdwebProvider } from "@thirdweb-dev/react";
import QuestBottomImage from "./components/QuestBottomImage";

function App() {
	return (
		<ThirdwebProvider activeChain={ChainId.Mumbai}>
			<div className="App">
				<QuestsHero />
				<QuestsMenu />
			</div>
			<QuestBottomImage />
		</ThirdwebProvider>
	);
}

export default App;
