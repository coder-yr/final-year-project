"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DataTable } from "../data-table";
import { columns as allTrainsColumns } from "../all-trains-columns";
import { AddTrainForm } from "../add-train-form";
import type { Train } from "@/lib/types";
import { TrainFront, Plus, List } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TrainViewProps {
    trains: Train[];
}

export function TrainView({ trains }: TrainViewProps) {
    const [activeTab, setActiveTab] = useState("all-trains");

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900">Train Management</h2>
                    <p className="text-muted-foreground">Manage railway schedules and stations.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="border-l-4 border-l-indigo-500 shadow-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Trains</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{trains.length}</div>
                        <p className="text-xs text-muted-foreground">Active schedules</p>
                    </CardContent>
                </Card>
                <Card className="border-l-4 border-l-purple-500 shadow-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Active Routes</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">8</div>
                        <p className="text-xs text-muted-foreground">Major junctions</p>
                    </CardContent>
                </Card>
                <Card className="border-l-4 border-l-red-500 shadow-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Delays Today</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">0</div>
                        <p className="text-xs text-muted-foreground">All trains on time</p>
                    </CardContent>
                </Card>
            </div>

            <Tabs defaultValue="all-trains" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                <TabsList className="bg-slate-100 p-1">
                    <TabsTrigger value="all-trains" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                        <List className="mr-2 h-4 w-4" /> All Trains
                    </TabsTrigger>
                    <TabsTrigger value="add-train" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                        <Plus className="mr-2 h-4 w-4" /> Add New Train
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="all-trains" className="space-y-4">
                    <Card className="border-none shadow-sm overflow-hidden">
                        <CardHeader className="bg-white border-b px-6 py-4 flex flex-row items-center justify-between">
                            <CardTitle className="text-base font-semibold">Railway Overview</CardTitle>
                            <Button variant="outline" size="sm">Export Schedule</Button>
                        </CardHeader>
                        <CardContent className="p-0">
                            <DataTable columns={allTrainsColumns} data={trains} />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="add-train">
                    <Card className="border-none shadow-sm">
                        <CardHeader>
                            <CardTitle>Add New Train</CardTitle>
                            <CardDescription>Enter details to add a new train schedule.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <AddTrainForm />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
