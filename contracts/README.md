# Tokemon Contracts Interactions

## Steps :

- Create an **_ENS Domain_** and add it on the ./contracts/tasks/config.js in the **_parentNode variable_**

  - Change other details about the character and the asset metadata as you want

- Create .env file in the contracts dir and add PRIVATE_KEY = "your private key"

- Make sure your private key holds the ENS you bought

- Do:
  - **cd contracts**
  - **yarn** => To install the required packages
  - **npx hardhat run ./scripts/deployTokemon.js** => To deploy the Tokemon Contract and transfer the ENS
  - **npx hardhat uploadToken** => To upload the Character and the Asset Metadata on IPFS&Filecoin
  - **npx hardhat run ./scripts/createTokens.js** => To create the Character and the Asset onChain
  - **npx hardhat run ./scripts/mintTokens.js** => To mint the Character and then mint with the created TBA account the asset for that character.
  - **Go to the AssetCID or CharacterCID json file in the ./contracts/tasks/Lighthouse/.. And copy the encryptedCID paste that in the decrypt script bellow**
  - **npx hardhat run ./scripts/decrypt.js** => To see that you cannot decrypt
  - **npx hardhat run ./scripts/decryptToken.js** => To interact with the contract call decrypt your character and asset
  - **npx hardhat run ./scripts/decrypt.js** => To see that you cannot decrypt and find you decryptedImage.png

#### DONE!
