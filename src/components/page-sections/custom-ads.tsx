import { useState } from "react";
import AdSense from "../extensions/AdSense";
import { XCircleIcon } from "@phosphor-icons/react";

const CustomAds = () => {
  const [showAd, setShowAd] = useState(true);

  if (!showAd) return null;

  return (
    <div className="rw-full my-4">
      <div className="border-dark5 bg-primary/5 relative w-full rounded-lg border p-3">
        {/* Close button */}
        <button
          onClick={() => setShowAd(false)}
          className="bg-dark5 hover:bg-dark3 absolute top-2 right-2 cursor-pointer rounded-full p-1 text-white transition"
        >
          <XCircleIcon className="h-4 w-4 text-black" />
        </button>

        {/* Google AdSense Component */}
        <AdSense
          position="custom_section"
          className="flex items-center justify-center"
        />
      </div>
    </div>
  );
};

export default CustomAds;
