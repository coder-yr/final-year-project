"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DataTable } from "../data-table";
import { columns as allBusesColumns } from "../all-buses-columns";
import { AddBusForm } from "../add-bus-form";
import type { Bus } from "@/lib/types";
import { Bus as BusIcon, Plus, List } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface BusViewProps {
    buses: Bus[];
}

export function BusView({ buses }: BusViewProps) {
    const [activeTab, setActiveTab] = useState("all-buses");

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-foreground">Bus Management</h2>
                    <p className="text-muted-foreground">Manage your fleet, routes, and schedules.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="border-l-4 border-l-orange-500 shadow-sm bg-card">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Buses</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-foreground">{buses.length}</div>
                        <p className="text-xs text-muted-foreground">Active in fleet</p>
                    </CardContent>
                </Card>
                <Card className="border-l-4 border-l-teal-500 shadow-sm bg-card">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Routes Covered</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-foreground">12</div>
                        <p className="text-xs text-muted-foreground">Across 5 states</p>
                    </CardContent>
                </Card>
                <Card className="border-l-4 border-l-pink-500 shadow-sm bg-card">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Avg. Occupancy</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-foreground">78%</div>
                        <p className="text-xs text-muted-foreground">Past 30 days</p>
                    </CardContent>
                </Card>
            </div>

            <Tabs defaultValue="all-buses" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                <div className="flex items-center justify-between">
                    <TabsList className="bg-muted p-1">
                        <TabsTrigger value="all-buses" className="data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm">
                            <List className="mr-2 h-4 w-4" /> All Buses
                        </TabsTrigger>
                        <TabsTrigger value="add-bus" className="data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm">
                            <Plus className="mr-2 h-4 w-4" /> Add New Bus
                        </TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value="all-buses" className="space-y-4">
                    <Card className="border-none shadow-sm overflow-hidden bg-card">
                        <CardHeader className="bg-card border-b border-border px-6 py-4 flex flex-row items-center justify-between">
                            <CardTitle className="text-base font-semibold text-foreground">Fleet Overview</CardTitle>
                            <Button variant="outline" size="sm">Export Data</Button>
                        </CardHeader>
                        <CardContent className="p-0">
                            <DataTable columns={allBusesColumns} data={buses} />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="add-bus">
                    <Card className="border-none shadow-sm bg-card">
                        <CardHeader>
                            <CardTitle className="text-foreground">Add New Bus</CardTitle>
                            <CardDescription>Enter details to register a new bus in the system.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <AddBusForm />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
