/** @jsxImportSource frog/jsx */

import { Button, Frog, TextInput } from "frog";
import {
  generateCaptchaChallenge,
  validateCaptchaChallenge,
} from "@airstack/frog";
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
            <li>✅ You can claim 0.01 ETH per claim</li>
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
