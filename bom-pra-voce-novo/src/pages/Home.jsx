import React from "react";
import NavBar from "../Components/NavBar/NavBar";
import BannerHome from "../Components/BannerHome/BannerHome";
import Cards from "../Components/Cards/Cards";
import Tabloide from "../Components/Tabloide/Tabloide";
import PaymentsMethods from "../Components/PaymentMethods/PaymentMethods";
export default function Home() {
  return (
    <main className="min-h-screen bg-black  flex flex-col items-center ">
      <NavBar />
      <BannerHome />
      <Tabloide />
      {/* <Cards /> */}
      <PaymentsMethods />
    </main>
  );
}
