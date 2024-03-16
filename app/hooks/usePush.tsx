"use client";

import { useEthersSigner } from "@/wagmi/getEthersSigner";
import { useDispatch } from "react-redux";
import { PushAPI, CONSTANTS } from "@pushprotocol/restapi";

import { setPushSign } from "@/redux/slice/pushSlice";
import toast from "react-hot-toast";

export default function usePush() {
  const dispatch = useDispatch();
  const signer = useEthersSigner();

  const initializePush = async () => {
    try {
      const user = await PushAPI.initialize(signer, {
        env: CONSTANTS.ENV.STAGING,
      });

      if (user.errors.length > 0)
        throw new Error("Error initializing push protocol");

      dispatch(setPushSign(user as any));

      return user;
    } catch (error) {
      toast.error("Request Rejected");
      throw new Error("Error initializing push protocol");
    }
  };

  return {
    initializePush,
  };
}
