"use client";

import { Flight } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plane, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { formatINR } from "@/lib/utils";
import { useState } from "react";

interface FlightViewProps {
    flights: Flight[];
}

export function FlightView({ flights }: FlightViewProps) {
    const [searchTerm, setSearchTerm] = useState("");

    const filteredFlights = flights.filter(f =>
        f.airline.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.depart.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.arrive.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900">Flight Management</h2>
                    <p className="text-muted-foreground">Manage airlines and routes.</p>
                </div>
                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2">
                    <Plane className="h-4 w-4" /> Add Flight
                </Button>
            </div>

            <Card className="border-slate-200 shadow-sm">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>All Flights</CardTitle>
                            <CardDescription>A complete list of flights available.</CardDescription>
                        </div>
                        <div className="relative w-64">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
                            <Input
                                placeholder="Search airlines, routes..."
                                className="pl-8"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Airline</TableHead>
                                <TableHead>Route</TableHead>
                                <TableHead>Duration</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead>Stops</TableHead>
                                <TableHead className="text-right">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredFlights.length > 0 ? filteredFlights.map((flight) => (
                                <TableRow key={flight.id}>
                                    <TableCell className="font-medium">
                                        <div className="flex items-center gap-2">
                                            <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center">
                                                <Plane className="h-4 w-4 text-emerald-600" />
                                            </div>
                                            {flight.airline}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-medium">{flight.depart} → {flight.arrive}</span>
                                            <span className="text-xs text-muted-foreground">{flight.depart} - {flight.arrive}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>{flight.duration}</TableCell>
                                    <TableCell>{flight.price}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className={flight.stops === 'Non-stop' ? "bg-green-50 text-green-700 border-green-200" : ""}>
                                            {flight.stops}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="sm">Edit</Button>
                                    </TableCell>
                                </TableRow>
                            )) : (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                                        No flights found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
