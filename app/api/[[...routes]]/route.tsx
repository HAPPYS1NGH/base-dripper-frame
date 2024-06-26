/** @jsxImportSource frog/jsx */

import { Button, Frog, TextInput } from "frog";
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
        ></div>
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
