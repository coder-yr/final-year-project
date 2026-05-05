"use client";

import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    PieChart,
    Users,
    Building,
    CalendarDays,
    ArrowRightLeft,
    Wallet,
    MessageSquare,
    HelpCircle,
    Settings,
    HeadphonesIcon,
    LogOut,
    TrainFront,
    Plane
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
    activeTab: string;
    onTabChange: (tab: string) => void;
}

export function Sidebar({ className, activeTab, onTabChange }: SidebarProps) {
    const { logout } = useAuth();
    const menuItems = [
        { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
        { id: "analytic", label: "Analytics", icon: PieChart },
        { id: "hotels", label: "Hotels", icon: Building },
        { id: "bus-system", label: "Bus System", icon: CalendarDays },
        { id: "train-system", label: "Train System", icon: TrainFront },
        { id: "flight-system", label: "Flight System", icon: Plane },
        { id: "bookings", label: "Bookings", icon: CalendarDays },
        { id: "guests", label: "Guests", icon: Users },
        { id: "transaction", label: "Transactions", icon: ArrowRightLeft },
        { id: "messages", label: "Messages", icon: MessageSquare },
    ];

    const bottomItems = [
        { id: "user-guide", label: "User Guide", icon: HelpCircle },
        { id: "faq", label: "FAQ", icon: HelpCircle },
        { id: "help-center", label: "Help Center", icon: HeadphonesIcon },
    ];

    return (
        <div className={cn("w-72 border-r h-full bg-white dark:bg-slate-950 flex flex-col font-sans transition-all duration-300", className)}>
            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto py-8 space-y-6">
                {/* Branding */}
                <div className="px-8 flex items-center gap-3">
                    <div className="h-10 w-10 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-500/20">
                        TA
                    </div>
                    <div>
                        <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">TravelAdmin</h2>
                        <p className="text-xs text-slate-500 font-medium tracking-wide uppercase">Control Center</p>
                    </div>
                </div>

                {/* Search */}
                <div className="px-6">
                    <div className="relative group">
                        <input
                            type="text"
                            placeholder="Search..."
                            className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-2xl px-10 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:bg-white dark:focus:bg-slate-800 transition-all shadow-sm"
                        />
                        <div className="absolute left-3 top-3 text-slate-400 group-focus-within:text-teal-600 transition-colors">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <circle cx="11" cy="11" r="8" />
                                <path d="m21 21-4.3-4.3" />
                            </svg>
                        </div>
                        <div className="absolute right-3 top-3.5 text-[10px] font-bold text-slate-300 border border-slate-200 px-1.5 py-0.5 rounded">
                            ⌘K
                        </div>
                    </div>
                </div>

                {/* Menu */}
                <div className="px-4">
                    <div className="space-y-1.5">
                        <p className="px-4 text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 mt-4">Menu</p>
                        {menuItems.map((item) => (
                            <Button
                                key={item.id}
                                variant="ghost"
                                className={cn(
                                    "w-full justify-start gap-3 pl-4 py-6 font-medium relative overflow-hidden rounded-2xl transition-all duration-300",
                                    activeTab === item.id
                                        ? "bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-lg shadow-teal-500/25 hover:shadow-teal-500/30 hover:from-teal-600 hover:to-teal-700"
                                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-900 dark:hover:bg-slate-900/50 dark:text-slate-400"
                                )}
                                onClick={() => onTabChange(item.id)}
                            >
                                <item.icon className={cn("h-5 w-5 transition-transform duration-300", activeTab === item.id ? "scale-110" : "group-hover:scale-110")} />
                                <span className="text-base">{item.label}</span>
                                {activeTab === item.id && (
                                    <div className="absolute right-3 w-1.5 h-1.5 rounded-full bg-white/40 animate-pulse" />
                                )}
                            </Button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom Actions */}
            <div className="mt-auto px-4 py-6 border-t border-slate-100 dark:border-slate-800 space-y-2 bg-white dark:bg-slate-950 z-10 relative">
                <p className="px-4 text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Support</p>
                {bottomItems.map((item) => (
                    <Button
                        key={item.id}
                        variant="ghost"
                        className="w-full justify-start gap-3 pl-4 font-medium text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-xl h-11"
                    >
                        <item.icon className="h-4 w-4" />
                        {item.label}
                    </Button>
                ))}
                <Button
                    variant="ghost"
                    className="w-full justify-start gap-3 pl-4 font-medium text-red-500 hover:text-red-600 hover:bg-red-50 rounded-xl h-11 mt-4"
                    onClick={logout}
                >
                    <LogOut className="h-4 w-4" />
                    Logout
                </Button>
            </div>
        </div>
    );
}
