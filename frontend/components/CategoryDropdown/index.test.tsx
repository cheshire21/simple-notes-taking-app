import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import CategoryDropdown from "@/components/CategoryDropdown";
import type { Category } from "@/types";

const categories: Category[] = [
  { id: "cat-1", name: "Work", color: "#e8855a" },
  { id: "cat-2", name: "Personal", color: "#7fb5aa" },
];

describe("CategoryDropdown", () => {
  it("shows 'Category' when no selection", () => {
    render(
      <CategoryDropdown categories={categories} selectedCategory={null} onChange={() => {}} />,
    );
    expect(screen.getByText("Category")).toBeInTheDocument();
  });

  it("shows selected category name", () => {
    render(
      <CategoryDropdown
        categories={categories}
        selectedCategory={categories[0]}
        onChange={() => {}}
      />,
    );
    expect(screen.getByText("Work")).toBeInTheDocument();
  });

  it("dropdown is closed initially", () => {
    render(
      <CategoryDropdown categories={categories} selectedCategory={null} onChange={() => {}} />,
    );
    expect(screen.queryByRole("button", { name: "Work" })).not.toBeInTheDocument();
  });

  it("opens dropdown on trigger click", async () => {
    const user = userEvent.setup();
    render(
      <CategoryDropdown categories={categories} selectedCategory={null} onChange={() => {}} />,
    );
    await user.click(screen.getByRole("button"));
    expect(screen.getByText("Personal")).toBeInTheDocument();
  });

  it("calls onChange and closes when an option is selected", async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(
      <CategoryDropdown categories={categories} selectedCategory={null} onChange={onChange} />,
    );
    await user.click(screen.getByRole("button"));
    await user.click(screen.getAllByText("Work")[0]);
    expect(onChange).toHaveBeenCalledWith(categories[0]);
    expect(screen.queryByText("Personal")).not.toBeInTheDocument();
  });

  it("closes when clicking outside", async () => {
    const user = userEvent.setup();
    render(
      <div>
        <CategoryDropdown categories={categories} selectedCategory={null} onChange={() => {}} />
        <button type="button">Outside</button>
      </div>,
    );
    const triggerButton = screen.getByRole("button", { name: "Category" });
    await user.click(triggerButton);
    expect(screen.getByText("Personal")).toBeInTheDocument();
    await user.click(screen.getByText("Outside"));
    expect(screen.queryByText("Personal")).not.toBeInTheDocument();
  });
});
