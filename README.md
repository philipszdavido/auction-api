# auction-api

# How to Run Project

This project is an Expressjs application and also houses a hardhat project.

Before you run this application, you an Ethereum wallet addres with some enought ETH on it.

Copy the private key and account address of your eth account, and paste them in the `.env` file in this project:

```
SIGNER_PRIVATE_KEY =
ACCOUNT_ADDRESS =
```

The private key goes into the `SIGNER_PRIVATE_KEY` while the account address goes into the `ACCOUNT_ADDRESS`.

If you are using a node provider, then you need to copy and paste the ethereum network url of the node provider to the `ETHEREUM_NETWORK`:

```
ETHEREUM_NETWORK =
```

If you want tot use the hardhat local node, then you can paste `http://localhost:8545`.

Next, the Auction smart contract needs an auction endtime and beneficiary address to tbe passed to it. You add them to the env variables:

```
AUCTION_END_TIME =
BENEFICIARY_ADDRESS =
```

To change the network port number of the server, you can change it by adding a value to the env variable:

```
PORT =
```

Without this PORT, the default port number will be `3100`.

You will need to install the dependencies.

```sh
yan install
npm install
```

Compile the `SimpleAuction` smart contract:

```
yarn compile
npm run compile
```

This will be successful.

Deploy the smart contract:

To deploy to local node. We need to start the local node, to do that:

```
yarn local:node
```

Go to another terminal in the same root dir, and run:

```
yarn deploy:local
```

You will see the address to where the contract was deployed. Copy it and paste it to:

```
CONTRACT_ADDRESS =
```

To deploy to a node provider

```

```
