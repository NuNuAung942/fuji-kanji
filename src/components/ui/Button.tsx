import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline";
  children?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  className,
  children,
  ...props
}) => {
  const baseStyles =
    "px-8 py-3 rounded-2xl font-bold transition-all active:scale-95 shadow-lg";

  const variants = {
    primary:
      "bg-indigo-500 hover:bg-indigo-400 text-white shadow-indigo-500/30",
    secondary: "bg-slate-700 hover:bg-slate-600 text-white",
    outline: "border-2 border-indigo-500 text-indigo-500 hover:bg-indigo-50",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
