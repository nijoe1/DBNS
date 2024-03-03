import React, { useEffect, useState } from "react";
import { Avatar, Wrap, WrapItem } from "@chakra-ui/react";
import Navbar from "@/components/navbar";
import HeroAnimation from "@/components/Animation/HeroAnimation";
// import { ParticleNetwork } from "@particle-network/auth";

export default function Home() {
  // useState and useEffect to fetch and set dynamic data

  return (
    <div>
      <div className="fixed z-50 top-0 left-0 w-full">
        <Navbar />
      </div>
      <div className="w-screen h-screen  bg-gradient-to-r from-white via-white to-rose-100">
        <div className="w-5/6 mt-20 flex flex-col justify-center mx-auto mb-2">
          <div className="mt-20 mx-auto p-6 bg-white shadow-xl rounded-lg max-w-4xl">
            <div className="items-center text-center">
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
                  window.open(
                    "https://github.com/nijoe1/DBNS",
                    "_blank"
                  )
                }
                className="mt-5 bg-gradient-to-r from-indigo-200 to bg-indigo-500 hover:from-indigo-500 hover:to-indigo-200 text-white font-bold py-2 px-4 rounded-full"
              >
                Source Code
              </button>
            </div>
          </div>

          <HeroAnimation></HeroAnimation>

          {/* Use Cases Section */}
          <div className="mt-10 grid grid-cols-2 mx-[20%] gap-6">
            {/* Box 1 - Agent Creation */}
            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 ease-in-out">
              <h3 className="text-lg font-semibold mb-2">UseCase1</h3>
              <p className="text-sm text-gray-600">
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Sapiente aspernatur incidunt asperiores autem maxime! Saepe, odit fuga. Corporis doloribus veritatis fugiat possimus, fuga repellat ad cupiditate, asperiores quasi, saepe rerum!
              </p>
            </div>

            {/* Box 2 - Collaborative Ecosystem */}
            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 ease-in-out">
              <h3 className="text-lg font-semibold mb-2">
              UseCase1
              </h3>
              <p className="text-sm text-gray-600">
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Sapiente aspernatur incidunt asperiores autem maxime! Saepe, odit fuga. Corporis doloribus veritatis fugiat possimus, fuga repellat ad cupiditate, asperiores quasi, saepe rerum!

              </p>
            </div>

            {/* Box 3 - Subscription Model */}
            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 ease-in-out">
              <h3 className="text-lg font-semibold mb-2">UseCase1</h3>
              <p className="text-sm text-gray-600">
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Sapiente aspernatur incidunt asperiores autem maxime! Saepe, odit fuga. Corporis doloribus veritatis fugiat possimus, fuga repellat ad cupiditate, asperiores quasi, saepe rerum!

              </p>
            </div>

            {/* Box 4 - Rewarding Excellence */}
            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 ease-in-out">
              <h3 className="text-lg font-semibold mb-2">
                UseCase2
              </h3>
              <p className="text-sm text-gray-600">
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Sapiente aspernatur incidunt asperiores autem maxime! Saepe, odit fuga. Corporis doloribus veritatis fugiat possimus, fuga repellat ad cupiditate, asperiores quasi, saepe rerum!

              </p>
            </div>
          </div>

          {/* Powered By Section */}
          <div className="mt-5 mb-[4%] text-center">
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
      </div>
    </div>
  );
}