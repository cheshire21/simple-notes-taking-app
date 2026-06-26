import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import CategoryItem from "@/features/categories/components/CategoryItem";

const mockCategory = { id: "cat-1", name: "Work", color: "#e8855a", created_at: "2026-01-01" };

describe("CategoryItem", () => {
  it("renders the category name", () => {
    render(<CategoryItem category={mockCategory} isActive={false} onClick={() => {}} />);
    expect(screen.getByText("Work")).toBeInTheDocument();
  });

  it("applies font-bold when active", () => {
    render(<CategoryItem category={mockCategory} isActive onClick={() => {}} />);
    expect(screen.getByRole("button")).toHaveClass("font-bold");
  });

  it("applies font-normal when inactive", () => {
    render(<CategoryItem category={mockCategory} isActive={false} onClick={() => {}} />);
    expect(screen.getByRole("button")).toHaveClass("font-normal");
  });

  it("shows count when provided", () => {
    render(<CategoryItem category={mockCategory} isActive={false} onClick={() => {}} count={5} />);
    expect(screen.getByText("5")).toBeInTheDocument();
  });

  it("hides count when not provided", () => {
    render(<CategoryItem category={mockCategory} isActive={false} onClick={() => {}} />);
    expect(screen.queryByText("0")).not.toBeInTheDocument();
  });

  it("calls onClick when clicked", async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    render(<CategoryItem category={mockCategory} isActive={false} onClick={onClick} />);
    await user.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledOnce();
  });
});
