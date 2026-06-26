import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import ChevronDown from "./ChevronDown";

describe("ChevronDown", () => {
  it("renders an svg element", () => {
    const { container } = render(<ChevronDown />);
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });

  it("has the correct viewBox", () => {
    const { container } = render(<ChevronDown />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("viewBox", "0 0 20 11");
  });

  it("has the correct width and height", () => {
    const { container } = render(<ChevronDown />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("width", "20");
    expect(svg).toHaveAttribute("height", "11");
  });

  it("contains a path element", () => {
    const { container } = render(<ChevronDown />);
    const path = container.querySelector("path");
    expect(path).toBeInTheDocument();
  });
});
