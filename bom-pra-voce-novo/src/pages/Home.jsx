import BannerHome from "../Components/BannerHome/BannerHome";
import Cards from "../Components/Cards/Cards";
import LiveProductOffers from "../Components/ProductOffers/LiveProductOffers";
import StoreVisit from "../Components/StoreVisit/StoreVisit";
import About from "../Components/About/About";
import Faq from "../Components/Faq/Faq";
import TrabalheConosco from "../Components/WorkWithUs/TrabalheConosco";
export default function Home({ offers = <LiveProductOffers /> }) {
  return <>
    <BannerHome />{offers}<About /><Cards /><TrabalheConosco />
    <StoreVisit /><Faq />
  </>;
}
