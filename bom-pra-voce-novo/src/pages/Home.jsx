import React from "react";
import NavBar from "../Components/NavBar/NavBar";
import BannerHome from "../Components/BannerHome/BannerHome";
import Cards from "../Components/Cards/Cards";
import Tabloide from "../Components/Tabloide/Tabloide";
import PaymentsMethods from "../Components/PaymentMethods/PaymentMethods";
import About from "../Components/About/About";
import TourVirtual from "../Components/TourVirtual/TourVirtual";
import FaqSection from "../Components/Faq/Faq";
import TrabalheConosco from "../Components/WorkWithUs/TrabalheConosco";
import Footer from "../Components/Footer/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-white  flex flex-col items-center ">
      <NavBar />
      <BannerHome />
      <Tabloide />
      <Cards />
      <TourVirtual />
      <About />
      <TrabalheConosco />
      <FaqSection />
      <Footer />
      {/* <PaymentsMethods /> */}
    </main>
  );
}
