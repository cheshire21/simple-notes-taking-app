"use client";

import { useMutation, type UseMutationResult } from "@tanstack/react-query";

import { register } from "../api";
import type { AuthTokens, RegisterPayload } from "../types";

export const useRegister = (): UseMutationResult<AuthTokens, Error, RegisterPayload> =>
  useMutation({ mutationFn: register });

export default useRegister;
