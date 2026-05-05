
"use client";

import React, { useState } from 'react';
import { Sidebar } from './sidebar';
import { VirtualTourSection } from './virtual-tour-section';
import { BookingsView } from './bookings-view';
import { PricingView } from './pricing-view';
import { SettingsView } from './settings-view';
import { Hotel, Room, Booking } from '@/lib/types';
import { AddRoomForm } from '@/components/features/room/add-room-form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { formatINR } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

import { HotelDetailsEditor } from './hotel-details-editor';
import { EditRoomDialog } from './edit-room-dialog';
import { Pencil } from 'lucide-react';

interface HotelManagerProps {
    hotel: Hotel;
    rooms: Room[];
    ownerHotels: Hotel[];
    bookings: Booking[];
}

export function HotelManager({ hotel, rooms, ownerHotels, bookings }: HotelManagerProps) {
    const [activeSection, setActiveSection] = useState('overview');
    const [editingRoom, setEditingRoom] = useState<Room | null>(null);
    const [isEditRoomOpen, setIsEditRoomOpen] = useState(false);

    const handleEditRoom = (room: Room) => {
        setEditingRoom(room);
        setIsEditRoomOpen(true);
    };

    const handleRoomUpdateSuccess = () => {
        // In a real app with SWR/React Query, this would trigger revalidation.
        // For this demo, we might need to rely on page refresh or parent re-fetch.
        // Or we could pass a refreshment function from parent.
        window.location.reload();
    };

    const renderContent = () => {
        switch (activeSection) {
            case 'overview':
                return (
                    <div className="space-y-6 animate-in fade-in duration-500">
                        <div className="flex flex-col gap-2">
                            <h2 className="text-3xl font-bold tracking-tight text-slate-900">Overview</h2>
                            <p className="text-muted-foreground">Welcome back to {hotel.name}. Here's what's happening.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <Card className="bg-white shadow-sm border-slate-200">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-medium text-muted-foreground">Total Rooms</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{rooms.length}</div>
                                </CardContent>
                            </Card>
                            {/* Add more stats here */}
                        </div>
                    </div>
                );
            case 'details':
                return <HotelDetailsEditor hotel={hotel} />;
            case 'virtual-tour':
                return <VirtualTourSection hotel={hotel} />;
            case 'rooms':
                return (
                    <div className="space-y-8 animate-in fade-in duration-500">
                        <div className="flex flex-col gap-2">
                            <h2 className="text-3xl font-bold tracking-tight text-slate-900">Room Management</h2>
                            <p className="text-muted-foreground">Add and manage your rooms.</p>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="space-y-8">
                                <AddRoomForm ownerHotels={ownerHotels} selectedHotelId={hotel.id} />
                            </div>
                            <div>
                                <Card className="border-slate-200 shadow-sm">
                                    <CardHeader>
                                        <CardTitle>Your Rooms</CardTitle>
                                        <CardDescription>A list of all rooms at {hotel.name}.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="p-0">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Room</TableHead>
                                                    <TableHead>Price</TableHead>
                                                    <TableHead>Status</TableHead>
                                                    <TableHead className="text-right">Actions</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {rooms.length > 0 ? rooms.map((room) => (
                                                    <TableRow key={room.id}>
                                                        <TableCell className="font-medium">
                                                            <div className="flex items-center gap-3">
                                                                <div className="relative h-10 w-16 overflow-hidden rounded-md bg-slate-100">
                                                                    {room.images[0] && (
                                                                        <Image src={room.images[0]} alt={room.title} fill className="object-cover" />
                                                                    )}
                                                                </div>
                                                                <div>
                                                                    <p className="font-bold text-sm">{room.title}</p>
                                                                    <p className="text-xs text-muted-foreground">{room.capacity} Guests</p>
                                                                </div>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>{formatINR(room.price)}</TableCell>
                                                        <TableCell>
                                                            <Badge variant={room.status === 'approved' ? 'default' : room.status === 'pending' ? 'secondary' : 'destructive'} className="capitalize">
                                                                {room.status}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            <Button variant="ghost" size="icon" onClick={() => handleEditRoom(room)}>
                                                                <Pencil className="h-4 w-4 text-slate-500" />
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                )) : (
                                                    <TableRow>
                                                        <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                                                            No rooms added yet.
                                                        </TableCell>
                                                    </TableRow>
                                                )}
                                            </TableBody>
                                        </Table>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                        <EditRoomDialog
                            room={editingRoom}
                            open={isEditRoomOpen}
                            onOpenChange={setIsEditRoomOpen}
                            onSuccess={handleRoomUpdateSuccess}
                        />
                    </div>
                );
            case 'bookings':
                return <BookingsView bookings={bookings} />;
            case 'pricing':
                return <PricingView rooms={rooms} />;
            case 'settings':
                return <SettingsView hotel={hotel} />;
            default:
                return (
                    <div className="flex flex-col items-center justify-center h-[50vh] text-center space-y-4 animate-in fade-in">
                        <div className="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center">
                            <Menu className="h-8 w-8 text-slate-300" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900">Coming Soon</h3>
                        <p className="text-slate-500 max-w-sm">
                            The {activeSection} section is currently under development. Check back later!
                        </p>
                    </div>
                );
        }
    };

    return (
        <div className="flex min-h-[calc(100vh-64px)] bg-slate-50/50">
            {/* Desktop Sidebar */}
            <div className="hidden md:block w-72 shrink-0 border-r border-slate-200 bg-white">
                <Sidebar
                    activeSection={activeSection}
                    onSelectSection={setActiveSection}
                    className="h-full bg-white text-slate-900 border-none"
                />
            </div>

            {/* Mobile Sidebar & Content */}
            <div className="flex-1 flex flex-col min-w-0">
                <div className="md:hidden border-b border-slate-200 bg-white p-4 flex items-center justify-between sticky top-0 z-20">
                    <span className="font-bold text-lg">{hotel.name}</span>
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon"><Menu className="h-6 w-6" /></Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="p-0 w-72">
                            <Sidebar
                                activeSection={activeSection}
                                onSelectSection={(section) => {
                                    setActiveSection(section);
                                    // wrapper to close would need state, but this is simple demo
                                }}
                                className="bg-white text-slate-900"
                            />
                        </SheetContent>
                    </Sheet>
                </div>

                <div className="flex-1 p-4 md:p-8 lg:p-12 overflow-y-auto">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
}
