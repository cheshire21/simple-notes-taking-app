"use client";

import { useMutation, type UseMutationResult } from "@tanstack/react-query";

import { login } from "../api";
import type { AuthTokens, LoginPayload } from "../types";

export const useLogin = (): UseMutationResult<AuthTokens, Error, LoginPayload> =>
  useMutation({ mutationFn: login });

export default useLogin;
