
"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { OwnerDashboard } from "@/components/features/owner/owner-dashboard";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function OwnerPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user || user.role !== 'owner') {
        router.push('/');
      }
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || user.role !== 'owner') {
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 pt-32 pb-12 relative overflow-hidden">
        {/* Animated Gradient Orbs Background (Consistent with Auth Pages) */}
        <div className="absolute inset-0 z-0 bg-slate-50 dark:bg-slate-950">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-teal-400/20 blur-[100px] animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-rose-400/20 blur-[100px] animate-pulse delay-1000" />
          <div className="absolute top-[30%] right-[30%] w-[30%] h-[30%] rounded-full bg-blue-400/20 blur-[80px] animate-pulse delay-700" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <OwnerDashboard />
        </div>
      </main>
      <Footer />
    </div>
  );
}
