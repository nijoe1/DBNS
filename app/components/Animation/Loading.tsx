import Lottie from "lottie-react";
import CoolLoading from "./cool.json";

export default function Loading() {
  return (
    <div
      style={{ height: "200px", width: "200px" }}
      className="flex flex-col items-center "
    >
      <Lottie animationData={CoolLoading} />
    </div>
  );
}
