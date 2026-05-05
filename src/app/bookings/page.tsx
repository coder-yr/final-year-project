
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { BookingsDashboard } from "@/components/features/booking/components/bookings-dashboard";
import { BookMarked } from "lucide-react";

export default function BookingsPage() {
  return (
    <div className="flex flex-col min-h-screen font-sans text-slate-900 dark:text-foreground">
      <Header />
      <main className="flex-1 pt-24 pb-12 relative overflow-hidden">
        {/* Animated Gradient Orbs Background */}
        <div className="absolute inset-0 z-0 bg-slate-50 dark:bg-slate-950">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-teal-400/20 blur-[100px] animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-rose-400/20 blur-[100px] animate-pulse delay-1000" />
          <div className="absolute top-[30%] right-[30%] w-[30%] h-[30%] rounded-full bg-blue-400/20 blur-[80px] animate-pulse delay-700" />
        </div>

        <div className="container mx-auto px-4 relative z-10 min-h-[60vh]">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-4 bg-white/50 dark:bg-slate-800/50 backdrop-blur-md rounded-2xl shadow-sm border border-white/20">
              <BookMarked className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-4xl font-headline font-bold text-slate-900 dark:text-white">My Bookings</h1>
              <p className="text-slate-500 dark:text-slate-400 text-lg">Manage your upcoming and past trips</p>
            </div>
          </div>

          <BookingsDashboard />
        </div>
      </main>
      <Footer />
    </div>
  );
}
