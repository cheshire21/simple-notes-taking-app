"use client";

import { useMutation, type UseMutationResult } from "@tanstack/react-query";

import { register } from "../api";
import type { AuthTokens, RegisterPayload } from "../types";

export const useRegister = (): UseMutationResult<AuthTokens, Error, RegisterPayload> =>
  useMutation({
    mutationFn: register,
    onSuccess: (data) => {
      localStorage.setItem("access_token", data.access);
      localStorage.setItem("refresh_token", data.refresh);
    },
  });

export default useRegister;
