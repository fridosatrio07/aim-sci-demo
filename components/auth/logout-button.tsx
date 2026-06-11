"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { logout } from "@/lib/auth";
import { navigateToAppRoute } from "@/lib/static-navigation";

export function LogoutButton() {
  const router = useRouter();

  function handleLogout() {
    logout();
    navigateToAppRoute(router, "/login", "replace");
  }

  return (
    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full" onClick={handleLogout} aria-label="Logout">
      <LogOut className="h-4 w-4" aria-hidden="true" />
    </Button>
  );
}
