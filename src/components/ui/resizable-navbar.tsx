"use client";
import React from "react";
import { cn } from "@/lib/utils";

export const Navbar = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 w-full border-b border-white/10 bg-black/80 backdrop-blur-xl",
        className
      )}
    >
      {children}
    </nav>
  );
};

export const NavBody = ({
  children,
  className,
  visible = true,
}: {
  children: React.ReactNode;
  className?: string;
  visible?: boolean;
}) => {
  return (
    <div
      className={cn(
        "flex items-center justify-between px-6 py-4",
        !visible && "hidden",
        className
      )}
    >
      {children}
    </div>
  );
};

export const NavbarLogo = ({ className }: { className?: string }) => {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <div className="h-6 w-6 rounded-lg bg-gradient-to-br from-mint-400 to-mint-600 flex items-center justify-center">
        <span className="text-black text-sm font-bold">+</span>
      </div>
      <span className="text-xl font-semibold text-white tracking-tight">
        LaunchKit AI
      </span>
    </div>
  );
};

export const NavItems = ({
  items,
  className,
  onItemClick,
}: {
  items: Array<{ name: string; link: string }>;
  className?: string;
  onItemClick?: () => void;
}) => {
  return (
    <div className={cn("hidden md:flex items-center space-x-8", className)}>
      {items.map((item, idx) => (
        <a
          key={`nav-link-${idx}`}
          href={item.link}
          onClick={onItemClick}
          className="text-sm text-gray-300 hover:text-mint-400 transition-colors duration-300 font-medium"
        >
          {item.name}
        </a>
      ))}
    </div>
  );
};

export const NavbarButton = ({
  children,
  className,
  variant = "primary",
  href,
  as: Component = href ? "a" : "button",
  ...props
}: {
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "secondary" | "dark" | "gradient";
  href?: string;
  as?: React.ElementType;
  [key: string]: any;
}) => {
  const baseClasses = "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300";
  
  const variantClasses = {
    primary: "bg-mint-500 text-black hover:bg-mint-600 shadow-lg shadow-mint-500/25",
    secondary: "border border-mint-600/30 text-mint-400 hover:bg-mint-600/10 hover:border-mint-500",
    dark: "bg-gray-800 text-white hover:bg-gray-700",
    gradient: "bg-gradient-to-r from-mint-500 to-mint-600 text-black hover:from-mint-600 hover:to-mint-700 shadow-lg shadow-mint-500/25",
  };

  return (
    <Component
      href={href}
      className={cn(baseClasses, variantClasses[variant], className)}
      {...props}
    >
      {children}
    </Component>
  );
};

export const MobileNav = ({
  children,
  className,
  visible = false,
}: {
  children: React.ReactNode;
  className?: string;
  visible?: boolean;
}) => {
  return (
    <div
      className={cn(
        "md:hidden",
        !visible && "hidden",
        className
      )}
    >
      {children}
    </div>
  );
};

export const MobileNavHeader = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex items-center justify-between px-6 py-4", className)}>
      {children}
    </div>
  );
};

export const MobileNavToggle = ({
  isOpen,
  onClick,
  className,
}: {
  isOpen: boolean;
  onClick: () => void;
  className?: string;
}) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-center w-8 h-8 space-y-1",
        className
      )}
    >
      <span
        className={cn(
          "w-6 h-0.5 bg-white transition-all duration-300",
          isOpen && "rotate-45 translate-y-1.5"
        )}
      />
      <span
        className={cn(
          "w-6 h-0.5 bg-white transition-all duration-300",
          isOpen && "opacity-0"
        )}
      />
      <span
        className={cn(
          "w-6 h-0.5 bg-white transition-all duration-300",
          isOpen && "-rotate-45 -translate-y-1.5"
        )}
      />
    </button>
  );
};

export const MobileNavMenu = ({
  children,
  className,
  isOpen,
  onClose,
}: {
  children: React.ReactNode;
  className?: string;
  isOpen: boolean;
  onClose: () => void;
}) => {
  return (
    <div
      className={cn(
        "absolute top-full left-0 right-0 bg-black/95 backdrop-blur-xl border-t border-white/10 transition-all duration-300",
        isOpen ? "opacity-100 visible" : "opacity-0 invisible",
        className
      )}
    >
      <div className="px-6 py-8 space-y-6">
        {children}
      </div>
    </div>
  );
};
