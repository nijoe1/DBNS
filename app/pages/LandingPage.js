import { Box } from "@chakra-ui/react";
function LandingPage() {
  return (
    <Box mt={"20"}>
      <div className="w-5/6 flex flex-col justify-center mx-auto my-auto bg-400 ">
        <div className=" mx-auto p-6 bg-white shadow-xl rounded-lg max-w-4xl mt-[6%]">
          <div className="items-center text-center bg-400 ">
            <p className="text-4xl font-bold bg-clip-text bg-gradient-to-b from-indigo-200 to bg-indigo-500">
              DBNS
            </p>

            <p className="font-md font-mono text-black font-bold mt-2">
              To add description
            </p>
          </div>
          <div className="flex flex-col items-center">
            <button
              onClick={() =>
                window.open("https://github.com/nijoe1/DBNS", "_blank")
              }
              className="mt-5 bg-gradient-to-b from-gray-400 to bg-gray-700 hover:from-indigo-500 hover:to-indigo-200 text-white font-bold py-2 px-4 rounded-full"
            >
              Source Code
            </button>
          </div>
        </div>

        {/* Use Cases Section */}
        <div className="mt-10 grid grid-cols-2 mx-[20%] gap-6">
          {/* Box 1 - Agent Creation */}
          <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 ease-in-out">
            <h3 className="text-lg font-semibold mb-2">UseCase1</h3>
            <p className="text-sm text-gray-600">
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Sapiente
              aspernatur incidunt asperiores autem maxime! Saepe, odit fuga.
              Corporis doloribus veritatis fugiat possimus, fuga repellat ad
              cupiditate, asperiores quasi, saepe rerum!
            </p>
          </div>

          {/* Box 2 - Collaborative Ecosystem */}
          <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 ease-in-out">
            <h3 className="text-lg font-semibold mb-2">UseCase1</h3>
            <p className="text-sm text-gray-600">
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Sapiente
              aspernatur incidunt asperiores autem maxime! Saepe, odit fuga.
              Corporis doloribus veritatis fugiat possimus, fuga repellat ad
              cupiditate, asperiores quasi, saepe rerum!
            </p>
          </div>

          {/* Box 3 - Subscription Model */}
          <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 ease-in-out">
            <h3 className="text-lg font-semibold mb-2">UseCase1</h3>
            <p className="text-sm text-gray-600">
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Sapiente
              aspernatur incidunt asperiores autem maxime! Saepe, odit fuga.
              Corporis doloribus veritatis fugiat possimus, fuga repellat ad
              cupiditate, asperiores quasi, saepe rerum!
            </p>
          </div>

          {/* Box 4 - Rewarding Excellence */}
          <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 ease-in-out">
            <h3 className="text-lg font-semibold mb-2">UseCase2</h3>
            <p className="text-sm text-gray-600">
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Sapiente
              aspernatur incidunt asperiores autem maxime! Saepe, odit fuga.
              Corporis doloribus veritatis fugiat possimus, fuga repellat ad
              cupiditate, asperiores quasi, saepe rerum!
            </p>
          </div>
        </div>

        {/* Powered By Section */}
        <div className="mt-5  text-center">
          <h2 className="text-2xl font-bold mb-4">Powered By</h2>
          <div className="flex flex-wrap justify-center items-center gap-8">
            <div className="flex flex-col items-center">
              <img
                src="https://gateway.lighthouse.storage/ipfs/QmfUQj2R1kvRZmBDHAfSaGx9rxsD5D1YjaXXdmZpE4JWe"
                alt="Filecoin"
                className="h-16"
              />
              <p>Filecoin</p>
            </div>
            <div className="flex flex-col items-center">
              <img
                src="https://gateway.lighthouse.storage/ipfs/QmaNiKXhCt8AhTQ5UH4crr2RyndddsDwo89YicmcDvcrp"
                alt="Lighthouse"
                className="h-16 rounded-full"
              />
              <p>Lighthouse</p>
            </div>
            <div>
              <img
                src={
                  "https://gateway.lighthouse.storage/ipfs/QmZcWkCKmaJYVAvSij2ZWMfHgLQnVVhnM8c7VdZcMLy8h"
                }
                alt="Tableland"
                className="h-16"
              />
              <p>Tableland</p>
            </div>
            <div>
              <img
                src="https://gateway.lighthouse.storage/ipfs/QmTKQi64mRGwVjAceJgYQu3Ki599Ckw5qtLj2dpbX7GK7"
                alt="PushProtocol"
                className="h-16"
              />
              <p>PushProtocol</p>
            </div>
            <div>
              <img
                src="https://gateway.lighthouse.storage/ipfs/QmVarpFFeqPGPcn5RdRC7S2S45UZ638A3kNiRLSUsiamt"
                alt="Fleek"
                className="h-16"
              />
              <p>Fleek</p>
            </div>
            <div>
              <img
                src="https://gateway.lighthouse.storage/ipfs/QmVSVS65TmPTZUSwueqvvCAJxPaKb41FvdxQ467KPfsLM"
                alt="ENS"
                className="h-16"
              />
              <p>ENS</p>
            </div>
          </div>
        </div>
      </div>
    </Box>
  );
}

export default LandingPage;
