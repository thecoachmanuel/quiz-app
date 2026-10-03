/** @format */

"use client";
import { useMenu } from "@/providers/MenuProvider";
import { ListIcon } from "@phosphor-icons/react/dist/ssr";
import dynamic from "next/dynamic";
import React, { useEffect, useMemo, useState } from "react";
import HeaderAd from "./HeaderAd";
import useAdsQuery from "@/hooks/useAdsQuery";

const Logo = dynamic(() => import("../../ui/Logo"), {
  ssr: false,
});

const HeaderAuthMenu = dynamic(() => import("./HeaderAuthMenu"), {
  ssr: false,
});

const MenuItems = dynamic(() => import("./MenuItems"), {
  ssr: false,
});

const MobileNavMenu = dynamic(() => import("./MobileNavMenu"), {
  ssr: false,
});

export default function Header() {
  const { getAds } = useAdsQuery();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const { menus } = useMenu();

  const filterHeaderMenu = useMemo(() => {
    const headerMenu = menus?.length
      ? menus?.find((item) => item.slug === "header-menu")
      : null;
    if (!headerMenu) return [];
    return headerMenu.items.sort((a, b) => a.order - b.order);
  }, [menus]);

  const [showHeader, setShowHeader] = useState(false);

  const handleScroll = () => {
    if (window.scrollY > 5) {
      setShowHeader(true);
    } else {
      setShowHeader(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const headerAds = useMemo(() => {
    return getAds("header");
  }, [getAds]);

  return (
    <React.Fragment>
      <HeaderAd />
      <header
        className={`fixed ${headerAds ? (headerAds?.height ? `top-${headerAds?.height}px` : "top-19") : "top-0"} right-0 left-0 z-50 ${showHeader ? "!top-0 bg-white shadow-md" : "bg-transparent"} duration-300`}
      >
        <div className="custom-container flex items-center justify-between py-4">
          <div className="flex items-center justify-start gap-1 sm:gap-2">
            <button
              className="lg:hidden"
              onClick={() => setShowMobileMenu(true)}
            >
              <ListIcon size={24} />
            </button>
            <Logo />
          </div>
          <nav className="max-lg:hidden">
            <MenuItems item={filterHeaderMenu} />
          </nav>

          {/* mobile menu */}
          <MobileNavMenu
            menus={filterHeaderMenu}
            setShowMobileMenu={setShowMobileMenu}
            showMobileMenu={showMobileMenu}
          />
          {/* user menu and auth menu */}
          <HeaderAuthMenu />
        </div>
      </header>
    </React.Fragment>
  );
}
