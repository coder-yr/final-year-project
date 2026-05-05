"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
    TableHead
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { DataTable } from "../data-table";
import { columns as allHotelsColumns } from "../all-hotels-columns";
import type { Hotel, Room } from "@/lib/types";
import { Check, X, User as UserIcon, MapPin, Building, BedDouble, PlusCircle } from "lucide-react";
import Image from "next/image";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { runQualityCheckForHotel } from "@/lib/quality-control";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { ShieldAlert } from "lucide-react";

interface PropertyViewProps {
    pendingHotels: Hotel[];
    pendingRooms: Room[];
    allHotels: Hotel[];
    onHotelAction: (id: string, action: 'approve' | 'reject') => void;
    onRoomAction: (id: string, action: 'approve' | 'reject') => void;
    isPending: boolean;
}

import { VerifyHotelDialog } from "../verify-hotel-dialog";
import { Eye } from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function PropertyView({
    pendingHotels,
    pendingRooms,
    allHotels,
    onHotelAction,
    onRoomAction,
    isPending: parentIsPending
}: PropertyViewProps) {
    const { toast } = useToast();
    const [auditRunning, setAuditRunning] = useState(false);
    const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
    const [isVerifyDialogOpen, setIsVerifyDialogOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("active");

    // Combine loading states
    const isPending = parentIsPending || auditRunning;

    const handleInspect = (hotel: Hotel) => {
        setSelectedHotel(hotel);
        setIsVerifyDialogOpen(true);
    };

    const handleDialogAction = (id: string, action: 'approve' | 'reject') => {
        onHotelAction(id, action);
        setIsVerifyDialogOpen(false);
    };

    const handleQualityAudit = async () => {
        setAuditRunning(true);
        let warnings = 0;
        let suspensions = 0;

        try {
            await Promise.all(allHotels.map(async (hotel) => {
                const result = await runQualityCheckForHotel(hotel);
                if (result?.status === 'warning_sent') warnings++;
                if (result?.status === 'suspended') suspensions++;
            }));

            toast({
                title: "Quality Audit Complete",
                description: `Sent ${warnings} warnings and suspended ${suspensions} accounts based on rating.`,
                variant: (warnings > 0 || suspensions > 0) ? "destructive" : "default"
            });
        } catch (error) {
            console.error("Audit failed", error);
            toast({
                title: "Audit Failed",
                description: "Could not complete quality check.",
                variant: "destructive"
            });
        } finally {
            setAuditRunning(false);
        }
    };
    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-foreground">Hotel Management</h2>
                    <p className="text-muted-foreground">Oversee listings, approvals, and quality assurance.</p>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        onClick={handleQualityAudit}
                        disabled={isPending}
                        className="text-amber-600 hover:text-amber-700 bg-transparent hover:bg-amber-50 dark:hover:bg-amber-900/20 border-amber-200 dark:border-amber-900"
                    >
                        <ShieldAlert className="mr-2 h-4 w-4" /> Run Quality Audit
                    </Button>
                    <Button variant="default" className="bg-primary hover:bg-primary/90">
                        <PlusCircle className="mr-2 h-4 w-4" /> Add Hotel
                    </Button>
                </div>
            </div>

            {/* Verify Modal */}
            {selectedHotel && (
                <VerifyHotelDialog
                    hotel={selectedHotel}
                    isOpen={isVerifyDialogOpen}
                    onOpenChange={setIsVerifyDialogOpen}
                    onApprove={(id) => handleDialogAction(id, 'approve')}
                    onReject={(id) => handleDialogAction(id, 'reject')}
                    isPending={isPending}
                />
            )}

            <Tabs defaultValue="active" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="bg-muted p-1">
                    <TabsTrigger value="active" className="data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm">Active Listings</TabsTrigger>
                    <TabsTrigger value="pending" className="data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm relative">
                        Pending Approvals
                        {(pendingHotels.length + pendingRooms.length) > 0 && (
                            <span className="ml-2 bg-orange-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                                {pendingHotels.length + pendingRooms.length}
                            </span>
                        )}
                    </TabsTrigger>
                </TabsList>

                {/* Active Listings Tab */}
                <TabsContent value="active">
                    <Card className="border-none shadow-sm overflow-hidden bg-card">
                        <CardHeader className="bg-card border-b border-border px-6 py-4 flex flex-row items-center justify-between">
                            <CardTitle className="text-base font-semibold text-foreground">Registered Hotels ({allHotels.length})</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <DataTable columns={allHotelsColumns} data={allHotels} />
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Pending Approvals Tab */}
                <TabsContent value="pending" className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Pending Hotels Card */}
                        <Card className="border-none shadow-sm overflow-hidden h-full flex flex-col bg-card">
                            <CardHeader className="bg-card border-b border-border py-4">
                                <div className="flex justify-between items-center">
                                    <CardTitle className="text-base font-semibold text-foreground">New Hotel Requests</CardTitle>
                                    <span className="bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 text-xs px-2 py-1 rounded-full font-medium">
                                        {pendingHotels.length} Pending
                                    </span>
                                </div>
                            </CardHeader>
                            <CardContent className="p-0 flex-1">
                                <Table>
                                    <TableBody>
                                        {pendingHotels.map(hotel => (
                                            <TableRow key={hotel.id} className="hover:bg-muted/30">
                                                <TableCell className="pl-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-10 w-10 relative rounded-md overflow-hidden bg-muted shrink-0">
                                                            {hotel.coverImage ? (
                                                                <Image src={hotel.coverImage} fill className="object-cover" alt={hotel.name} />
                                                            ) : (
                                                                <Building className="h-5 w-5 text-muted-foreground m-auto mt-2.5" />
                                                            )}
                                                        </div>
                                                        <div className="space-y-0.5">
                                                            <p className="font-medium text-sm text-foreground">{hotel.name}</p>
                                                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                                <UserIcon className="h-3 w-3" /> {hotel.ownerName}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right pr-6">
                                                    <div className="flex justify-end gap-2">
                                                        <Button size="sm" variant="outline" className="h-8 gap-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 border-blue-200 dark:border-blue-800" onClick={() => handleInspect(hotel)}>
                                                            <Eye className="h-4 w-4" /> Inspect
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                        {pendingHotels.length === 0 && (
                                            <TableRow>
                                                <TableCell colSpan={2} className="h-32 text-center text-muted-foreground">
                                                    No pending hotel requests
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>

                        {/* Pending Rooms Card */}
                        <Card className="border-none shadow-sm overflow-hidden h-full flex flex-col bg-card">
                            <CardHeader className="bg-card border-b border-border py-4">
                                <div className="flex justify-between items-center">
                                    <CardTitle className="text-base font-semibold text-foreground">New Room Requests</CardTitle>
                                    <span className="bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 text-xs px-2 py-1 rounded-full font-medium">
                                        {pendingRooms.length} Pending
                                    </span>
                                </div>
                            </CardHeader>
                            <CardContent className="p-0 flex-1">
                                <Table>
                                    <TableBody>
                                        {pendingRooms.map(room => (
                                            <TableRow key={room.id} className="hover:bg-muted/30">
                                                <TableCell className="pl-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-10 w-10 relative rounded-md overflow-hidden bg-muted shrink-0">
                                                            {room.images?.[0] ? (
                                                                <Image src={room.images[0]} fill className="object-cover" alt={room.title} />
                                                            ) : (
                                                                <BedDouble className="h-5 w-5 text-muted-foreground m-auto mt-2.5" />
                                                            )}
                                                        </div>
                                                        <div className="space-y-0.5">
                                                            <p className="font-medium text-sm line-clamp-1 text-foreground">{room.title}</p>
                                                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                                <Building className="h-3 w-3" /> {room.hotelName}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right pr-6">
                                                    <div className="flex justify-end gap-2">
                                                        <Button size="icon" variant="outline" className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900/20 border-green-200 dark:border-green-800" onClick={() => onRoomAction(room.id, 'approve')} disabled={isPending}>
                                                            <Check className="h-4 w-4" />
                                                        </Button>
                                                        <Button size="icon" variant="outline" className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 border-red-200 dark:border-red-800" onClick={() => onRoomAction(room.id, 'reject')} disabled={isPending}>
                                                            <X className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                        {pendingRooms.length === 0 && (
                                            <TableRow>
                                                <TableCell colSpan={2} className="h-32 text-center text-muted-foreground">
                                                    No pending room requests
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
