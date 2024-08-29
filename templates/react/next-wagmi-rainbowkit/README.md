This is a [zkSync](https://zksync.io) + [wagmi](https://wagmi.sh) + [RainbowKit](https://rainbowkit.com) + [Next.js](https://nextjs.org) project bootstrapped with [`zksync-cli`](https://github.com/matter-labs/zksync-cli)

# Getting Started

## Requirements
- A wallet extension like MetaMask installed in your browser.
- A WalletConnect project ID to connect.
- Node.js and npm installed.
- To use the `dockerized local node` or `in memory local node` setups, you will need to run the respective services in Docker. For detailed instructions on setting up and running these nodes, refer to the [Documentation](https://docs.zksync.io/build/test-and-debug).

## Setup

1. Copy the `.env.example` file to `.env`:

```bash
cp .env.example .env
```
2. Update the .env file with your WalletConnect project ID.

## Installation
Install dependencies with `npm install`.

Run `npm run dev` in your terminal, and then open [localhost:3000](http://localhost:3000) in your browser.

Once the webpage has loaded, changes made to files inside the `src/` directory (e.g. `src/pages/index.tsx`) will automatically update the webpage.

# Learn more

To learn more about [zkSync](https://zksync.io), [RainbowKit](https://rainbowkit.com) or [wagmi](https://wagmi.sh), check out the following resources:

- [zkSync Documentation](https://era.zksync.io/docs/dev) – learn about zkSync features and API.
- [wagmi Documentation](https://wagmi.sh) – learn about wagmi Hooks and API.
- [RainbowKit Documentation](https://rainbowkit.com/docs/introduction) – learn more about RainbowKit (configuration, theming, advanced usage, etc).
- [Next.js Documentation](https://nextjs.org/docs) learn about Next.js features and API.
