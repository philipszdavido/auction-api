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

```
yarn build
yarn start
```

or using nodemon:

```
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

```
yarn build
yarn start
```

or

```
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

- statistics

```sh
curl --location --request GET 'http://localhost:3100/auction/statistics' \
--header 'Content-Type: application/json' \
--header 'Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InlvdXJfdXNlcm5hbWUiLCJwYXNzd29yZCI6InlvdXJfcGFzc3dvcmQiLCJpYXQiOjE3MTEwOTA3NTksImV4cCI6MTcxMTA5NDM1OX0.fiY8NbQeUJ_vGkFVrZcg0czbdQxl-ymn-sSysQJSwEM'
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

- status

```sh
curl --location --request POST 'http://localhost:3100/auction/status' \
--header 'Content-Type: application/json' \
--header 'Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InlvdXJfdXNlcm5hbWUiLCJwYXNzd29yZCI6InlvdXJfcGFzc3dvcmQiLCJpYXQiOjE3MTA5NzQzNTgsImV4cCI6MTcxMDk3Nzk1OH0.pLNeECeud8R0XiCyqjbRlSQ96IYhU5lX2fn_kKE9hR4' \
```
