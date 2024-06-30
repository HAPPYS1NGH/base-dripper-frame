/** @jsxImportSource frog/jsx */

import { Button, Frog, TextInput } from "frog";
import {
  generateCaptchaChallenge,
  validateCaptchaChallenge,
} from "@airstack/frog";

import { devtools } from "frog/dev";
// import { neynar } from 'frog/hubs'
import { handle } from "frog/next";
import { serveStatic } from "frog/serve-static";

import { replyMessageError, replyMessageSuccess } from "@/constants";
import {
  isTokenDrippedToAddressInLast24Hours,
  isBalanceAboveThreshold,
  isTokenDrippedToFidInLast24Hours,
  dripTokensToAddress,
} from "@/utils/contract";
import { isNewAccount } from "@/utils/index";

type State = {
  captchaId: string;
  valueHash: string;
};

interface CaptchaState {
  captchaId: string;
  valueHash: string;
}

const app = new Frog({
  initialState: {
    captchaId: "",
    valueHash: "",
  },
  assetsPath: "/",
  basePath: "/api",
  hub: {
    apiUrl: "https://hubs.airstack.xyz",
    fetchOptions: {
      headers: {
        "x-airstack-hubs": process.env.AIRSTACK_API_KEY as string,
      },
    },
  },
  // Supply a Hub to enable frame verification.
  // hub: neynar({ apiKey: 'NEYNAR_FROG_FM' })
});

// Uncomment to use Edge Runtime
// export const runtime = 'edge'

app.frame("/", (c) => {
  return c.res({
    image: (
      <div
        style={{
          alignItems: "center",
          backgroundSize: "100% 100%",
          backgroundColor: "#000",
          display: "flex",
          flexDirection: "column",
          flexWrap: "nowrap",
          height: "100%",
          justifyContent: "center",
          textAlign: "center",
          width: "100%",
        }}
      >
        <div
          style={{
            color: "white",
            display: "flex",
            fontSize: 60,
            fontStyle: "normal",
            letterSpacing: "-0.025em",
            lineHeight: 1.4,

            gap: "20px",
          }}
        >
          <h1
            style={{
              fontSize: "4rem",
              textAlign: "center",
              color: "#0052ff",
            }}
          >
            BASED
          </h1>
          <h1
            style={{
              fontSize: "4rem",
              textAlign: "center",
              color: "white",
              fontWeight: "bolder",
            }}
          >
            FAUCET DRIPPER
          </h1>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            fontSize: "2rem",
            padding: "10px",
            borderRadius: "10px",
            color: "white",
          }}
        >
          <ul
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <li>✅ You will receive Faucet on the verified address</li>
            <li>✅ You can only claim once in 24 Hours</li>
            <li>✅ You can claim 0.01 ETH per day</li>
            <li>✅ Builder Score {`>`} 20 can claim 0.02 ETH. </li>
          </ul>
        </div>
        <p
          style={{
            fontSize: "2rem",
            color: "white",
            fontWeight: "bolder",
            marginTop: "90px",
          }}
        >
          The Faucet Dripper for Base Sepolia. Extension of the @faucetbot
        </p>
      </div>
    ),
    intents: [<Button action="/generate-captcha">Verify Captcha</Button>],
  });
});

app.frame("/generate-captcha", async (c) => {
  const { deriveState } = c ?? {};
  const { state, data } = await generateCaptchaChallenge();
  // The 2 numbers generated can be used to generate custom Frame image
  const { numA, numB } = data;

  deriveState((previousState: any) => {
    // Store `state` data into Frames state
    previousState.captchaId = state.captchaId;
    previousState.valueHash = state.valueHash;
  });
  return c.res({
    image: (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundSize: "100% 100%",
          backgroundColor: "#000",
          color: "white",
          fontSize: "2rem",
          borderRadius: "10px",
          margin: "auto",
          width: "100%",
          height: "100%",
        }}
      >
        <div
          style={{
            maxWidth: "60%",
            display: "flex",
            margin: "20px",
          }}
        >
          Prove me you are not a bot, like out @faucetbot
        </div>
        <div style={{ display: "flex", fontSize: "7rem" }}>
          {numA} + {numB} = ?
        </div>
      </div>
    ),
    intents: [
      <TextInput placeholder="Type Here!" />,
      <Button action="/verify-captcha">Verify</Button>,
    ],
  });
});

app.frame("/verify-captcha", async (c) => {
  const { inputText, deriveState } = c ?? {};
  const state = deriveState() as CaptchaState;

  // check if the state is being passed correctly
  console.log("state", state);
  const { isValidated, image } = await validateCaptchaChallenge({
    inputText: inputText ?? "",
    state: state ?? {
      captchaId: "",
      valueHash: "",
    },
  });
  deriveState((previousState: any) => {
    // Clear Frames state
    previousState.captchaId = "";
    previousState.valueHash = "";
  });
  return c.res({
    image: (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundSize: "100% 100%",
          backgroundColor: "#000",
          color: "white",
          fontSize: "2rem",
          borderRadius: "10px",
          margin: "auto",
          width: "100%",
          height: "100%",
        }}
      >
        {isValidated ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "20px",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <h1>✅ You are not a bot! ✅ </h1>
            <h1>Now Let's get you some faucet ➕</h1>
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "20px",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <h1>🤖 You are a bot! 🤖</h1>
            <h5>OR</h5>
            <h1>➕You suck at Math like us➕</h1>
          </div>
        )}
      </div>
    ),
    intents: [
      <Button action={isValidated ? "/faucet" : "/generate-captcha"}>
        {isValidated ? "Get Your Faucet" : "Try Again?"}
      </Button>,
    ],
  });
});

app.frame("/faucet", async (c) => {
  const { frameData } = c;
  const fid = c.frameData?.fid;
  console.log("fid", fid);

  // const fid = 41;
  // const userAddress = "0xd5Ba400e732b3d769aA75fc67649Ef4849774bb1";

  let fundsToSend = "10000000000000000";
  let isEligibleForFaucet = false;
  let success = false;
  let link;

  let msg = "";
  if (!fid) {
    msg = replyMessageError("no-fid");
  } else {
    const response = await fetch(
      `https://api.neynar.com/v2/farcaster/user/bulk?fids=${fid}`,
      {
        method: "GET",
        headers: {
          accept: "application/json",
          api_key: process.env.NEYNAR_API_KEY || "NEYNAR_API_DOCS",
        },
      }
    );
    const userData = await response.json();
    const userAddresses = userData?.users[0]?.verified_addresses?.eth_addresses;

    if (userAddresses.length === 0) {
      msg = replyMessageError("no-address");
    } else {
      let userAddress = userAddresses[0];
      if (!userAddress) {
        msg = replyMessageError("no-address");
      } else if (
        await isTokenDrippedToAddressInLast24Hours(userAddress, "base-sepolia")
      ) {
        msg = replyMessageError("already-dripped-to-address") + userAddress;
      } else if (await isTokenDrippedToFidInLast24Hours(fid, "base-sepolia")) {
        msg = replyMessageError("already-dripped-to-fid") + fid;
      } else if (await isBalanceAboveThreshold(userAddress, "base-sepolia")) {
        msg = replyMessageError("enough-funds");
      }
      // Checks Build Score > 20
      else if (!(await isNewAccount(userAddress))) {
        isEligibleForFaucet = true;
        fundsToSend = "20000000000000000";
      } else {
        isEligibleForFaucet = true;
      }

      if (isEligibleForFaucet) {
        msg = replyMessageSuccess(
          "base-sepolia",
          BigInt(fundsToSend),
          userAddress as string
        );
        try {
          const hash = await dripTokensToAddress(
            userAddress as string,
            fid as number,
            BigInt(fundsToSend),
            "base-sepolia"
          );
          console.log("hash", hash);
          if (!hash) {
            msg = replyMessageError("error-sending-transaction");
            //  do not run the code below
          } else {
            success = true;
            link = `https://sepolia.basescan.org/tx/${hash}`;
            msg = replyMessageSuccess(
              "base-sepolia",
              BigInt(fundsToSend),
              hash
            );
          }
        } catch (error) {
          console.log("error", error);
          msg = replyMessageError("error-sending-transaction");
        }
      }
    }
  }

  console.log("msg", msg);

  return c.res({
    image: (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundSize: "100% 100%",
          backgroundColor: "#000",
          color: "white",
          fontSize: "2rem",
          borderRadius: "10px",
          margin: "auto",
          width: "100%",
          height: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            alignItems: "center",
            justifyContent: "center",
            width: "60%",
            color: "white",
          }}
        >
          {msg}
          {/* Drip you faucet : {msg} */}
        </div>
      </div>
    ),
    intents: [
      success ? (
        <Button.Link href={link as string}>See Transaction</Button.Link>
      ) : (
        <Button action="/">Try Again Later</Button>
      ),
    ],
  });
});

devtools(app, { serveStatic });

export const GET = handle(app);
export const POST = handle(app);
