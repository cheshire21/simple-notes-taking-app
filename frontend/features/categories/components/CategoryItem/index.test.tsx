import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { JSX, ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";

import CategoryItem from "@/features/categories/components/CategoryItem";

const createWrapper = () => {
  const client = new QueryClient({
    defaultOptions: { mutations: { retry: false }, queries: { retry: false } },
  });
  const Wrapper = ({ children }: { children: ReactNode }): JSX.Element => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
  return Wrapper;
};

const mockCategory = { id: "cat-1", name: "Work", color: "#e8855a", created_at: "2026-01-01" };

describe("CategoryItem", () => {
  it("renders the category name", () => {
    render(<CategoryItem category={mockCategory} isActive={false} onClick={() => {}} />, {
      wrapper: createWrapper(),
    });
    expect(screen.getByText("Work")).toBeInTheDocument();
  });

  it("applies font-bold when active", () => {
    render(<CategoryItem category={mockCategory} isActive onClick={() => {}} />, {
      wrapper: createWrapper(),
    });
    expect(screen.getByRole("button", { name: "Work" })).toHaveClass("font-bold");
  });

  it("applies font-normal when inactive", () => {
    render(<CategoryItem category={mockCategory} isActive={false} onClick={() => {}} />, {
      wrapper: createWrapper(),
    });
    expect(screen.getByRole("button", { name: "Work" })).toHaveClass("font-normal");
  });

  it("shows count when provided", () => {
    render(<CategoryItem category={mockCategory} isActive={false} onClick={() => {}} count={5} />, {
      wrapper: createWrapper(),
    });
    expect(screen.getByText("5")).toBeInTheDocument();
  });

  it("hides count when not provided", () => {
    render(<CategoryItem category={mockCategory} isActive={false} onClick={() => {}} />, {
      wrapper: createWrapper(),
    });
    expect(screen.queryByText("0")).not.toBeInTheDocument();
  });

  it("calls onClick when clicked", async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    render(<CategoryItem category={mockCategory} isActive={false} onClick={onClick} />, {
      wrapper: createWrapper(),
    });
    await user.click(screen.getByRole("button", { name: "Work" }));
    expect(onClick).toHaveBeenCalledOnce();
  });
});
