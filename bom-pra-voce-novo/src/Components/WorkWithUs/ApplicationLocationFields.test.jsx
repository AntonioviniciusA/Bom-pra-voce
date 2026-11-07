import { render, screen, fireEvent, within } from "@testing-library/react";
import ApplicationLocationFields from "./ApplicationLocationFields";
import { applicationLocations, locationGroups } from "./applicationLocations";

test("catalog keeps DF and Entorno distinct and fits the existing address contract", () => {
  expect(locationGroups.map(group => group.cities.length)).toEqual([35, 11]);
  expect(new Set(applicationLocations.map(city => city.value)).size).toBe(46);
  for (const city of applicationLocations) {
    expect(new Set(city.neighborhoods).size).toBe(city.neighborhoods.length);
    for (const neighborhood of city.neighborhoods) {
      expect(`${city.value} — ${neighborhood}`.length).toBeLessThanOrEqual(200);
    }
  }
});

test("city filters neighborhoods and changing or clearing it removes the previous neighborhood", () => {
  const onChange = jest.fn();
  render(<ApplicationLocationFields onChange={onChange} />);
  const city = screen.getByLabelText("Cidade / região administrativa (opcional)");
  const neighborhood = screen.getByLabelText("Bairro / setor (opcional)");
  expect(neighborhood).toBeDisabled();
  fireEvent.change(city, { target: { value: "Ceilândia - DF" } });
  expect(neighborhood).toBeEnabled();
  expect(within(neighborhood).queryByRole("option", { name: "Pedregal" })).not.toBeInTheDocument();
  fireEvent.change(neighborhood, { target: { value: "Setor P Sul" } });
  expect(onChange).toHaveBeenLastCalledWith("Ceilândia - DF — Setor P Sul");
  fireEvent.change(city, { target: { value: "Novo Gama - GO" } });
  expect(neighborhood).toHaveValue("");
  expect(onChange).toHaveBeenLastCalledWith("Novo Gama - GO");
  expect(within(neighborhood).getByRole("option", { name: "Pedregal" })).toBeInTheDocument();
  expect(within(neighborhood).queryByRole("option", { name: "Setor P Sul" })).not.toBeInTheDocument();
  fireEvent.change(city, { target: { value: "" } });
  expect(neighborhood).toBeDisabled();
  expect(onChange).toHaveBeenLastCalledWith("");
});

test("unlisted locations can be entered and custom text is cleared when changing city", () => {
  const onChange = jest.fn();
  render(<ApplicationLocationFields onChange={onChange} />);
  const city = screen.getByLabelText("Cidade / região administrativa (opcional)");
  const neighborhood = screen.getByLabelText("Bairro / setor (opcional)");
  fireEvent.change(city, { target: { value: "other" } });
  expect(neighborhood).toBeDisabled();
  fireEvent.change(screen.getByLabelText("Informe a cidade e UF"), { target: { value: " Pirenópolis - GO " } });
  fireEvent.change(neighborhood, { target: { value: "other" } });
  fireEvent.change(screen.getByLabelText("Informe o bairro ou setor"), { target: { value: " Centro " } });
  expect(onChange).toHaveBeenLastCalledWith("Pirenópolis - GO — Centro");
  fireEvent.change(city, { target: { value: "Planaltina - DF" } });
  expect(screen.queryByLabelText("Informe o bairro ou setor")).not.toBeInTheDocument();
  expect(onChange).toHaveBeenLastCalledWith("Planaltina - DF");
  fireEvent.change(city, { target: { value: "Planaltina - GO" } });
  expect(within(neighborhood).queryByRole("option", { name: "Setor Tradicional" })).not.toBeInTheDocument();
});
