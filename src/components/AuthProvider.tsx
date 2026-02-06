"use client";

import AuthGuard from "./AuthGuard";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  return <AuthGuard>{children}</AuthGuard>;
}
