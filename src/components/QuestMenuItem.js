import React from "react";
import {
	ConnectWallet,
	useAddress,
	useContract,
	useClaimNFT,
	Web3Button,
	useContractWrite,
} from "@thirdweb-dev/react";
import BigNumber from "bignumber.js";

const QuestMenuItem = ({ title, description, videoLink, tutorialLink, nftContract, live }) => {
	const address = useAddress();
	const contractAddress = "0xa983A8BA20aF0E2717Aab51b37a091F80bC317e1";
	const { contract } = useContract(contractAddress, "edition-drop");
	const { mutate: claimNft, isLoading, error } = useClaimNFT(contract);
	//const tx = await contract.claimTo(address, tokenId, quantity);

	const bigInt1 = new BigNumber("1");
	console.log("BigInt bigInt1=", bigInt1.toString());

	if (error) {
		console.error("failed to claim nft", error);
	}
	return (
		<div id="quest-menu-item">
			<div id="quest-menu-item-body">
				<h1>{title}</h1>
				<h2>{description}</h2>
				<div id="quest-menu-item-links">
					{videoLink && (
						<span id="quest-menu-item-video">
							<a href={videoLink}>Video Quest</a>
							{"   "}|{"   "}
						</span>
					)}
					{tutorialLink && (
						<span id="quest-menu-item-video">
							<a href={tutorialLink}>Written Quest</a>
						</span>
					)}
				</div>
			</div>
			<div id="quest-menu-item-action">
				{live && (
					<>
						{!address && <ConnectWallet />}
						{address && (
							<Web3Button
								contractAddress={contractAddress}
								action={() => claimNft({ to: address, quantity: new BigNumber(1) })}
							>
								Claim NFT
							</Web3Button>
						)}
					</>
				)}
			</div>
			{!live && (
				<div id="quest-menu-item-overlay">
					<h1>Coming Soon ...</h1>
				</div>
			)}
		</div>
	);
};

export default QuestMenuItem;
