import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "outline" | "solid";
  fullWidth?: boolean;
  className?: string;
}

const Button = ({
  variant = "outline",
  fullWidth = false,
  className = "",
  children,
  ...rest
}: ButtonProps): React.JSX.Element => {
  const variantClasses =
    variant === "solid"
      ? "bg-brown text-cream border border-brown hover:bg-brown/90"
      : "border border-brown text-brown bg-transparent hover:bg-brown/5";

  const widthClass = fullWidth ? "w-full" : "";

  return (
    <button
      type="button"
      className={`rounded-full font-linter font-semibold text-sm px-5 py-2 ${variantClasses} ${widthClass} ${className}`.trim()}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;
