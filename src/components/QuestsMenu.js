import React from "react";
import QuestMenuItem from "./QuestMenuItem.js";
import QuestEmailCollection from "./QuestEmailCollection";

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
			<QuestEmailCollection />
		</div>
	);
};

export default QuestsMenu;
