# auction-api

Written in _TypeScript_
Framework: _Expressjs/Node.js_
DB: _Vercel Postgre_
Test: _Hardhat_ and _Jest_.
Smart Contract Language: _Solidity_

# How to Run Project

This project is an Expressjs application and also houses a hardhat project.

First, rename `env.example` to `.env`.

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
yarn install
npm install
```

Compile the `SimpleAuction` smart contract:

```sh
yarn compile
npm run compile
```

This will be successful.

## Deploy the smart contract:

**To deploy to local node**

We need to start the local node, to do that:

```sh
yarn local:node
```

Go to another terminal in the same root dir, and run:

```sh
yarn deploy:local
```

You will see the address to where the contract was deployed. Copy it and paste it to:

```
CONTRACT_ADDRESS =
```

Also, open `hardhat.config.ts` and go to `networks.localhost`:

```ts
...
const config: HardhatUserConfig = {
  solidity: "0.8.24",
  defaultNetwork: "localhost",
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545",
      accounts: [
        String(SIGNER_PRIVATE_KEY),
      ],
    },
  }
}
```

Make it look like the above, then also add the private keys of accounts you will be working with in the `accounts` property array. You can see the private keys from the terminal in which the hardhat node is running on.

Finally, you can start the server:

```sh
yarn build
yarn start
```

or using nodemon:

```sh
yarn dev
```

**To deploy to a node provider**

Go to the `hardhat.config.ts` file.

Create a new object in the `networks` section. The name of the object property should be whatever you want, let's say its `sepolia`. It will be blike this:

```ts
const config: HardhatUserConfig = {
  solidity: "0.8.24",
  defaultNetwork: "localhost",
  networks: {
    sepolia: {
      url: String(ETHEREUM_NETWORK),
      accounts: [String(SIGNER_PRIVATE_KEY)],
    },
```

In the `url`, add the url of the sepolia network where the contract is deployed. In this case, we are picking the ethereum network url from the .`env` var `ETHEREUM_NETWORK`.

Also, in the `accounts`, we included the account key from the `.env` `SIGNER_PRIVATE_KEY`. You can add as many private keys of eth accounts as you want.

Finally, start the server:

```sh
yarn build
yarn start
```

or

```sh
yarn dev
```

## Endpoints

### /auth

- `/register`: To create new user.

```sh
curl --location --request POST 'http://localhost:3100/auth/register' \
--header 'Content-Type: application/json' \
--data-raw '{
    "username": "your_username",
    "password": "your_password"
  }'
```

Result:

```json
{
  "message": "User created"
}
```

- /login

```sh
curl --location --request POST 'http://localhost:3100/auth/login' \
--header 'Content-Type: application/json' \
--data-raw '{
    "username": "your_username",
    "password": "your_password"
  }'
```

It returns a token:

```json
{
  "token": "TOKEN_HERE"
}
```

Copy and store the token

### /auction

- `history`

```sh
curl --location --request GET 'http://localhost:3100/auction/history' \
--header 'Content-Type: application/json' \
--header 'Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InlvdXJfdXNlcm5hbWUiLCJwYXNzd29yZCI6InlvdXJfcGFzc3dvcmQiLCJpYXQiOjE3MTA3NTU5NTEsImV4cCI6MTcxMDc1OTU1MX0.KxnvwG42RQSqTFq0qLVm4ub17jO_IeiyNJR10Z1L6fE' \
--data-raw ''
```

Result:

```json
{
  "message": "Bid history",
  "data": [
    {
      "bidder": "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
      "amount": "1.2 ETH"
    }
  ]
}
```

- statistics

```sh
curl --location --request GET 'http://localhost:3100/auction/statistics' \
--header 'Content-Type: application/json' \
--header 'Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InlvdXJfdXNlcm5hbWUiLCJwYXNzd29yZCI6InlvdXJfcGFzc3dvcmQiLCJpYXQiOjE3MTEwOTA3NTksImV4cCI6MTcxMTA5NDM1OX0.fiY8NbQeUJ_vGkFVrZcg0czbdQxl-ymn-sSysQJSwEM'
```

Result:

```json
{
  "message": "Statistics",
  "data": {
    "totalBids": "1",
    "totalEthVolume": "1.2 ETH"
  }
}
```

- submit-bid

```sh
curl --location --request POST 'http://localhost:3100/auction/submit-bid' \
--header 'Content-Type: application/json' \
--header 'Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InlvdXJfdXNlcm5hbWUiLCJwYXNzd29yZCI6InlvdXJfcGFzc3dvcmQiLCJpYXQiOjE3MTA3NTU5NTEsImV4cCI6MTcxMDc1OTU1MX0.KxnvwG42RQSqTFq0qLVm4ub17jO_IeiyNJR10Z1L6fE' \
--data-raw '{
    "bid": 1.2
}'
```

Result:

```json
{
  "message": "Bid submitted successfully",
  "data": {
    "cumulativeGasUsed": "180545",
    "logsBloom": "0x00000000000000000000000000800000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000400000000000000000000000040000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000100000000000000000040000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
    "logs": [
      {
        "address": "0x5fbdb2315678afecb367f032d93f642f64180aa3",
        "topics": [
          "0xf4757a49b326036464bec6fe419a4ae38c8a02ce3e68bf0809674f6aab8ad300"
        ],
        "data": "0x000000000000000000000000f39fd6e51aad88f6f4ce6ab8827279cfffb9226600000000000000000000000000000000000000000000000010a741a462780000",
        "transactionHash": "0xcc0579e27230131152625ab24cdf5c5a863186f1cfbf88dd80d63a4ba5a353ff",
        "blockHash": "0xa5c905597e45251e647ca8be20da5239f935b97488977dd2e894a16cf2e24fd3",
        "blockNumber": "2",
        "logIndex": "0",
        "transactionIndex": "0",
        "removed": false
      }
    ],
    "status": "1",
    "type": "0",
    "transactionHash": "0xcc0579e27230131152625ab24cdf5c5a863186f1cfbf88dd80d63a4ba5a353ff",
    "transactionIndex": "0",
    "from": "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266",
    "to": "0x5fbdb2315678afecb367f032d93f642f64180aa3",
    "gasUsed": "180545",
    "effectiveGasPrice": "1000000000",
    "blockHash": "0xa5c905597e45251e647ca8be20da5239f935b97488977dd2e894a16cf2e24fd3",
    "blockNumber": "2"
  }
}
```

- status

```sh
curl --location --request POST 'http://localhost:3100/auction/status' \
--header 'Content-Type: application/json' \
--header 'Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InlvdXJfdXNlcm5hbWUiLCJwYXNzd29yZCI6InlvdXJfcGFzc3dvcmQiLCJpYXQiOjE3MTA5NzQzNTgsImV4cCI6MTcxMDk3Nzk1OH0.pLNeECeud8R0XiCyqjbRlSQ96IYhU5lX2fn_kKE9hR4' \
```

Result:

```json
{
  "message": "Auction status",
  "data": {
    "ended": false,
    "beneficiary": "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
    "pendingReturns": "0 ETH",
    "highestBid": "1.2 ETH",
    "auctionEndTime": "4822-01-15T11:19:42.546Z",
    "totalBids": 1
  }
}
```

- deploy

```sh
curl --location --request POST 'http://localhost:3100/auction/deploy' \
--header 'Content-Type: application/json' \
--header 'Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InlvdXJfdXNlcm5hbWUiLCJwYXNzd29yZCI6InlvdXJfcGFzc3dvcmQiLCJpYXQiOjE3MTA3NTU5NTEsImV4cCI6MTcxMDc1OTU1MX0.KxnvwG42RQSqTFq0qLVm4ub17jO_IeiyNJR10Z1L6fE' \
--data-raw '{
    "endTime": 9000000,
    "beneficiaryAddress": "0x234RGRGVR"
}'
```

Result:

```json
{
  "message": "Auction smart contract deployed successfully",
  "data": {
    "auctionContractAddress": "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0"
  }
}
```

# Docker

To build the Docker images, simply run:

```sh
docker-compose up
```

We have two containers in the Docker: api,a nd hardhat. The `api` holds the server and the `hardhat` launches a local node.

Deploy the contract locally:

```sh
yarn deploy:local
```

Now, you can call the API endpoints.

# Running Tests

First, run:

```sh
yarn compile
```

**All Test**

```sh
yarn test
```

**Unit Test**

```sh
yarn test:unit
```

**Integration Test**

```sh
yarn test:integration
```

## Testing the SimpleAuction smart contract

Deploy the smart contract, update the `.env` with your:

```
ACCOUNT_ADDRESS="0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
AUCTION_END_TIME="90000000000000"
BENEFICIARY_ADDRESS="0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
CONTRACT_ADDRESS="0x5FbDB2315678afecb367f032d93F642f64180aa3"
ETHEREUM_NETWORK="http://localhost:8545"
```

If you are testing on local node, then start the hardhat node:

```sh
yarn start:node
```

Run the test:

```sh
yarn test:contract
```
