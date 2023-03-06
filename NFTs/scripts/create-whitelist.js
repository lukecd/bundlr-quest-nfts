import { ThirdwebSDK } from "@thirdweb-dev/sdk/evm";
import fs from "fs";
import csv from "csv-parser";
import Papa from "papaparse";
import { promisify } from "util";
import { ethers } from "ethers";
import dotenv from "dotenv";
dotenv.config();

// chain we're using
const blockChain = "mumbai";

// data file
const walletFiles = ["./wallets1.csv", "./wallets3.csv", "./wallets3-staff.csv"];
const readFile = promisify(fs.readFile);

// get a provider
const provider = new ethers.providers.JsonRpcProvider(process.env.ALCHEMY_API_KEY);

// get a signer
const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

// get an instance of the SDK with the signer already setup
const sdk = ThirdwebSDK.fromSigner(signer, blockChain);
const contract = await sdk.getContract("0x6a954b537ebD8477320246D47B9d6eEe51B49f0b");

const tokenId = 3;

const readCSVFile = async (emailFilePath) => {
	try {
		const fileData = await readFile(emailFilePath);
		const results = [];

		return new Promise((resolve, reject) => {
			const stream = csv()
				.on("data", (data) => results.push(data))
				.on("end", () => resolve(results))
				.on("error", (error) => reject(error));

			stream.write(fileData);
			stream.end();
		});
	} catch (error) {
		throw new Error(`Error reading file: ${error}`);
	}
};

const loadWallets = async () => {
	// read in everything
	const dataFeed = [];
	for (let i = 0; i < walletFiles.length; i++) {
		dataFeed.push(...(await readCSVFile(walletFiles[i])));
	}

	const wallets = [];
	for (let i = 0; i < dataFeed.length; i++) {
		const walletAddress = dataFeed[i].wallet_address;
		wallets.push(walletAddress);
	}

	return wallets;
};

const createWhitelist = async (wallets) => {
	// one extra sanity check to remove any duplicates
	let uniqueWallets = [...new Set(wallets)];
	console.log(`Wallet length is ${wallets.length} Unique Wallet length is ${uniqueWallets.length}`);

	// wallets has a length of 100
	const claimConditions = [
		{
			startTime: new Date(), // start the presale now
			maxClaimableSupply: uniqueWallets.length, // first 100
			price: 0.0, // sale price
			maxClaimablePerWallet: 1, // limit to one per wallet
			snapshot: uniqueWallets, // limit minting to only certain addresses
		},
	];
	console.log(`Creating claim conditions for ${uniqueWallets.length} wallet addresses`);
	await contract.erc1155.claimConditions.set(tokenId, claimConditions);
};

let wallets = await loadWallets();
wallets = [...new Set(wallets)];
let outputFile = [];
for (let i = 0; i < wallets.length; i++) {
	outputFile.push({ address: wallets[i], maxClaimable: 1 });
}
fs.writeFileSync("final-whitelist.csv", Buffer.from(Papa.unparse(outputFile)), "utf-8");

// console.log(`wallet length is ${wallets.length}`);
// await createWhitelist(wallets);
