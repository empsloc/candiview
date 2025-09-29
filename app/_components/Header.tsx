"use client";

import React, { useEffect, useState } from "react";
import { useUser, UserButton, SignInButton } from "@clerk/nextjs";
import { Menu, X } from "lucide-react";
import Link from "next/link";

const Header = () => {
  const { isSignedIn, user } = useUser();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (isSignedIn && user) {
      const saveUser = async () => {
        try {
          await fetch("/api/users/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              clerkId: user.id,
              name: user.firstName + " " + (user.lastName || ""),
              email: user.emailAddresses[0]?.emailAddress,
              imageUrl: (user as any).imageUrl || "",
            }),
          });
        } catch (err) {
          console.error("Failed to save user:", err);
        }
      };
      saveUser();
    }
  }, [isSignedIn, user]);

  const navItems = [
    { name: "Candidate", url: "/dashboard/" },
    { name: "Interviewer", url: "/dashboard/interviewer" },
    { name: "About", url: "https://github.com/empsloc" },
    
  ];

  return (
    <header className="sticky top-0 z-20 w-full bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link href={"/"} className="flex items-center gap-3">
            <div className="size-8 text-primary">
              <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M24 45.8096C19.6865 45.8096 15.4698 44.5305 11.8832 42.134C8.29667 39.7376 5.50128 36.3314 3.85056 32.3462C2.19985 28.361 1.76794 23.9758 2.60947 19.7452C3.451 15.5145 5.52816 11.6284 8.57829 8.5783C11.6284 5.52817 15.5145 3.45101 19.7452 2.60948C23.9758 1.76795 28.361 2.19986 32.3462 3.85057C36.3314 5.50129 39.7376 8.29668 42.134 11.8833C44.5305 15.4698 45.8096 19.6865 45.8096 24L24 24L24 45.8096Z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-white">Candiview</h2>
          </Link>

          {/* Desktop Navigation */}
          {isSignedIn && (
            <nav className="hidden md:flex items-center gap-8">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.url}
                  className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary"
                >
                  {item.name}
                </a>
              ))}
            </nav>
          )}

          {/* Action Buttons + Mobile Menu Button */}
          <div className="flex items-center gap-2">
            {isSignedIn && (
              <button
                className="md:hidden p-2 text-slate-700 dark:text-slate-300"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu size={24} />
              </button>
            )}

            {isSignedIn ? (
              <UserButton />
            ) : (
              <SignInButton>
                <button className="flex h-10 items-center justify-center overflow-hidden rounded-full bg-primary/10 px-4 text-sm font-bold text-primary transition-colors hover:bg-primary/20">
                  Log In
                </button>
              </SignInButton>
            )}
          </div>
        </div>
      </div>

      {/* Sidebar Overlay */}
      {/* Sidebar Overlay */}
{sidebarOpen && (
  <div className="fixed inset-0 z-30 flex">
    {/* Clickable overlay */}
    <div
      className="flex-1 "
      onClick={() => setSidebarOpen(false)}
    />

    {/* Sidebar */}
    <div className="w-64 bg-white dark:bg-background-dark h-screen shadow-lg p-6 flex flex-col ml-auto">
      <button
        className="self-end mb-6 text-slate-700 dark:text-slate-300"
        onClick={() => setSidebarOpen(false)}
      >
        <X size={24} />
      </button>

      <nav className="flex flex-col gap-4">
        {navItems.map((item) => (
          <a
            key={item.name}
            href={item.url}
            className="text-base font-medium text-slate-700 dark:text-slate-300 hover:text-primary dark:hover:text-primary"
            onClick={() => setSidebarOpen(false)}
          >
            {item.name}
          </a>
        ))}
      </nav>
    </div>
  </div>
)}

    </header>
  );
};

export default Header;
