import usePromotions from "../../hooks/usePromotions";
import PromotionShowcase from "./PromotionShowcase";
import "./promotionThemes.css";

export default function Tabloide() {
  return <PromotionShowcase {...usePromotions()} />;
}
