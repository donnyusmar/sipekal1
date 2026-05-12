"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { signOut } from "next-auth/react";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  if (status === "loading") {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-6 border border-slate-100">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-md text-sm font-medium transition-colors"
          >
            Logout
          </button>
        </div>

        <p className="text-slate-600 mb-6">
          Selamat datang, {session.user?.name}.
        </p>

        <div className="bg-blue-50 border border-blue-100 rounded-md p-4">
          <p className="font-medium text-blue-800">
            Role Anda: <span className="font-bold">{(session.user as { role?: string })?.role}</span>
          </p>
          <p className="text-sm text-blue-600 mt-1">
            (Halaman dashboard lengkap akan dibangun di Screen 2)
          </p>
        </div>
      </div>
    </div>
  );
}
