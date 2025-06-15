import React from "react";
import NavBar from "../Components/NavBar/NavBar";
import BannerHome from "../Components/BannerHome/BannerHome";

export default function Home() {
  return (
    <main className="min-h-screen  flex flex-col items-center ">
      <NavBar />
      <BannerHome />
    </main>
  );
}
