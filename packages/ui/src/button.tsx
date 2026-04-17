import * as React from "react";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "solid" | "outline";
};

export function Button({
  variant = "solid",
  style,
  ...props
}: ButtonProps) {
  const base: React.CSSProperties = {
    appearance: "none",
    borderRadius: 10,
    padding: "10px 14px",
    fontWeight: 600,
    border: "1px solid transparent",
    cursor: "pointer",
    background: "#0a0a0a",
    color: "#fff",
  };

  const outline: React.CSSProperties =
    variant === "outline"
      ? { background: "transparent", color: "#0a0a0a", borderColor: "#0a0a0a" }
      : {};

  return <button {...props} style={{ ...base, ...outline, ...style }} />;
}

