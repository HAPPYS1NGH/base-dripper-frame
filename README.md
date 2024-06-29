# Based Dripper Frame

Based Dripper Frame is a web application built using the Frog framework. This application provides a CAPTCHA-based verification system and a faucet dripper for the Base Sepolia network. Users can verify their identity through a CAPTCHA challenge and claim faucet tokens.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Features](#features)
- [License](#license)
- [Contributing](#contributing)

## Installation

To install and set up the project locally, follow these steps:

1. Clone the repository:

   ```bash
   git clone https://github.com/HAPPYS1NGH/base-dripper-frame
   cd farcaster-frame
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:

   Create a `.env` file in the root directory and add the following environment variables:

   ```bash
    AIRSTACK_API_KEY=
    MAINNET_RPC=
    BASE_RPC=
    BASE_SEPOLIA_RPC=
    SEPOLIA_RPC=
    PRIVATE_KEY=
    ALCHEMY_KEY=
    NEYNAR_API_KEY=

   ```

4. Run the development server:

   ```bash
   npm run dev
   ```

## Usage

The application consists of several frames:

- `/`: The main frame displaying the faucet dripper information and a button to generate a CAPTCHA challenge.
- `/generate-captcha`: A frame that generates a CAPTCHA challenge for the user to solve.
- `/verify-captcha`: A frame that verifies the user's input against the CAPTCHA challenge.
- `/faucet`: A frame that handles the faucet token drip process if the CAPTCHA is successfully verified.

### Main Frame

This frame displays the main information about the faucet dripper and provides a button to generate a CAPTCHA challenge.

### Generate CAPTCHA Frame

This frame generates a CAPTCHA challenge that the user must solve to prove they are not a bot.

### Verify CAPTCHA Frame

This frame verifies the user's input against the CAPTCHA challenge. If the verification is successful, it redirects the user to the faucet frame.

### Faucet Frame

This frame handles the process of dripping tokens to the user's verified address. It checks various conditions such as if the user has claimed in the last 24 hours, if the user has enough balance, and if the user is eligible for the faucet.

## Features

- CAPTCHA-based verification to prevent bots from claiming faucet tokens.
- Faucet dripper for the Base Sepolia network.
- User eligibility checks to ensure fair distribution of tokens.
- Integration with Neynar API for Farcaster user data.
- Easy to extend and customize using the Frog framework.

## License

This project is licensed under the MIT License.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.
