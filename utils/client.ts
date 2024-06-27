import {
  createPublicClient,
  http,
  fallback,
  createWalletClient,
  publicActions,
} from "viem";
import {
  baseSepolia,
  mainnet,
  base,
} from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";
// import { Alchemy, Network } from "alchemy-sdk";

const baseSepoliaRpc = process.env.BASE_SEPOLIA_RPC;
const mainnetRpc = process.env.MAINNET_RPC;
const baseRpc = process.env.BASE_RPC;

const account = privateKeyToAccount(`0x${process.env.PRIVATE_KEY}`);


export const baseSepoliaClient = createPublicClient({
  chain: baseSepolia,
  transport: http(baseSepoliaRpc, {
    batch: true,
  }),
});

export const mainnetClient = createPublicClient({
  chain: mainnet,
  transport: fallback([
    http(mainnetRpc, {
      batch: true,
    }),
    http("https://eth-mainnet.public.blastapi.io"),
  ]),
});

export const baseClient = createPublicClient({
  chain: base,
  transport: fallback([
    http(baseRpc, {
      batch: true,
    }),
    http("https://base-sepolia.blockpi.network/v1/rpc/public"),
  ]),
});
export const walletBaseClient = createWalletClient({
  account,
  chain: baseSepolia,
  transport: http(baseSepoliaRpc),
}).extend(publicActions);


export function getChainClient(chain: string, isWallet = false) {
  switch (chain) {
    case "mainnet":
      return mainnetClient;
    case "base":
      return baseClient;
    case "base-sepolia":
      return isWallet ? walletBaseClient : baseSepoliaClient;
    default:
      throw new Error(`Unsupported chain ${chain}`);
  }
}
