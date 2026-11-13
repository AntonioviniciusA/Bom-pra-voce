import { render, screen } from "@testing-library/react";
import { storeConfig } from "../../Data/storeConfig";
import StoreVisit from "./StoreVisit";

test("shows one branded marker at the configured store coordinates", () => {
  render(<StoreVisit />);

  const marker = screen.getByRole("img", {
    name: "Bom pra Você Supermercado nesta localização",
  });
  const map = screen.getByTitle("Localização do supermercado Bom Pra Você");

  expect(marker).toBeInTheDocument();
  expect(document.querySelectorAll(".visit-map-marker")).toHaveLength(1);
  expect(map).toHaveAttribute(
    "src",
    expect.stringContaining(encodeURIComponent(
      `${storeConfig.mapCoordinates.latitude},${storeConfig.mapCoordinates.longitude}`,
    )),
  );
  expect(map).toHaveAttribute("tabindex", "-1");
});
