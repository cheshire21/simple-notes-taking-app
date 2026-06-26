"use client";

import { useMutation, type UseMutationResult } from "@tanstack/react-query";

import { logout } from "../api";

export const useLogout = (): UseMutationResult<void, Error, void> =>
  useMutation({
    mutationFn: logout,
    onSuccess: () => {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
    },
  });

export default useLogout;
