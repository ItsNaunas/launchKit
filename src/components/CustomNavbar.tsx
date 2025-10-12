"use client";
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "@/components/ui/resizable-navbar";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";

export function CustomNavbar() {
  const { user, signOut } = useAuth();
  
  const navItems = [
    {
      name: "Features",
      link: "#features",
    },
    {
      name: "How It Works",
      link: "#how-it-works",
    },
    {
      name: "Pricing",
      link: "#pricing",
    },
  ];

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <Navbar>
      {/* Desktop Navigation */}
      <NavBody>
        <NavbarLogo />
        <NavItems items={navItems} />
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link href="/dashboard">
                <NavbarButton variant="secondary">Dashboard</NavbarButton>
              </Link>
              <NavbarButton variant="secondary" onClick={signOut}>
                Sign Out
              </NavbarButton>
            </>
          ) : (
            <>
              <Link href="/auth/signin">
                <NavbarButton variant="secondary">Sign In</NavbarButton>
              </Link>
              <Link href="/start">
                <NavbarButton variant="gradient">Get Started</NavbarButton>
              </Link>
            </>
          )}
        </div>
      </NavBody>

      {/* Mobile Navigation */}
      <MobileNav>
        <MobileNavHeader>
          <NavbarLogo />
          <MobileNavToggle
            isOpen={isMobileMenuOpen}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          />
        </MobileNavHeader>

        <MobileNavMenu
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
        >
          {navItems.map((item, idx) => (
            <a
              key={`mobile-link-${idx}`}
              href={item.link}
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-gray-300 hover:text-mint-400 transition-colors duration-300 font-medium"
            >
              {item.name}
            </a>
          ))}
          <div className="flex w-full flex-col gap-3 pt-4 border-t border-white/10">
            {user ? (
              <>
                <Link href="/dashboard">
                  <NavbarButton
                    onClick={() => setIsMobileMenuOpen(false)}
                    variant="secondary"
                    className="w-full"
                  >
                    Dashboard
                  </NavbarButton>
                </Link>
                <NavbarButton
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    signOut();
                  }}
                  variant="secondary"
                  className="w-full"
                >
                  Sign Out
                </NavbarButton>
              </>
            ) : (
              <>
                <Link href="/auth/signin">
                  <NavbarButton
                    onClick={() => setIsMobileMenuOpen(false)}
                    variant="secondary"
                    className="w-full"
                  >
                    Sign In
                  </NavbarButton>
                </Link>
                <Link href="/start">
                  <NavbarButton
                    onClick={() => setIsMobileMenuOpen(false)}
                    variant="gradient"
                    className="w-full"
                  >
                    Get Started
                  </NavbarButton>
                </Link>
              </>
            )}
          </div>
        </MobileNavMenu>
      </MobileNav>
    </Navbar>
  );
}
