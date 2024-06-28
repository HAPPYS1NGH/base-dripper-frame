import {
  baseClient,
  baseSepoliaClient,
  mainnetClient,
} from "@/utils/client";
import { formatEther } from "viem";

async function getBalance(address: string, chain: string) {
  let client;
  switch (chain) {
    case "mainnet":
      client = mainnetClient;
      break;
    case "base":
      client = baseClient;
      break;
    case "base-sepolia":
      client = baseSepoliaClient;
      break;
    default:
      throw new Error(`Unsupported chain ${chain}`);
  }
  const balance = await client.getBalance({
    address: address as `0x${string}`,
  });
  const balanceAsEther = formatEther(balance);
  return balanceAsEther;
}

// Function to return false if the user has new account
export async function isNewAccount(address: string, network: string) {
  try {

    const l2Balance = await getBalance(address, network.split("-")[0]);
    const mainnetBalance = await getBalance(address, "mainnet");
    return (
      parseFloat(l2Balance) < 0.001 && parseFloat(mainnetBalance) < 0.001
    );
  } catch (error) {
    console.error("Error in isNewAccount", error);
    return false;
  }
}