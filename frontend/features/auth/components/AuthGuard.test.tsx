import { render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import AuthGuard from "@/features/auth/components/AuthGuard";

const { mockReplace, mockUseAuth } = vi.hoisted(() => ({
  mockReplace: vi.fn(),
  mockUseAuth: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: mockReplace }),
}));

vi.mock("@/features/auth/hooks/useAuth", () => ({
  useAuth: mockUseAuth,
  default: mockUseAuth,
}));

afterEach(() => {
  mockReplace.mockClear();
  mockUseAuth.mockClear();
});

describe("AuthGuard", () => {
  describe("requireAuth = true", () => {
    it("renders children when the user is authenticated", () => {
      mockUseAuth.mockReturnValue({ token: "access-token", isAuthenticated: true });

      render(
        <AuthGuard requireAuth>
          <div>Protected Content</div>
        </AuthGuard>,
      );

      expect(screen.getByText("Protected Content")).toBeInTheDocument();
    });

    it("renders nothing when the user is unauthenticated", () => {
      mockUseAuth.mockReturnValue({ token: null, isAuthenticated: false });

      render(
        <AuthGuard requireAuth>
          <div>Protected Content</div>
        </AuthGuard>,
      );

      expect(screen.queryByText("Protected Content")).not.toBeInTheDocument();
    });

    it("redirects to /login when the user is unauthenticated", async () => {
      mockUseAuth.mockReturnValue({ token: null, isAuthenticated: false });

      render(
        <AuthGuard requireAuth>
          <div>Protected Content</div>
        </AuthGuard>,
      );

      await waitFor(() => expect(mockReplace).toHaveBeenCalledWith("/login"));
    });

    it("does not redirect when the user is authenticated", async () => {
      mockUseAuth.mockReturnValue({ token: "access-token", isAuthenticated: true });

      render(
        <AuthGuard requireAuth>
          <div>Protected Content</div>
        </AuthGuard>,
      );

      await waitFor(() => expect(mockReplace).not.toHaveBeenCalled());
    });
  });

  describe("requireAuth = false", () => {
    it("renders children when the user is unauthenticated", () => {
      mockUseAuth.mockReturnValue({ token: null, isAuthenticated: false });

      render(
        <AuthGuard requireAuth={false}>
          <div>Public Content</div>
        </AuthGuard>,
      );

      expect(screen.getByText("Public Content")).toBeInTheDocument();
    });

    it("renders nothing when the user is already authenticated", () => {
      mockUseAuth.mockReturnValue({ token: "access-token", isAuthenticated: true });

      render(
        <AuthGuard requireAuth={false}>
          <div>Public Content</div>
        </AuthGuard>,
      );

      expect(screen.queryByText("Public Content")).not.toBeInTheDocument();
    });

    it("redirects to / when the user is already authenticated", async () => {
      mockUseAuth.mockReturnValue({ token: "access-token", isAuthenticated: true });

      render(
        <AuthGuard requireAuth={false}>
          <div>Public Content</div>
        </AuthGuard>,
      );

      await waitFor(() => expect(mockReplace).toHaveBeenCalledWith("/"));
    });

    it("does not redirect when the user is unauthenticated", async () => {
      mockUseAuth.mockReturnValue({ token: null, isAuthenticated: false });

      render(
        <AuthGuard requireAuth={false}>
          <div>Public Content</div>
        </AuthGuard>,
      );

      await waitFor(() => expect(mockReplace).not.toHaveBeenCalled());
    });
  });
});
