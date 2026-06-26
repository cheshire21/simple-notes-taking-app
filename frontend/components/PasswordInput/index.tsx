"use client";

import { type InputHTMLAttributes, type JSX, useState } from "react";

import { Input } from "@/components/ui/input";

import EyeClosedIcon from "./EyeClosedIcon";
import EyeOpenIcon from "./EyeOpenIcon";

type PasswordInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type">;

const PasswordInput = ({ ...rest }: PasswordInputProps): JSX.Element => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <Input type={showPassword ? "text" : "password"} {...rest} />
      <button
        type="button"
        onClick={() => setShowPassword((prev) => !prev)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-brown"
      >
        {showPassword ? <EyeOpenIcon /> : <EyeClosedIcon />}
      </button>
    </div>
  );
};

export default PasswordInput;
