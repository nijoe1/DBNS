const path = require("path");

const parentNode = "toketokemon.eth";

const characterName = "charizarddd";

const characterNodeName = characterName + "." + parentNode;

const AssetName = "christmashattt";

const assetNodeName = AssetName + "." + characterNodeName;

const characterPath = path.join(__dirname, "Charizard.png");

const characterDescription =
  "Charizard, the majestic Fire and Flying-type Pokémon, captivates with its striking orange scales and a robust, flaming tail. Its regal head, crowned with blunt horns, and powerful teal-winged silhouette, underscore its legendary status. Agile and formidable, Charizard's piercing blue eyes reflect its fiery spirit and battle prowess.";
// cHARIZARD ATTRIBUTES
const characterAttributes = [
  { trait_type: "TokenType", value: "Character" },

  { trait_type: "Species", value: "Charizard" },
  { trait_type: "Type", value: "Fire/Flying" },
  { trait_type: "Characteristic", value: "Draconic, Bipedal" },
  { trait_type: "Color", value: "Primarily Orange" },
  { trait_type: "Flame", value: "Sizable Flame on Tail" },
  { trait_type: "Eyes", value: "Small Blue" },
  { trait_type: "Wings", value: "Large with Teal Undersides" },
  { trait_type: "Claws", value: "Three White Claws" },
];
// HAT ATTRIBUTES
const assetDescription =
  "Exclusive to Charizard TokenID TokenBountAccounts, the Christmas Charizard Hat is a festive, limited-edition skin. This red and white hat, adorned with holly berries and a fluffy brim, adds holiday flair and uniqueness to your Charizard, enhancing its in-game identity and value.";

const assetAttributes = [
  { trait_type: "Item", value: "Christmas Hat" },
  { trait_type: "Color", value: "Red and White" },
  { trait_type: "TokenType", value: "Asset" },
  { trait_type: "Feature", value: "Fluffy White Brim" },
  { trait_type: "Decoration", value: "Holly Berries" },
  { trait_type: "Rarity", value: "Limited Edition" },
  { trait_type: "Exclusivity", value: "Charizard TokenBound Accounts" },
];

const assetPath = path.join(__dirname, "ChristmasHat.png");
const EncryptedAssetPath = path.join(__dirname, "ChristmasCharizard.png");

const assetJson = {
  name: assetNodeName,
  description: assetDescription,
  attributes: assetAttributes,
};

const characterJson = {
  name: characterNodeName,
  description: characterDescription,
  attributes: characterAttributes,
};

module.exports = {
  assetJson,
  characterJson,
  assetPath,
  EncryptedAssetPath,
  characterPath,
  characterName,
  AssetName,
  parentNode,
};
