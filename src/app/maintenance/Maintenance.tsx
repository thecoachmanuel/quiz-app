"use client";

import Countdown from "@/components/ui/Countdown";
import ImageLoader from "@/components/ui/ImageLoader";
import Loader from "@/components/ui/Loader";
import { API_BASE_URL, MAINTENANCE, SERVER_URL } from "@/configs";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useEffectEvent, useState } from "react";
import maintenanceImage from "../../../public/maintenance.png";

interface MaintenanceData {
  description: string;
  countdown: string;
  image: string;
}

const Maintenance = () => {
  const { push } = useRouter();
  const [maintenanceData, setMaintenanceData] =
    useState<MaintenanceData | null>(null);

  const getMaintenanceData = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/info`);
      if (response.status === 200) {
        Cookies.remove(MAINTENANCE);
        push("/");
      }
    } catch (err: any) {
      const data = err?.response?.data?.data;
      if (data) {
        setMaintenanceData(data);
      } else {
        console.error("Failed to fetch maintenance data:", err);
      }
    }
  }, [push]);

  const handleMaintenanceData = useEffectEvent(() => {
    getMaintenanceData();
  });

  useEffect(() => {
    // Ensure cookie is set once
    if (!Cookies.get(MAINTENANCE)) {
      Cookies.set(MAINTENANCE, "true");
    }

    handleMaintenanceData();
    const interval = setInterval(getMaintenanceData, 30000);

    return () => clearInterval(interval);
  }, [getMaintenanceData]);

  if (!maintenanceData) {
    return <Loader />;
  }

  return (
    <div className="relative h-screen w-full">
      <ImageLoader
        src={
          maintenanceData?.image
            ? `${SERVER_URL}${maintenanceData.image}`
            : maintenanceImage
        }
        alt="maintenance"
        width={1920}
        height={1080}
        className="h-full w-full object-fill"
        priority
      />

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center text-white">
        <p className="mb-4 text-2xl font-semibold">
          {maintenanceData.description}
        </p>
        <Countdown dateTime={maintenanceData.countdown} />
      </div>
    </div>
  );
};

export default Maintenance;
