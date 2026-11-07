import BannerHome from "../Components/BannerHome/BannerHome";
import LiveProductOffers from "../Components/ProductOffers/LiveProductOffers";
import About from "../Components/About/About";
import Faq from "../Components/Faq/Faq";
import TrabalheConosco from "../Components/WorkWithUs/TrabalheConosco";
export default function Home({ offers = <LiveProductOffers /> }) {
  return <>
    <BannerHome />{offers}<About /><TrabalheConosco /><Faq />
  </>;
}
