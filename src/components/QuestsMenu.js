import React from "react";
import QuestMenuItem from "./QuestMenuItem.js";

const QuestsMenu = () => {
	return (
		<div id="quests-menu">
			<QuestMenuItem
				title="Quest 1: Bundlr SDK"
				description="Learn to upload arbitrary data, files and an entire website to the permaweb"
				videoLink="https://www.youtube.com/watch?v=Wxfyd0veaEc"
				tutorialLink="https://docs.bundlr.network/tutorials/bundlr-nodejs"
				nftContract=""
				live={true}
			/>
			<QuestMenuItem
				title="Quest 2: OnlyBundlr"
				description="Build a decentralized social platform for the creator economy using Bundlr, Lens Protocol and Lit Protocol"
				videoLink=""
				tutorialLink=""
				nftContract=""
				live={false}
			/>
			<QuestMenuItem
				title="Quest 3: NFT Video Game"
				description="Build an onchain NFT video game."
				videoLink=""
				tutorialLink=""
				nftContract=""
				live={false}
			/>
		</div>
	);
};

export default QuestsMenu;
