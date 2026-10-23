"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  PlusCircle,
  FolderTree,
  Tag as TagIcon,
  LogOut,
  ExternalLink,
  Shield,
  Menu,
  X,
  User,
  Clock,
} from "lucide-react";

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string | null;
}

// 15 minutes of idle inactivity before automatic logout
const INACTIVITY_TIMEOUT_MS = 15 * 60 * 1000;
const SESSION_STORAGE_KEY = "statetostate_admin_session";
const ACTIVITY_STORAGE_KEY = "statetostate_last_activity";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const lastActivityRef = useRef<number>(Date.now());
  const isLoggingOutRef = useRef<boolean>(false);

  // If on login page, render clean container without sidebar
  const isLoginPage = pathname === "/admin/login";

  const handleLogout = useCallback(
    async (reason: "logged_out" | "inactivity" | "tab_closed" = "logged_out") => {
      if (isLoggingOutRef.current) return;
      isLoggingOutRef.current = true;

      // Clear tab session tokens
      try {
        sessionStorage.removeItem(SESSION_STORAGE_KEY);
        sessionStorage.removeItem(ACTIVITY_STORAGE_KEY);
      } catch {
        // ignore
      }

      try {
        await fetch("/api/auth/logout", { method: "POST" });
      } catch {
        // Proceed with redirect even if network hiccups
      }

      // Hard redirect to clear all in-memory client state and require re-authentication
      window.location.href = `/admin/login?reason=${reason}`;
    },
    []
  );

  // Tab closure & active session validation
  useEffect(() => {
    if (isLoginPage) return;

    // Check if this tab has an active admin session token
    const tabSession = sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (!tabSession) {
      // User closed the tab previously and opened a new tab/window, or navigated directly
      handleLogout("tab_closed");
      return;
    }

    // Verify active session with backend
    fetch("/api/auth/me")
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error();
      })
      .then((data) => {
        if (data.authenticated) {
          setCurrentUser(data.user);
          // Sync activity time
          const now = Date.now();
          lastActivityRef.current = now;
          sessionStorage.setItem(ACTIVITY_STORAGE_KEY, now.toString());
        } else {
          handleLogout("logged_out");
        }
      })
      .catch(() => {
        handleLogout("logged_out");
      });
  }, [pathname, isLoginPage, handleLogout]);

  // Robust 15-minute inactivity auto-logout listener
  useEffect(() => {
    if (isLoginPage) return;

    // Check inactivity status
    const checkInactivity = () => {
      const now = Date.now();
      const storedTime = parseInt(sessionStorage.getItem(ACTIVITY_STORAGE_KEY) || "0", 10);
      const lastActive = Math.max(lastActivityRef.current, storedTime);

      if (lastActive > 0 && now - lastActive >= INACTIVITY_TIMEOUT_MS) {
        handleLogout("inactivity");
        return true;
      }
      return false;
    };

    // User interaction listener (throttled)
    const onUserActivity = () => {
      const now = Date.now();
      const storedTime = parseInt(sessionStorage.getItem(ACTIVITY_STORAGE_KEY) || "0", 10);
      const lastActive = Math.max(lastActivityRef.current, storedTime);

      // If user was away for 15+ minutes, immediately log them out instead of resetting the timer!
      if (lastActive > 0 && now - lastActive >= INACTIVITY_TIMEOUT_MS) {
        handleLogout("inactivity");
        return;
      }

      // Throttle updates to at most once every 3 seconds to avoid event spam
      if (now - lastActivityRef.current > 3000) {
        lastActivityRef.current = now;
        try {
          sessionStorage.setItem(ACTIVITY_STORAGE_KEY, now.toString());
        } catch {
          // ignore
        }
      }
    };

    // Tab visibility change (e.g. user returns from another tab or unlocked screen)
    const onVisibilityChange = () => {
      if (!document.hidden) {
        if (!checkInactivity()) {
          const now = Date.now();
          lastActivityRef.current = now;
          sessionStorage.setItem(ACTIVITY_STORAGE_KEY, now.toString());
        }
      }
    };

    const events = ["mousedown", "mousemove", "keydown", "scroll", "touchstart", "click"];
    events.forEach((eventName) => {
      window.addEventListener(eventName, onUserActivity, { passive: true });
    });
    document.addEventListener("visibilitychange", onVisibilityChange);

    // Periodic heartbeat check every 10 seconds
    const intervalId = setInterval(() => {
      checkInactivity();
    }, 10000);

    return () => {
      events.forEach((eventName) => {
        window.removeEventListener(eventName, onUserActivity);
      });
      document.removeEventListener("visibilitychange", onVisibilityChange);
      clearInterval(intervalId);
    };
  }, [isLoginPage, handleLogout]);

  if (isLoginPage) {
    return <>{children}</>;
  }

  const navItems = [
    { label: "Overview", href: "/admin", icon: LayoutDashboard },
    { label: "All Posts", href: "/admin/posts", icon: FileText },
    { label: "Create Post", href: "/admin/posts/new", icon: PlusCircle },
    { label: "Categories", href: "/admin/categories", icon: FolderTree },
    { label: "Tags", href: "/admin/tags", icon: TagIcon },
  ];

  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-zinc-50 dark:bg-zinc-950">
      {/* Mobile Sidebar Toggle Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-zinc-900 text-white shadow-xl lg:hidden dark:bg-white dark:text-zinc-900 cursor-pointer"
        aria-label="Toggle Admin Menu"
      >
        {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Admin Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 transform border-r border-zinc-200 bg-white p-6 transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 dark:border-zinc-800 dark:bg-zinc-900/90 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col justify-between h-full">
          <div>
            {/* Admin Header */}
            <div className="flex items-center gap-2 pb-6 border-b border-zinc-100 dark:border-zinc-800">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-900 text-white dark:bg-white dark:text-zinc-900">
                <Shield className="h-4 w-4 text-blue-500" />
              </div>
              <div>
                <h2 className="font-serif text-sm font-bold text-zinc-900 dark:text-white">
                  StateToState Desk
                </h2>
                <span className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
                  ● Admin Session Active
                </span>
              </div>
            </div>

            {/* Inactivity Security Pill */}
            <div className="mt-3 flex items-center gap-1.5 rounded-lg bg-zinc-100/80 px-2.5 py-1.5 text-[10px] text-zinc-600 dark:bg-zinc-800/60 dark:text-zinc-400">
              <Clock className="h-3 w-3 text-blue-500 shrink-0" />
              <span>Auto-logout on 15m idle & tab close</span>
            </div>

            {/* Navigation links */}
            <nav className="mt-5 space-y-1.5">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-colors ${
                      isActive
                        ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900"
                        : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Footer User Info & Logout */}
          <div className="border-t border-zinc-100 pt-4 dark:border-zinc-800 space-y-3">
            {currentUser && (
              <div className="flex items-center gap-3 px-2 py-1">
                {currentUser.avatar ? (
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-200 text-zinc-700 dark:bg-zinc-700 dark:text-zinc-300">
                    <User className="h-4 w-4" />
                  </div>
                )}
                <div className="overflow-hidden">
                  <div className="truncate text-xs font-semibold text-zinc-900 dark:text-white">
                    {currentUser.name}
                  </div>
                  <div className="truncate text-[10px] text-zinc-400">
                    {currentUser.role}
                  </div>
                </div>
              </div>
            )}

            <div className="flex flex-col gap-1">
              <Link
                href="/"
                target="_blank"
                className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                <span>View Public Site</span>
              </Link>
              <button
                onClick={() => handleLogout("logged_out")}
                className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30 cursor-pointer"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Admin Content View */}
      <main className="flex-1 p-6 sm:p-8 lg:p-10 max-w-7xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
}
