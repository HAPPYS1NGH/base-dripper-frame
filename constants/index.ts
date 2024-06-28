import { formatEther } from "viem";
import { abi } from "./abi";
import { baseSepolia } from "./address";

export const config = {
    "base-sepolia": {
        address: baseSepolia,
        abi,
    },
};

export const replyMessageError = (error: string) => {
    if (error === "no-fid") {
        return `No FID found in the message`;
    }
    if (error == "no-address") {
        return `No Verified Address found for this FID`;
    }
    if (error === "not-found") {
        return `Guide:
  \n 1. You can only get faucet once in 24 hours.
  \n 2. You should have a verified address to get the faucet.
    \n 3. You can get 0.01 ETH per claim.
    \n 4. If problem persists, use faucetbot on Warpcast.`;
    }
    if (error === "already-dripped-to-address") {
        return `You have already received funds in the last 24 hours, so not transferring to the Address\t `;
    }
    if (error === "already-dripped-to-fid") {
        return `You have already received funds in the last 24 hours, so not transferring to the FID\t `;
    }
    if (error === "enough-funds") {
        return `You already have more than 1 ETH, so not transferring.`;
    }
    if (error === "error-sending-transaction") {
        return `Error sending transaction \n
    Meanwhile you can see the faucet Aggregator from here -> https://faucet-frames.vercel.app/api`;
    }
    else {
        return ` \n 1. You can only get faucet once in 24 hours.
    \n 2. You should have a verified address to get the faucet.
      \n 3. You can get 0.1 ETH per claim.
      \n 4. If problem persists, use faucetbot on Warpcast.`;
    }
};

export const replyMessageSuccess = (
    network: string,
    amount: bigint,
    hash: string
) => {
    const amountInEth = formatEther(amount, "wei");
    if (network === "base-sepolia") {
        return `${amountInEth} ETH transferred successfully. Hash: https://sepolia.basescan.org/tx/${hash}`;
    }
    else {
        return `ERROR FOUND`;
    }
};
