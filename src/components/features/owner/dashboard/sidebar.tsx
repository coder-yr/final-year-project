
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    LayoutDashboard,
    Building2,
    BedDouble,
    CalendarDays,
    IndianRupee,
    Video,
    Settings,
    LogOut
} from "lucide-react";

interface SidebarProps {
    activeSection: string;
    onSelectSection: (section: string) => void;
    className?: string;
}

export function Sidebar({ activeSection, onSelectSection, className }: SidebarProps) {
    const navItems = [
        { id: 'overview', label: 'Dashboard Overview', icon: LayoutDashboard },
        { id: 'details', label: 'Hotel Details', icon: Building2 },
        { id: 'rooms', label: 'Room Management', icon: BedDouble },
        { id: 'bookings', label: 'Bookings', icon: CalendarDays },
        { id: 'pricing', label: 'Pricing', icon: IndianRupee },
        { id: 'virtual-tour', label: 'Virtual Tour', icon: Video, badge: 'Optional' },
        { id: 'settings', label: 'Settings', icon: Settings },
    ];

    return (
        <div className={cn("flex flex-col h-full bg-slate-900 text-slate-100", className)}>
            <div className="p-6 border-b border-slate-800">
                <h2 className="text-xl font-bold font-headline tracking-tight text-white flex items-center gap-2">
                    <Building2 className="h-6 w-6 text-teal-400" />
                    Hotel Admin
                </h2>
            </div>

            <div className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeSection === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => onSelectSection(item.id)}
                            className={cn(
                                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                                isActive
                                    ? "bg-teal-600/10 text-teal-400 shadow-sm"
                                    : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
                            )}
                        >
                            <Icon className={cn("h-5 w-5", isActive ? "text-teal-400" : "text-slate-500")} />
                            <span className="flex-1 text-left">{item.label}</span>
                            {item.badge && (
                                <span className="text-[10px] uppercase font-bold tracking-wider bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded">
                                    {item.badge}
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>

            <div className="p-4 border-t border-slate-800">
                <div className="rounded-xl bg-slate-800/50 p-4">
                    <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Need Help?</h4>
                    <p className="text-xs text-slate-500 mb-3">Check our documentation for adding virtual tours.</p>
                    <Button variant="outline" size="sm" className="w-full text-xs h-8 border-slate-700 hover:bg-slate-700 hover:text-white bg-transparent">
                        View Docs
                    </Button>
                </div>
            </div>
        </div>
    );
}
