"use client";

import { useContext } from "react";

import { AuthContext, type AuthContextValue } from "../context/AuthContext";

export const useAuth = (): AuthContextValue => useContext(AuthContext);

export default useAuth;
