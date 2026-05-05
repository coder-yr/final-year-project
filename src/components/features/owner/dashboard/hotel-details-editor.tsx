"use client";

import { useState } from "react";
import { Hotel } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { updateHotel } from "@/lib/data";
import { Loader2, Save } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface HotelDetailsEditorProps {
    hotel: Hotel;
}

export function HotelDetailsEditor({ hotel }: HotelDetailsEditorProps) {
    const { toast } = useToast();
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState({
        name: hotel.name,
        description: hotel.description,
        location: hotel.location,
        address: hotel.address,
        phone: hotel.phone,
        email: hotel.email,
        website: hotel.website || "",
        checkInTime: hotel.checkInTime,
        checkOutTime: hotel.checkOutTime,
        coverImage: hotel.coverImage,
    });

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await updateHotel(hotel.id, formData);
            toast({
                title: "Success",
                description: "Hotel details updated successfully.",
            });
        } catch (error) {
            console.error(error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to update hotel details.",
            });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col gap-2">
                <h2 className="text-3xl font-bold tracking-tight text-slate-900">Hotel Details</h2>
                <p className="text-muted-foreground">Manage your property information.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>General Information</CardTitle>
                    <CardDescription>Basic details about your property.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Hotel Name</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => handleChange('name', e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="location">City / Location</Label>
                            <Input
                                id="location"
                                value={formData.location}
                                onChange={(e) => handleChange('location', e.target.value)}
                            />
                        </div>
                        <div className="col-span-2 space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) => handleChange('description', e.target.value)}
                                className="min-h-[100px]"
                            />
                        </div>
                        <div className="col-span-2 space-y-2">
                            <Label htmlFor="address">Full Address</Label>
                            <Input
                                id="address"
                                value={formData.address}
                                onChange={(e) => handleChange('address', e.target.value)}
                            />
                        </div>
                        <div className="col-span-2 space-y-2">
                            <Label htmlFor="coverImage">Cover Image URL</Label>
                            <Input
                                id="coverImage"
                                value={formData.coverImage}
                                onChange={(e) => handleChange('coverImage', e.target.value)}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Contact & Policies</CardTitle>
                    <CardDescription>Contact info and check-in/out times.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone</Label>
                            <Input
                                id="phone"
                                value={formData.phone}
                                onChange={(e) => handleChange('phone', e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                value={formData.email}
                                onChange={(e) => handleChange('email', e.target.value)}
                            />
                        </div>
                        <div className="col-span-2 space-y-2">
                            <Label htmlFor="website">Website (Optional)</Label>
                            <Input
                                id="website"
                                value={formData.website}
                                onChange={(e) => handleChange('website', e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="checkIn">Check-in Time</Label>
                            <Input
                                id="checkIn"
                                value={formData.checkInTime}
                                onChange={(e) => handleChange('checkInTime', e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="checkOut">Check-out Time</Label>
                            <Input
                                id="checkOut"
                                value={formData.checkOutTime}
                                onChange={(e) => handleChange('checkOutTime', e.target.value)}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="flex justify-end">
                <Button onClick={handleSave} disabled={isSaving} className="w-full md:w-auto">
                    {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                    Save Changes
                </Button>
            </div>
        </div>
    );
}
