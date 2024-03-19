const fs = require("fs").promises;
const solc = require("solc");

async function main() {
  const sourceCode = await fs.readFile("./contract/Auction.sol", "utf8");

  const { abi, bytecode } = compile(sourceCode, "SimpleAuction");

  const artifact = JSON.stringify({ abi, bytecode }, null, 2);
  await fs.writeFile("./contract/AuctionABI.json", artifact);
}

function compile(sourceCode: any, contractName: string) {
  const input = {
    language: "Solidity",
    sources: { main: { content: sourceCode } },
    settings: { outputSelection: { "*": { "*": ["abi", "evm.bytecode"] } } },
  };

  const output = solc.compile(JSON.stringify(input));
  const artifact = JSON.parse(output).contracts.main[contractName];
  console.log(output);
  return {
    abi: artifact.abi,
    bytecode: artifact.evm.bytecode.object,
  };
}

main();
