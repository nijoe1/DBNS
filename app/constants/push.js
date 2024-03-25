export const getRules = (
  chainId,
  contributorsGatedAddress,
  subscribersGatedAddress,
) => {
  let contributorsGatedRules = {
    // decicder 1 - If wallet holds 1 NFT on Filcoin testnet That is ERC721 and defines Dataset Contributor Access
    any: [
      {
        type: "PUSH",
        category: "ERC721",
        subcategory: "holder",
        data: {
          contract: `eip155:${chainId}:${contributorsGatedAddress}`,
          comparison: ">=", // what comparison needs to pass
          amount: 1, // amount that needs to passed
          decimals: 18,
        },
      },
    ],
  };

  let subscribersGatedRules = {
    // decicder 2 - If wallet holds 1 NFT on Filcoin testnet That is ERC721 and defines Dataset Subscriber Access
    any: [
      {
        type: "PUSH",
        category: "ERC721",
        subcategory: "holder",
        data: {
          contract: `eip155:${chainId}:${subscribersGatedAddress}`,
          comparison: ">=", // what comparison needs to pass
          amount: 1, // amount that needs to passed
          decimals: 18,
        },
      },
    ],
  };

  let conditions;
  if (contributorsGatedAddress && subscribersGatedAddress) {
    conditions = {
      // entry is based on conditions
      conditions: {
        any: [
          // any of the decider should allow entry
          contributorsGatedRules,
          subscribersGatedRules,
        ],
      },
    };
  } else if (contributorsGatedAddress && !subscribersGatedAddress) {
    conditions = {
      // entry is based on conditions
      conditions: {
        any: [
          // any of the decider should allow entry
          contributorsGatedRules,
        ],
      },
    };
  } else if (!contributorsGatedAddress && subscribersGatedAddress) {
    conditions = {
      // entry is based on conditions
      conditions: {
        any: [
          // any of the decider should allow entry
          subscribersGatedRules,
        ],
      },
    };
  } else {
    return null;
  }

  return {
    entry: {
      // entry is based on conditions
      conditions: conditions,
    },
  };
};
