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

// Function to return true if user Build Score less than 20
export async function isNewAccount(address: string) {
  try {
    const response = await fetch(`https://api.talentprotocol.com/api/v2/passports/${address.toLowerCase()}`, {
      method: 'GET',
      headers: {},
    });
    const data = await response.json();
    return (
      data?.passport?.buildScore < 20
    );
  } catch (error) {
    console.error("Error in isNewAccount", error);
    return false;
  }
}