import { PushAPI, CONSTANTS } from "@pushprotocol/restapi";

// Define async function to initialize user
async function initUser(signer) {
  try {
    // Initialize wallet user
    // 'CONSTANTS.ENV.PROD' -> mainnet apps | 'CONSTANTS.ENV.STAGING' -> testnet apps
    const user = await PushAPI.initialize(signer, {
      env: CONSTANTS.ENV.STAGING,
    });
    return user;
  } catch (error) {
    console.error("Error initializing user:", error);
    throw error;
  }
}

// Export the async function
export { initUser };
