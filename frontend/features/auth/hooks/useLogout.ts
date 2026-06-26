"use client";

import { useMutation, type UseMutationResult } from "@tanstack/react-query";

import { logout } from "../api";

export const useLogout = (): UseMutationResult<void, Error, void> =>
  useMutation({ mutationFn: logout });

export default useLogout;
