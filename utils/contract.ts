import { config } from "../constants";
import { getChainClient } from "./client";

export const isTokenDrippedToAddressInLast24Hours = async (
  address: string,
  network: network
) => {
  const contract = config[network];
  const client: any = getChainClient(network);
  console.log("client", client);
  const hasReceivedWithin24Hours = client.readContract({
    address: contract.address as `0x${string}`,
    abi: contract.abi,
    functionName: "isTokenDrippedToAddressInLast24Hours",
    args: [address],
  });
  return hasReceivedWithin24Hours;
};

export const isTokenDrippedToFidInLast24Hours = async (
  fid: number,
  network: network
) => {
  const contract = config[network];
  const client: any = getChainClient(network);

  const hasReceivedWithin24Hours = client.readContract({
    address: contract.address as `0x${string}`,
    abi: contract.abi,
    functionName: "isTokenDrippedToFidInLast24Hours",
    args: [fid],
  });
  return hasReceivedWithin24Hours;
};

export const isBalanceAboveThreshold = async (
  address: string,
  network: network
) => {
  const contract = config[network];
  const client: any = getChainClient(network);

  const hasEnoughFunds = client.readContract({
    address: contract.address as `0x${string}`,
    abi: contract.abi,
    functionName: "isBalanceAboveThreshold",
    args: [address],
  });
  return hasEnoughFunds;
};

export const dripTokensToAddress = async (
  to: string,
  fid: number,
  amount: bigint,
  network: network
) => {
  try {
    console.log("dripTokensToAddress", to, fid, amount, network);

    const contract = config[network];
    const client: any = getChainClient(network, true);
    const { request } = await client.simulateContract({
      address: contract.address as `0x${string}`,
      abi: contract.abi,
      functionName: "dripTokensToAddress",
      args: [to, fid, amount.toString()],
    });
    console.log("request", request);
    const hash = await client.writeContract(request);

    console.log("hash", hash);
    return hash;
  } catch (error) {
    console.error("Error in dripTokensToAddress", error);
    return false;
  }
};
