export const getRules = (chainId, contractAddress) => {
  return {
    entry: {
      // entry is based on conditions
      conditions: {
        any: [
          // any of the decider should allow entry
          {
            // decicder 2 - If wallet holds 1 NFT on polygon testnet
            any: [
              {
                type: "PUSH",
                category: "ERC721",
                subcategory: "holder",
                data: {
                  contract: `eip155:${chainId}:${contractAddress}`,
                  comparison: ">=", // what comparison needs to pass
                  amount: 1, // amount that needs to passed
                  decimals: 18,
                },
              },
            ],
          },
        ],
      },
    },
  };
};
