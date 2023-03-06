import React from "react";

const QuestEmailCollection = () => {
	return (
		<div id="quest-menu-item">
			<div id="quest-menu-item-body">
				<h1>More Quests Coming Soon ...</h1>
				<h2>
					To stay up to date, follow us on{" "}
					<a id="quest-href" href="https://twitter.com/BundlrNetwork" target="_blank">
						Twitter,
					</a>{" "}
					<a id="quest-href" href="https://t.me/bundlr" target="_blank">
						Telegram,
					</a>{" "}
					<a id="quest-href" href="https://discord.gg/bundlr" target="_blank">
						Discord
					</a>{" "}
					and join our mailing list.
				</h2>
			</div>
			<form
				id="quest-menu-item-action"
				action="https://formsubmit.co/luke@bundlr.network"
				method="POST"
			>
				<input className="quest-form" type="text" name="Name" placeholder="Name" />
				<input className="quest-form" type="text" placeholder="Email" name="Email" />
				<button type="submit" className="quest-form">
					Submit
				</button>
			</form>
		</div>
	);
};

export default QuestEmailCollection;
