import { render, screen } from "@testing-library/react";
import { storeConfig } from "../../Data/storeConfig";
import StoreVisit from "./StoreVisit";

test("anchors one branded marker to the store query already used by the map", () => {
  render(<StoreVisit />);

  const marker = screen.getByRole("img", {
    name: "Bom pra Você Supermercado nesta localização",
  });
  const map = screen.getByTitle("Localização do supermercado Bom Pra Você");
  const expectedQuery = `${storeConfig.name} Supermercado ${storeConfig.address}`;

  expect(marker).toBeInTheDocument();
  expect(document.querySelectorAll(".visit-map-marker")).toHaveLength(1);
  expect(map).toHaveAttribute(
    "src",
    expect.stringContaining(encodeURIComponent(expectedQuery)),
  );
  expect(storeConfig.mapCoordinates).toBeUndefined();
  expect(map).toHaveAttribute("tabindex", "-1");
});
