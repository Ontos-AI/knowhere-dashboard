import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode } from "react";

type AuthInputProps = InputHTMLAttributes<HTMLInputElement>;

export function AuthInput({ className = "", ...props }: AuthInputProps) {
  return <input {...props} className={["control-input", className].filter(Boolean).join(" ")} />;
}

type AuthButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "white" | "black";
  loading?: boolean;
  children: ReactNode;
};

export function AuthButton({
  variant = "black",
  loading = false,
  disabled,
  type = "button",
  className = "",
  children,
  ...props
}: AuthButtonProps) {
  return (
    <button
      {...props}
      type={type}
      className={`control-button control-button--${variant} ${className}`.trim()}
      disabled={disabled || loading}
      aria-busy={loading}
    >
      {loading ? <span className="control-spinner" aria-hidden="true" /> : null}
      <span className="control-button-content">{children}</span>
    </button>
  );
}
