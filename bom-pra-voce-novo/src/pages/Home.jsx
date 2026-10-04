import BannerHome from "../Components/BannerHome/BannerHome";
import Cards from "../Components/Cards/Cards";
import Tabloide from "../Components/Tabloide/Tabloide";
import StoreVisit from "../Components/StoreVisit/StoreVisit";
import About from "../Components/About/About";
import Faq from "../Components/Faq/Faq";
import TrabalheConosco from "../Components/WorkWithUs/TrabalheConosco";
export default function Home() {
  return <>
    <BannerHome /><Tabloide /><About /><Cards /><TrabalheConosco />
    <StoreVisit /><Faq />
  </>;
}
