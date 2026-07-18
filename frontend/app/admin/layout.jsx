"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth, AuthProvider } from "@/lib/auth-context";
import { AdminShell } from "@/components/admin/shell";

function AdminGuard({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.push("/admin/login");
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ink-900">
        <div className="w-12 h-12 border-4 border-gold-600/30 border-t-gold-300 rounded-full animate-spin" />
      </div>
    );
  }
  if (!user) return null;
  return <AdminShell>{children}</AdminShell>;
}

export default function AdminLayout({ children }) {
  return (
    <AuthProvider>
      <AdminGuard>{children}</AdminGuard>
    </AuthProvider>
  );
}