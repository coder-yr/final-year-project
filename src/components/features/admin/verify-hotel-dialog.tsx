"use client";

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Hotel } from "@/lib/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { FileText, MapPin, Building, Check, X, GalleryVerticalEnd } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface VerifyHotelDialogProps {
    hotel: Hotel;
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onApprove: (id: string) => void;
    onReject: (id: string) => void;
    isPending: boolean;
}

export function VerifyHotelDialog({
    hotel,
    isOpen,
    onOpenChange,
    onApprove,
    onReject,
    isPending
}: VerifyHotelDialogProps) {

    // Combine cover image with documents for preview if they are images, else show link
    const images = [hotel.coverImage, ...(hotel.images || [])].filter(Boolean);

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl h-[90vh] flex flex-col p-0 overflow-hidden">
                <div className="flex-1 flex flex-col md:flex-row overflow-hidden">

                    {/* Left Side: Visuals (Images & Map placeholder) */}
                    <div className="w-full md:w-2/5 bg-slate-50 border-r border-slate-200 flex flex-col">
                        <div className="aspect-video relative w-full bg-slate-200">
                            <Image
                                src={hotel.coverImage}
                                alt={hotel.name}
                                fill
                                className="object-cover"
                            />
                            <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">Cover Image</div>
                        </div>

                        <ScrollArea className="flex-1 p-4">
                            <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                                <GalleryVerticalEnd className="h-4 w-4 text-muted-foreground" />
                                Uploaded Documents
                            </h4>

                            {hotel.documents && hotel.documents.length > 0 ? (
                                <div className="space-y-2">
                                    {hotel.documents.map((doc, idx) => (
                                        <a
                                            key={idx}
                                            href={doc.url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="flex items-center gap-3 p-3 bg-white rounded-lg border border-slate-200 hover:border-blue-400 hover:bg-blue-50 transition-colors group"
                                        >
                                            <div className="h-10 w-10 bg-slate-100 rounded flex items-center justify-center shrink-0 group-hover:bg-white">
                                                <FileText className="h-5 w-5 text-slate-500 group-hover:text-blue-500" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-sm font-medium truncate">{doc.name}</p>
                                                <p className="text-xs text-muted-foreground">Click to view</p>
                                            </div>
                                        </a>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-sm text-muted-foreground p-4 text-center border-2 border-dashed border-slate-200 rounded-lg">
                                    No documents uploaded
                                </div>
                            )}
                        </ScrollArea>
                    </div>

                    {/* Right Side: Details */}
                    <ScrollArea className="flex-1 p-6 md:p-8">
                        <DialogHeader className="mb-6">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <Badge variant="outline" className="mb-2 bg-orange-50 text-orange-700 border-orange-200">Pending Review</Badge>
                                    <DialogTitle className="text-2xl font-bold font-headline">{hotel.name}</DialogTitle>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-muted-foreground">Submitted by</p>
                                    <p className="font-medium">{hotel.ownerName}</p>
                                    <p className="text-xs text-muted-foreground">{hotel.ownerEmail}</p>
                                </div>
                            </div>
                            <DialogDescription className="flex items-center gap-2 mt-2 text-base">
                                <MapPin className="h-4 w-4 text-muted-foreground" /> {hotel.location}
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-6">
                            <div>
                                <h3 className="font-semibold text-lg mb-2">Description</h3>
                                <p className="text-muted-foreground leading-relaxed">{hotel.description}</p>
                            </div>

                            <Separator />

                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <h3 className="font-semibold text-sm mb-3">Property Details</h3>
                                    <ul className="space-y-2 text-sm text-slate-600">
                                        <li className="flex justify-between">
                                            <span>Type:</span> <span className="font-medium text-slate-900">{hotel.category || 'Hotel'}</span>
                                        </li>
                                        <li className="flex justify-between">
                                            <span>Rooms:</span> <span className="font-medium text-slate-900">Unknown</span>
                                        </li>
                                        <li className="flex justify-between">
                                            <span>Contact:</span> <span className="font-medium text-slate-900">{hotel.phone}</span>
                                        </li>
                                    </ul>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-sm mb-3">Policies</h3>
                                    <ul className="space-y-2 text-sm text-slate-600">
                                        <li className="flex justify-between">
                                            <span>Check-in:</span> <span className="font-medium text-slate-900">{hotel.checkInTime}</span>
                                        </li>
                                        <li className="flex justify-between">
                                            <span>Check-out:</span> <span className="font-medium text-slate-900">{hotel.checkOutTime}</span>
                                        </li>
                                        <li className="flex justify-between">
                                            <span>Pet Friendly:</span> <span className="font-medium text-slate-900">{hotel.isPetFriendly ? 'Yes' : 'No'}</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            <Separator />

                            <div>
                                <h3 className="font-semibold text-sm mb-3">Amenities</h3>
                                <div className="flex flex-wrap gap-2">
                                    {hotel.facilities.map((facility, i) => (
                                        <Badge key={i} variant="secondary" className="px-3 py-1 bg-slate-100 text-slate-700 hover:bg-slate-200">
                                            {facility}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </ScrollArea>
                </div>

                <DialogFooter className="p-4 border-t bg-slate-50 flex justify-between items-center sm:justify-between">
                    <p className="text-xs text-muted-foreground">
                        Review all documents carefully before approving.
                    </p>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            className="border-red-200 text-red-700 hover:bg-red-50 hover:text-red-800"
                            onClick={() => onReject(hotel.id)}
                            disabled={isPending}
                        >
                            <X className="mr-2 h-4 w-4" />
                            Reject Application
                        </Button>
                        <Button
                            variant="default"
                            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white border-0"
                            onClick={() => onApprove(hotel.id)}
                            disabled={isPending}
                        >
                            <Check className="mr-2 h-4 w-4" />
                            Approve Property
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
