"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DataTable } from "../data-table";
import { columns as allUsersColumns } from "../all-users-columns";
import type { User } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Download, Filter } from "lucide-react";

interface GuestsViewProps {
    users: User[];
}

export function GuestsView({ users }: GuestsViewProps) {
    const totalGuests = users.length;
    // Mock data for demonstration - in real app would come from DB
    const activeToday = Math.floor(totalGuests * 0.4);
    const newThisMonth = Math.floor(totalGuests * 0.1);

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900">Guests & Users</h2>
                    <p className="text-muted-foreground">Manage authorized users and their roles.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="h-9">
                        <Filter className="mr-2 h-4 w-4" /> Filter
                    </Button>
                    <Button variant="default" size="sm" className="h-9 bg-indigo-600 hover:bg-indigo-700">
                        <Download className="mr-2 h-4 w-4" /> Export CSV
                    </Button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="border-l-4 border-l-blue-500 shadow-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalGuests}</div>
                        <p className="text-xs text-muted-foreground">+2.5% from last month</p>
                    </CardContent>
                </Card>
                <Card className="border-l-4 border-l-green-500 shadow-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Active Today</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{activeToday}</div>
                        <p className="text-xs text-muted-foreground">~12% of total base</p>
                    </CardContent>
                </Card>
                <Card className="border-l-4 border-l-purple-500 shadow-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">New This Month</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{newThisMonth}</div>
                        <p className="text-xs text-muted-foreground">+18 new registrations</p>
                    </CardContent>
                </Card>
            </div>

            <Card className="border-none shadow-sm overflow-hidden">
                <CardHeader className="bg-white border-b px-6 py-4">
                    <CardTitle className="text-base font-semibold">User Directory</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <DataTable columns={allUsersColumns} data={users} />
                </CardContent>
            </Card>
        </div>
    );
}
