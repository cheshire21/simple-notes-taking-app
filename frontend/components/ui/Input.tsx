"use client";

import type { InputHTMLAttributes, JSX } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

const Input = ({ error, className = "", ...rest }: InputProps): JSX.Element => (
  <input
    className={`w-full rounded-lg border ${error ? "border-red-400" : "border-brown/40"} bg-white/60 px-4 py-2.5 text-sm text-brown placeholder:text-brown/40 focus:outline-none focus:ring-1 focus:ring-brown/40 ${className}`.trim()}
    {...rest}
  />
);

export default Input;
