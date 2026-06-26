import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { JSX } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

import Sidebar from "@/components/layout/Sidebar";
import type { Category } from "@/features/categories/types";

const { mockUseCategories } = vi.hoisted(() => ({
  mockUseCategories: vi.fn(),
}));

vi.mock("@/features/categories/hooks/useCategories", () => ({
  default: mockUseCategories,
}));

vi.mock("@/features/auth/components/LogoutButton", () => ({
  default: (): JSX.Element => <button type="button">Logout</button>,
}));

vi.mock("@/features/categories/components/CreateCategoryForm", () => ({
  default: (): null => null,
}));

vi.mock("@/features/categories/components/CategoryItem", () => ({
  default: ({ category }: { category: Category }): JSX.Element => <li>{category.name}</li>,
}));

const mockCategories: Category[] = [
  { id: "cat-1", name: "Work", color: "#e8855a", created_at: "2026-01-01" },
  { id: "cat-2", name: "Personal", color: "#7fb5aa", created_at: "2026-01-01" },
];

const defaultProps = {
  activeCategory: null,
  setActiveCategory: vi.fn(),
  noteCounts: {},
};

afterEach(() => {
  vi.clearAllMocks();
});

describe("Sidebar", () => {
  it("renders skeleton items while loading", () => {
    mockUseCategories.mockReturnValue({
      data: [],
      isLoading: true,
      isError: false,
      refetch: vi.fn(),
    });

    const { container } = render(<Sidebar {...defaultProps} />);
    const skeletons = container.querySelectorAll(".animate-pulse");
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it("renders the error message on fetch failure", () => {
    mockUseCategories.mockReturnValue({
      data: [],
      isLoading: false,
      isError: true,
      refetch: vi.fn(),
    });

    render(<Sidebar {...defaultProps} />);
    expect(screen.getByText("Failed to load categories.")).toBeInTheDocument();
  });

  it("calls refetch when the retry button is clicked after an error", async () => {
    const refetch = vi.fn().mockResolvedValue({ data: [] });
    const user = userEvent.setup();
    mockUseCategories.mockReturnValue({
      data: [],
      isLoading: false,
      isError: true,
      refetch,
    });

    render(<Sidebar {...defaultProps} />);
    await user.click(screen.getByRole("button", { name: /try again/i }));
    expect(refetch).toHaveBeenCalledOnce();
  });

  it("renders the category list when loaded", () => {
    mockUseCategories.mockReturnValue({
      data: mockCategories,
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
    });

    render(<Sidebar {...defaultProps} />);
    expect(screen.getByText("Work")).toBeInTheDocument();
    expect(screen.getByText("Personal")).toBeInTheDocument();
  });

  it("applies font-bold to the All Categories button when no category is active", () => {
    mockUseCategories.mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
    });

    render(<Sidebar {...defaultProps} activeCategory={null} />);
    expect(screen.getByRole("button", { name: /all categories/i })).toHaveClass("font-bold");
  });

  it("applies font-normal to the All Categories button when a category is active", () => {
    mockUseCategories.mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
    });

    render(<Sidebar {...defaultProps} activeCategory="cat-1" />);
    expect(screen.getByRole("button", { name: /all categories/i })).toHaveClass("font-normal");
  });

  it("calls setActiveCategory(null) when All Categories is clicked", async () => {
    const setActiveCategory = vi.fn();
    const user = userEvent.setup();
    mockUseCategories.mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
    });

    render(<Sidebar {...defaultProps} setActiveCategory={setActiveCategory} />);
    await user.click(screen.getByRole("button", { name: /all categories/i }));
    expect(setActiveCategory).toHaveBeenCalledWith(null);
  });
});
