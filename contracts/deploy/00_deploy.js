require("hardhat-deploy");
require("hardhat-deploy-ethers");

const { ethers } = require("hardhat");
const { Console } = require("console");
const { get } = require("http");

const private_key = network.config.accounts[0];
const wallet = new ethers.Wallet(private_key, ethers.provider);

module.exports = async ({ deployments }) => {
  const { deploy } = deployments;
  console.log("Wallet+ Ethereum Address:", wallet.address);

  // // Calibration Testnet
  const FNS = "0x331e3228ca613F52B8E6a0F1EFD7000Cb6DFA581";
  const PUBLIC_RESOLVER = "0x55608172cD23E7e1c2BD939f1C3210027EbD031a";
  const REGISTRAR = "0x57f1887a8BF19b14fC0dF6Fd9B2acc9Af147eA85";

  const BASENODE =
    "0x78f6b1389af563cc5c91f234ea46b055e49658d8b999eeb9e0baef7dbbc93fdb";

  const IMPLEMENTATION = await deploy("GatedInstance", {
    from: wallet.address,
    args: [],
    log: true,
  });

  const SUBSCRIPTION_IMPLEMENTATION = await deploy("SubscriptionNFTs", {
    from: wallet.address,
    args: [],
    log: true,
  });
  const _DBNS = await deploy("DBNS", {
    from: wallet.address,
    args: [
      FNS,
      REGISTRAR,
      PUBLIC_RESOLVER,
      BASENODE,
      IMPLEMENTATION.address,
      SUBSCRIPTION_IMPLEMENTATION.address,
    ],
    log: true,
  });
  // 0xd115d13d491885909a0E21CA90B9406790F1502e
  const DBNS_INSTANCE = await ethers.getContractFactory("DBNS");
  const DBNS = DBNS_INSTANCE.attach(_DBNS.address);
  // const DBNS = DBNS_INSTANCE.attach("0x020a9DcD8FeDbb28aAF92C44Da860f9135351cdF");

  let tx = await DBNS.tables(0);
  console.log(tx);
  tx = await DBNS.tables(1);
  console.log(tx);
  tx = await DBNS.tables(2);
  console.log(tx);
  tx = await DBNS.tables(3);
  console.log(tx);
  tx = await DBNS.DBNS_NODE();
  console.log(tx);
  // const DBNS = DBNS_INSTANCE.attach(
  //   "0xd115d13d491885909a0E21CA90B9406790F1502e"
  // );

  // let tx = await DBNS.tables(0)
  // console.log(tx);

  // tx = await DBNS.createDBSpace("nick5", { gasLimit: 40000000 });

  // await tx.wait();

  // console.log(tx);

  // console.log(tx);

  //   function createSpaceInstance(
  //     bytes32 _node,
  //     uint256 _hatID,
  //     uint256 _price,
  //     string memory _name,
  //     string memory _about,
  //     string memory _img,
  //     string memory _chatID,
  //     string memory _IPNS
  // )

  // let tx = await DBNS.createSpaceInstance(
  //   "0xe5b025831fde2b59d12c45b640cee0b6590bbb8b0a140e5d4dc04f90aaee3d8a",
  //   2,
  //   ["0x044b595c9b94a17adc489bd29696af40ccb3e4d2"],
  //   "metadataCI3D",
  //   "3",
  //   "IPNS"
  // );

  // await tx.wait();

  // let tx = await DBNS.createInstanceCode(
  //   "0x30584450898765ea045173802f60dea66b5c4a444e58fb72ceafe93f2d2d2ec2",
  //   "name",
  //   "about",
  //   "chatID",
  //   "codeIPNS"
  // );
  // await tx.wait();

  // let tx = await DBNS.purchaseInstanceSubscription(
  //   "0x30584450898765ea045173802f60dea66b5c4a444e58fb72ceafe93f2d2d2ec2",
  //   { value: 2 }
  // );
  // await tx.wait();

  // let tx = await DBNS.removeMembers(
  //   "0x30584450898765ea045173802f60dea66b5c4a444e58fb72ceafe93f2d2d2ec2",
  //   [wallet.address]
  // );
  // await tx.wait();

  // Verify the contract
  // await hre.run("verify:verify", {
  //   address: DBNS2.address,
  //   constructorArguments: [NAME_WRAPPER, PUBLIC_RESOLVER],
  // });
};
