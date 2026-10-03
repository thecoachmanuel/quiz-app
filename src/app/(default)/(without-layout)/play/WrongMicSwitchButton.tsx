"use client";
import { WRONG_MIC_SWITCH } from "@/configs";
import {
  SpeakerSimpleHighIcon,
  SpeakerSimpleSlashIcon,
} from "@phosphor-icons/react";
import { useEffect } from "react";

const WrongMicSwitchButton = ({
  isMicOn,
  setIsMicOn,
}: {
  isMicOn: boolean;
  setIsMicOn: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  useEffect(() => {
    const storedValue = localStorage.getItem(WRONG_MIC_SWITCH);
    if (typeof window !== "undefined" && storedValue) {
      setIsMicOn(() => storedValue === "on");
    }
  }, [setIsMicOn]);

  const toggleMic = () => {
    const newValue = !isMicOn;
    setIsMicOn(newValue);
    localStorage.setItem(WRONG_MIC_SWITCH, newValue ? "on" : "off");
  };

  return (
    <div className="flex items-center justify-center">
      <span
        onClick={toggleMic}
        className={`cursor-pointer text-xl transition-all duration-200 ${
          isMicOn ? "text-green-500" : "text-red-500"
        }`}
        title={isMicOn ? "Speaker On" : "Speaker Off"}
      >
        {isMicOn ? (
          <SpeakerSimpleHighIcon size={32} />
        ) : (
          <SpeakerSimpleSlashIcon size={32} />
        )}
      </span>
    </div>
  );
};

export default WrongMicSwitchButton;
