import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import PasswordInput from "@/components/PasswordInput";

describe("PasswordInput", () => {
  it("renders with type password by default", () => {
    const { container } = render(<PasswordInput placeholder="Password" />);
    const input = container.querySelector("input");
    expect(input).toHaveAttribute("type", "password");
  });

  it("renders a toggle visibility button", () => {
    render(<PasswordInput placeholder="Password" />);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("switches input to type text when the toggle button is clicked", async () => {
    const user = userEvent.setup();
    const { container } = render(<PasswordInput placeholder="Password" />);
    const input = container.querySelector("input");

    await user.click(screen.getByRole("button"));

    expect(input).toHaveAttribute("type", "text");
  });

  it("switches back to type password on a second toggle click", async () => {
    const user = userEvent.setup();
    const { container } = render(<PasswordInput placeholder="Password" />);
    const input = container.querySelector("input");
    const toggle = screen.getByRole("button");

    await user.click(toggle);
    await user.click(toggle);

    expect(input).toHaveAttribute("type", "password");
  });

  it("forwards additional props to the underlying input", () => {
    render(<PasswordInput placeholder="Enter password" />);
    expect(screen.getByPlaceholderText("Enter password")).toBeInTheDocument();
  });
});
